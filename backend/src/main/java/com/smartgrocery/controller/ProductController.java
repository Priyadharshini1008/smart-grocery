package com.smartgrocery.controller;

import com.smartgrocery.model.Product;
import com.smartgrocery.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ProductController {

    private final ProductRepository productRepository;

    // PUBLIC endpoints
    @GetMapping("/products/public/all")
    public ResponseEntity<List<Product>> getAllProducts() {
        return ResponseEntity.ok(productRepository.findAll());
    }

    @GetMapping("/products/public/available")
    public ResponseEntity<List<Product>> getAvailableProducts() {
        return ResponseEntity.ok(productRepository.findByStatus("Available"));
    }

    @GetMapping("/products/public/category/{category}")
    public ResponseEntity<List<Product>> getByCategory(@PathVariable String category) {
        return ResponseEntity.ok(productRepository.findByCategoryAndStatus(category, "Available"));
    }

    @GetMapping("/products/public/featured")
    public ResponseEntity<List<Product>> getFeatured() {
        return ResponseEntity.ok(productRepository.findByFeatured(true));
    }

    @GetMapping("/products/public/search")
    public ResponseEntity<List<Product>> search(@RequestParam String q) {
        return ResponseEntity.ok(productRepository.findByNameContainingIgnoreCase(q));
    }

    @GetMapping("/products/public/{id}")
    public ResponseEntity<?> getById(@PathVariable String id) {
        return productRepository.findById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    // ADMIN endpoints
    @PostMapping("/admin/products")
    public ResponseEntity<Product> addProduct(@Valid @RequestBody Product product) {
        if (product.getStock() == 0) {
            product.setStatus("Out of Stock");
        }
        return ResponseEntity.ok(productRepository.save(product));
    }

    @PutMapping("/admin/products/{id}")
    public ResponseEntity<?> updateProduct(@PathVariable String id,
                                           @RequestBody Product updated) {
        return productRepository.findById(id).map(product -> {
            if (updated.getName() != null) product.setName(updated.getName());
            if (updated.getDescription() != null) product.setDescription(updated.getDescription());
            if (updated.getPrice() > 0) product.setPrice(updated.getPrice());
            if (updated.getOriginalPrice() > 0) product.setOriginalPrice(updated.getOriginalPrice());
            if (updated.getStock() >= 0) {
                product.setStock(updated.getStock());
                product.setStatus(updated.getStock() == 0 ? "Out of Stock" : "Available");
            }
            if (updated.getImage() != null) product.setImage(updated.getImage());
            if (updated.getCategory() != null) product.setCategory(updated.getCategory());
            if (updated.getUnit() != null) product.setUnit(updated.getUnit());
            product.setFeatured(updated.isFeatured());
            return ResponseEntity.ok(productRepository.save(product));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/admin/products/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable String id) {
        productRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Product deleted"));
    }

    @PatchMapping("/admin/products/{id}/stock")
    public ResponseEntity<?> updateStock(@PathVariable String id,
                                         @RequestBody Map<String, Integer> body) {
        return productRepository.findById(id).map(product -> {
            int newStock = body.get("stock");
            product.setStock(newStock);
            product.setStatus(newStock == 0 ? "Out of Stock" : "Available");
            return ResponseEntity.ok(productRepository.save(product));
        }).orElse(ResponseEntity.notFound().build());
    }
}
