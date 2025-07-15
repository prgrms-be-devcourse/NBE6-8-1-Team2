package com.back.domain.order.order.repository;

import com.back.domain.order.order.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Integer> {

    // 특정 유저의 주문 목록
    List<Order> findByUser(User user);
}
