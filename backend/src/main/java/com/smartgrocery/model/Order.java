package com.smartgrocery.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "orders")
public class Order {

    @Id
    private String id;

    private String userId;
    private String customerName;
    private String phone;
    private String address;
    private String email;

    private List<OrderItem> items;

    private double totalPrice;
    private double discount;
    private double finalPrice;

    private String paymentMethod; // COD, Card, UPI
    private String paymentStatus = "Pending"; // Pending, Paid

    private String deliveryStatus = "Processing"; // Processing, Confirmed, Out for Delivery, Delivered

    private String orderDate;
    private long createdAt = System.currentTimeMillis();

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OrderItem {
        private String productId;
        private String productName;
        private String image;
        private double price;
        private int quantity;
        private double subtotal;
    }
}
