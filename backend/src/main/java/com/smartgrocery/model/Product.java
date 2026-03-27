package com.smartgrocery.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "products")
public class Product {

    @Id
    private String id;

    @NotBlank(message = "Product name is required")
    private String name;

    private String description;

    @Positive(message = "Price must be positive")
    private double price;

    private double originalPrice; // For showing discount

    private int stock;

    private String image;

    private String category; // Fruits, Vegetables, Dairy, Bakery, Snacks, Beverages, Meat, Frozen

    private String status = "Available"; // Available or Out of Stock

    private String unit; // kg, litre, piece, pack

    private boolean featured = false;

    private double rating = 4.0;

    private int reviewCount = 0;

    private long createdAt = System.currentTimeMillis();
}
