package com.smartgrocery.repository;

import com.smartgrocery.model.Cart;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface CartRepository extends MongoRepository<Cart, String> {
    List<Cart> findByUserId(String userId);
    Optional<Cart> findByUserIdAndProductId(String userId, String productId);
    void deleteByUserId(String userId);
    void deleteByUserIdAndProductId(String userId, String productId);
}
