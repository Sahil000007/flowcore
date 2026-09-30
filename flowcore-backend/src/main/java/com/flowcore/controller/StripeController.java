package com.flowcore.controller;

import java.time.LocalDate;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.flowcore.dto.ApiResponse;
import com.flowcore.entity.SalaryRecord;
import com.flowcore.repository.SalaryRecordRepository;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;

@RestController
@RequestMapping("/api/stripe")
@CrossOrigin(origins = { "http://localhost:3000", "http://localhost:5173" })
public class StripeController {

    @Autowired
    private SalaryRecordRepository salaryRecordRepository;

    @Value("${stripe.secret.key:}")
    private String stripeSecretKey;

    @Value("${frontend.url:http://localhost:5173}")
    private String frontendUrl;

    @PostMapping("/create-checkout-session")
    public ResponseEntity<?> createCheckoutSession(@RequestBody Map<String, Object> request) {
        try {
            if (stripeSecretKey == null || stripeSecretKey.isBlank()) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(new ApiResponse(false, "Stripe secret key is not configured"));
            }

            Stripe.apiKey = stripeSecretKey;
            Long salaryId = request.get("salaryId") instanceof Number ? ((Number) request.get("salaryId")).longValue()
                    : null;
            if (salaryId == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(new ApiResponse(false, "Salary ID is required for Stripe checkout"));
            }

            SalaryRecord salary = salaryRecordRepository.findById(salaryId)
                    .orElseThrow(() -> new IllegalArgumentException("Salary record not found"));

            long amountInPaise = Math.round((salary.getNetAmount() != null ? salary.getNetAmount() : 0) * 100);
            if (amountInPaise <= 0) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(new ApiResponse(false,
                                "Net amount must be greater than zero to create a Stripe session"));
            }

            String successUrl = frontendUrl
                    + "/salary?status=success&stripe_session_id={CHECKOUT_SESSION_ID}&salary_id=" + salaryId;
            String cancelUrl = frontendUrl + "/salary?status=cancel";

            SessionCreateParams params = SessionCreateParams.builder()
                    .setMode(SessionCreateParams.Mode.PAYMENT)
                    .setSuccessUrl(successUrl)
                    .setCancelUrl(cancelUrl)
                    .setClientReferenceId(String.valueOf(salaryId))
                    .addLineItem(SessionCreateParams.LineItem.builder()
                            .setQuantity(1L)
                            .setPriceData(SessionCreateParams.LineItem.PriceData.builder()
                                    .setCurrency("inr")
                                    .setUnitAmount(amountInPaise)
                                    .setProductData(SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                            .setName("Salary payout for " + salary.getWorker().getName())
                                            .build())
                                    .build())
                            .build())
                    .build();

            Session session = Session.create(params);
            return ResponseEntity.ok(new ApiResponse(true, "Stripe checkout session created",
                    Map.of("sessionId", session.getId())));
        } catch (StripeException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(false, "Stripe error: " + e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse(false, "Error creating Stripe checkout session: " + e.getMessage()));
        }
    }

    @PostMapping("/confirm-payment")
    public ResponseEntity<?> confirmPayment(@RequestBody Map<String, Object> request) {
        try {
            if (stripeSecretKey == null || stripeSecretKey.isBlank()) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(new ApiResponse(false, "Stripe secret key is not configured"));
            }

            Stripe.apiKey = stripeSecretKey;
            String sessionId = request.get("sessionId") != null ? request.get("sessionId").toString() : null;
            Long salaryId = request.get("salaryId") instanceof Number ? ((Number) request.get("salaryId")).longValue()
                    : null;

            if (sessionId == null || salaryId == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(new ApiResponse(false, "Stripe session ID and salary ID are required"));
            }

            Session session = Session.retrieve(sessionId);
            if (session == null || !"paid".equalsIgnoreCase(session.getPaymentStatus())) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(new ApiResponse(false, "Stripe payment is not completed"));
            }

            SalaryRecord salary = salaryRecordRepository.findById(salaryId)
                    .orElseThrow(() -> new IllegalArgumentException("Salary record not found"));

            salary.setPaymentStatus(SalaryRecord.PaymentStatus.PAID);
            salary.setPaymentDate(LocalDate.now());
            salary.setPaymentMethod("STRIPE");
            salary.setThirdPartyProvider("Stripe");
            salary.setPaymentReference(session.getPaymentIntent());
            salary.setNetAmount(salary.getNetAmount() != null ? salary.getNetAmount() : 0);

            salaryRecordRepository.save(salary);
            return ResponseEntity.ok(new ApiResponse(true, "Stripe payment confirmed", null));
        } catch (StripeException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(false, "Stripe error: " + e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse(false, "Error confirming Stripe payment: " + e.getMessage()));
        }
    }
}
