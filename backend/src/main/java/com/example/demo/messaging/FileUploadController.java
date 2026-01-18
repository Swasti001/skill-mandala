package com.example.demo.messaging;

import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/chat")
public class FileUploadController {

    private final Path fileStorageLocation;

    public FileUploadController() {
        this.fileStorageLocation = Paths.get("uploads/chat")
                .toAbsolutePath().normalize();

        try {
            Files.createDirectories(this.fileStorageLocation);
        } catch (Exception ex) {
            throw new RuntimeException("Could not create the directory where the uploaded files will be stored.", ex);
        }
    }

    @PostMapping("/upload")
    public ResponseEntity<?> uploadFile(@RequestParam("file") MultipartFile file) {
        String fileName = StringUtils.cleanPath(file.getOriginalFilename());

        try {
            // Check if the file's name contains invalid characters
            if (fileName.contains("..")) {
                return ResponseEntity.badRequest().body("Sorry! Filename contains invalid path sequence " + fileName);
            }

            // Generate a unique file name
            String uniqueFileName = UUID.randomUUID().toString() + "_" + fileName;

            // Copy file to the target location (Replacing existing file with the same name)
            Path targetLocation = this.fileStorageLocation.resolve(uniqueFileName);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            String fileUrl = "/uploads/chat/" + uniqueFileName;

            Map<String, Object> response = new HashMap<>();
            response.put("fileUrl", fileUrl);
            response.put("fileName", fileName);
            response.put("contentType", file.getContentType());
            response.put("size", file.getSize());

            return ResponseEntity.ok(response);

        } catch (IOException ex) {
            return ResponseEntity.internalServerError().body("Could not store file " + fileName + ". Please try again!");
        }
    }
}
