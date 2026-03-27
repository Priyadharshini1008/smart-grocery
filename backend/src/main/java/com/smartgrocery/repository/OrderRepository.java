package com.smartgrocery.repository;

import com.smartgrocery.model.Order;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface OrderRepository extends MongoRepository<Order, String> {
    List<Order> findByUserId(String userId);
    List<Order> findByOrderDate(String date);
    List<Order> findByDeliveryStatus(String status);
    List<Order> findByOrderDateOrderByCreatedAtDesc(String date);
    List<Order> findAllByOrderByCreatedAtDesc();
}
