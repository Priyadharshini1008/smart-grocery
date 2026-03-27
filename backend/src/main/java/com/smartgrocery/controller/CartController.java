package com.smartgrocery.controller;

import com.smartgrocery.config.JwtUtil;
import com.smartgrocery.model.Cart;
import com.smartgrocery.model.Product;
import com.smartgrocery.repository.CartRepository;
import com.smartgrocery.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartRepository cartRepository;
    private final ProductRepository productRepository;
    private final JwtUtil jwtUtil;

    private String getUserId(Authentication auth) {
        return (String) auth.getCredentials(); // userId stored as credentials
    }

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getCart(Authentication auth) {
        String userId = getUserId(auth);
        List<Cart> cartItems = cartRepository.findByUserId(userId);
        List<Map<String, Object>> result = new ArrayList<>();

        for (Cart item : cartItems) {
            productRepository.findById(item.getProductId()).ifPresent(product -> {
                Map<String, Object> cartItem = new HashMap<>();
                cartItem.put("cartId", item.getId());
                cartItem.put("productId", product.getId());
                cartItem.put("name", product.getName());
                cartItem.put("price", product.getPrice());
                cartItem.put("image", product.getImage());
                cartItem.put("unit", product.getUnit());
                cartItem.put("quantity", item.getQuantity());
                cartItem.put("subtotal", product.getPrice() * item.getQuantity());
                cartItem.put("status", product.getStatus());
                result.add(cartItem);
            });
        }
        return ResponseEntity.ok(result);
    }

    @PostMapping("/add")
    public ResponseEntity<?> addToCart(@RequestBody Map<String, Object> body,
                                       Authentication auth) {
        String userId = getUserId(auth);
        String productId = (String) body.get("productId");
        int quantity = body.containsKey("quantity") ?
            (int) body.get("quantity") : 1;

        Product product = productRepository.findById(productId)
            .orElse(null);
        if (product == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Product not found"));
        }
        if ("Out of Stock".equals(product.getStatus())) {
            return ResponseEntity.badRequest().body(Map.of("error", "Product is out of stock"));
        }

        Optional<Cart> existing = cartRepository.findByUserIdAndProductId(userId, productId);
        Cart cart;
        if (existing.isPresent()) {
            cart = existing.get();
            cart.setQuantity(cart.getQuantity() + quantity);
        } else {
            cart = new Cart(null, userId, productId, quantity, System.currentTimeMillis());
        }
        return ResponseEntity.ok(cartRepository.save(cart));
    }

    @PutMapping("/update/{cartId}")
    public ResponseEntity<?> updateQuantity(@PathVariable String cartId,
                                            @RequestBody Map<String, Integer> body,
                                            Authentication auth) {
        return cartRepository.findById(cartId).map(cart -> {
            int newQty = body.get("quantity");
            if (newQty <= 0) {
                cartRepository.delete(cart);
                return ResponseEntity.ok(Map.of("message", "Item removed"));
            }
            cart.setQuantity(newQty);
            return ResponseEntity.ok(cartRepository.save(cart));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/remove/{cartId}")
    public ResponseEntity<?> removeItem(@PathVariable String cartId) {
        cartRepository.deleteById(cartId);
        return ResponseEntity.ok(Map.of("message", "Item removed"));
    }

    @DeleteMapping("/clear")
    public ResponseEntity<?> clearCart(Authentication auth) {
        String userId = getUserId(auth);
        cartRepository.deleteByUserId(userId);
        return ResponseEntity.ok(Map.of("message", "Cart cleared"));
    }
}
