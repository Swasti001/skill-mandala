package com.example.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendResetPasswordMail(String toEmail, String resetUrl) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("noreply@skillmandala.com"); // Usually overridden by SMTP config (e.g. your_gmail@gmail.com)
        message.setTo(toEmail);
        message.setSubject("Skill Mandala - Password Reset Request");
        message.setText("Hello,\n\n"
                + "You have requested to reset your password. Please click the link below to set a new password:\n\n"
                + resetUrl + "\n\n"
                + "This link will expire in 1 hour.\n\n"
                + "If you did not request a password reset, please ignore this email.\n\n"
                + "Best regards,\n"
                + "The Skill Mandala Team");

        mailSender.send(message);
    }
}
