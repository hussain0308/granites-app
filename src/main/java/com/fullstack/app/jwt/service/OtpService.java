package com.fullstack.app.jwt.service;

import java.security.SecureRandom;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.beans.factory.annotation.Value;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;

import org.springframework.web.client.RestTemplate;


import org.springframework.stereotype.Service;


import com.fullstack.app.jwt.repository.UserRepository;

@Service
public class OtpService {

	private final RestTemplate restTemplate;
    private final UserRepository userRepository;
    
    @Value("${brevo.api.key}")
    private String brevoApiKey;

    private final SecureRandom secureRandom = new SecureRandom();

    // email -> OTP data
    private final Map<String, OtpData> otpStorage = new ConcurrentHashMap<>();

    private final String fromEmail;

    // constructor
    public OtpService(
            RestTemplate restTemplate,
            UserRepository userRepository
    ) {
        this.restTemplate = restTemplate;
        this.userRepository = userRepository;
        this.fromEmail = "hussainbasha0308@gmail.com";
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

        sendEmailViaBrevo(
                email,
                otp
        );
       

        System.out.println("OTP sent to: " + email);
        System.out.println("Generated OTP: " + otp);
    }
    
    

    private void sendEmailViaBrevo(
            String email,
            String otp
    ) {

        String url =
            "https://api.brevo.com/v3/smtp/email";

        HttpHeaders headers =
                new HttpHeaders();

        headers.setContentType(
                MediaType.APPLICATION_JSON
        );
        
        System.out.println("BREVO_API_KEY = " + brevoApiKey);

        headers.set(
                "api-key",
                brevoApiKey
        );

        String body = """
        {
          "sender": {
            "name": "Diamond Granites",
            "email": "%s"
          },
          "to": [
            {
              "email": "%s"
            }
          ],
          "subject": "Password Reset OTP",
          "htmlContent": "<h2>Password Reset</h2><p>Your OTP is:</p><h1>%s</h1><p>Valid for 2 minutes.</p>"
        }
        """.formatted(
                fromEmail,
                email,
                otp
        );

        HttpEntity<String> request =
                new HttpEntity<>(
                        body,
                        headers
                );

        try {

            var response = restTemplate.postForEntity(
                    url,
                    request,
                    String.class
            );

            System.out.println("BREVO RESPONSE: " + response.getBody());

        } catch (org.springframework.web.client.HttpClientErrorException e) {

            System.out.println("STATUS = " + e.getStatusCode());

            System.out.println("BODY = " + e.getResponseBodyAsString());

            throw e;
        }
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