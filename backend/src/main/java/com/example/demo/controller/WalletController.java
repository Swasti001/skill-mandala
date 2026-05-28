package com.example.demo.controller;

import com.example.demo.model.WalletTransaction;
import com.example.demo.model.User;
import com.example.demo.repository.WalletTransactionRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.dto.TransactionDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/user/wallet")
public class WalletController {

    private final WalletTransactionRepository transactionRepository;
    private final UserRepository userRepository;

    public WalletController(WalletTransactionRepository transactionRepository, UserRepository userRepository) {
        this.transactionRepository = transactionRepository;
        this.userRepository = userRepository;
    }

    @GetMapping("/transactions/{userId}")
    public ResponseEntity<List<TransactionDTO>> getTransactions(@PathVariable("userId") Long userId) {
        List<WalletTransaction> txs = transactionRepository.findByUserIdOrderByCreatedAtDesc(userId);
        
        List<TransactionDTO> dtos = txs.stream().map(tx -> {
            String avatar = null;
            if (tx.getOtherUserId() != null) {
                avatar = userRepository.findById(tx.getOtherUserId())
                                        .map(User::getProfilePictureUrl)
                                        .orElse(null);
            }
            return new TransactionDTO(
                tx.getId(),
                tx.getAmount(),
                tx.getType(),
                tx.getDescription(),
                tx.getOtherUserName(),
                avatar,
                tx.getCreatedAt()
            );
        }).collect(Collectors.toList());

        return ResponseEntity.ok(dtos);
    }
}
