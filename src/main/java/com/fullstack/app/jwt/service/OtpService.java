package com.fullstack.app.jwt.service;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import com.fullstack.app.jwt.repository.UserRepository;

@Service
public class OtpService {

    private final JavaMailSender javaMailSender;
    private final UserRepository userRepository;

    private final SecureRandom secureRandom = new SecureRandom();

    // email -> OTP data
    private final Map<String, OtpData> otpStorage = new ConcurrentHashMap<>();

    private final String fromEmail;

    // constructor
    public OtpService(JavaMailSender javaMailSender,
                       UserRepository userRepository) {
        this.javaMailSender = javaMailSender;
        this.userRepository = userRepository;

        this.fromEmail = "no-reply@yourapp.com";
    }

    // =========================
    // SEND OTP
    // =========================
    public void sendOtp(String email) {

        // ✅ check email exists in DB
    	if (!userRepository.existsByEmail(email)) {
    	    throw new RuntimeException("Invalid email or email not registered");
    	}
    	if (!email.matches("^[A-Za-z0-9+_.-]+@gmail\\.com$")) {
    	    throw new RuntimeException("Invalid email format. Use valid Gmail address");
    	}

        String otp = generateOtp();

        otpStorage.put(
                email,
                new OtpData(
                        otp,
                        LocalDateTime.now().plusMinutes(2)
                )
        );

        SimpleMailMessage message = new SimpleMailMessage();

        message.setFrom(fromEmail);
        message.setTo(email);
        message.setSubject("Password Reset OTP");

        message.setText(
                "Hello,\n\n" +
                "We received a request to reset your password.\n\n" +
                "Your OTP is: " + otp + "\n\n" +
                "This OTP is valid for 2 minutes only.\n" +
                "Do not share this OTP with anyone.\n\n" +
                "Regards,\nSupport Team"
        );

        javaMailSender.send(message);

        System.out.println("OTP sent to: " + email);
        System.out.println("Generated OTP: " + otp);
    }
    
    

    // =========================
    // GENERATE OTP
    // =========================
    private String generateOtp() {
        int otp = 100000 + secureRandom.nextInt(900000);
        return String.valueOf(otp);
    }

    // =========================
    // VERIFY OTP
    // =========================
    public boolean verifyOtp(String email, String otp) {

        OtpData data = otpStorage.get(email);

        if (data == null) {
            return false;
        }

        // expiry check (2 minutes)
        if (LocalDateTime.now().isAfter(data.expiryTime())) {
            otpStorage.remove(email);
            return false;
        }

        // OTP match check
        if (!data.otp().equals(otp)) {
            return false;
        }

        // remove after success
        otpStorage.remove(email);

        return true;
    }

    // =========================
    // OTP DATA MODEL
    // =========================
    private record OtpData(String otp, LocalDateTime expiryTime) {}
}