package com.smartgrocery.controller;

import com.smartgrocery.model.Order;
import com.smartgrocery.model.Product;
import com.smartgrocery.repository.CartRepository;
import com.smartgrocery.repository.OrderRepository;
import com.smartgrocery.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderRepository orderRepository;
    private final CartRepository cartRepository;
    private final ProductRepository productRepository;

    private String getUserId(Authentication auth) {
        return (String) auth.getCredentials();
    }

    @PostMapping("/place")
    public ResponseEntity<?> placeOrder(@RequestBody Map<String, Object> body,
                                        Authentication auth) {
        String userId = getUserId(auth);

        String customerName = (String) body.get("customerName");
        String phone = (String) body.get("phone");
        String address = (String) body.get("address");
        String email = (String) body.get("email");
        String paymentMethod = (String) body.getOrDefault("paymentMethod", "COD");

        @SuppressWarnings("unchecked")
        List<Map<String, Object>> items = (List<Map<String, Object>>) body.get("items");

        if (items == null || items.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "No items in order"));
        }

        List<Order.OrderItem> orderItems = new ArrayList<>();
        double totalPrice = 0;

        for (Map<String, Object> item : items) {
            String productId = (String) item.get("productId");
            int quantity = (int) item.get("quantity");

            Product product = productRepository.findById(productId).orElse(null);
            if (product == null) continue;

            double subtotal = product.getPrice() * quantity;
            totalPrice += subtotal;

            orderItems.add(new Order.OrderItem(
                productId,
                product.getName(),
                product.getImage(),
                product.getPrice(),
                quantity,
                subtotal
            ));

            // Reduce stock
            product.setStock(Math.max(0, product.getStock() - quantity));
            if (product.getStock() == 0) product.setStatus("Out of Stock");
            productRepository.save(product);
        }

        // Apply 10% discount if total > 2000
        double discount = totalPrice > 2000 ? totalPrice * 0.10 : 0;
        double finalPrice = totalPrice - discount;

        String today = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd"));

        Order order = new Order();
        order.setUserId(userId);
        order.setCustomerName(customerName);
        order.setPhone(phone);
        order.setAddress(address);
        order.setEmail(email);
        order.setItems(orderItems);
        order.setTotalPrice(totalPrice);
        order.setDiscount(discount);
        order.setFinalPrice(finalPrice);
        order.setPaymentMethod(paymentMethod);
        order.setPaymentStatus("COD".equals(paymentMethod) ? "Pending" : "Paid");
        order.setDeliveryStatus("Processing");
        order.setOrderDate(today);

        Order saved = orderRepository.save(order);

        // Clear user cart
        cartRepository.deleteByUserId(userId);

        return ResponseEntity.ok(Map.of(
            "order", saved,
            "message", "Order placed successfully! 🎉",
            "deliveryMessage", "Your groceries will be delivered today evening 🚚\nDoor delivery between 5 PM – 7 PM"
        ));
    }

    @GetMapping("/my-orders")
    public ResponseEntity<List<Order>> myOrders(Authentication auth) {
        String userId = getUserId(auth);
        return ResponseEntity.ok(orderRepository.findByUserId(userId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getOrder(@PathVariable String id) {
        return orderRepository.findById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    // Admin endpoints
    @GetMapping("/admin/all")
    public ResponseEntity<List<Order>> getAllOrders() {
        return ResponseEntity.ok(orderRepository.findAllByOrderByCreatedAtDesc());
    }

    @GetMapping("/admin/today")
    public ResponseEntity<List<Order>> getTodayOrders() {
        String today = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd"));
        return ResponseEntity.ok(orderRepository.findByOrderDateOrderByCreatedAtDesc(today));
    }

    @GetMapping("/admin/stats")
    public ResponseEntity<Map<String, Object>> getDailyStats() {
        String today = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd"));
        List<Order> todayOrders = orderRepository.findByOrderDate(today);
        List<Order> allOrders = orderRepository.findAll();

        double todaySales = todayOrders.stream().mapToDouble(Order::getFinalPrice).sum();
        double totalSales = allOrders.stream().mapToDouble(Order::getFinalPrice).sum();

        return ResponseEntity.ok(Map.of(
            "todayOrders", todayOrders.size(),
            "todaySales", todaySales,
            "totalOrders", allOrders.size(),
            "totalSales", totalSales
        ));
    }

    @PutMapping("/admin/{id}/status")
    public ResponseEntity<?> updateOrderStatus(@PathVariable String id,
                                               @RequestBody Map<String, String> body) {
        return orderRepository.findById(id).map(order -> {
            order.setDeliveryStatus(body.get("status"));
            return ResponseEntity.ok(orderRepository.save(order));
        }).orElse(ResponseEntity.notFound().build());
    }
}
