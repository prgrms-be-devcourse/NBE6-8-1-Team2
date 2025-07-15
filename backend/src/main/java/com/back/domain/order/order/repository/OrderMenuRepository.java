package com.back.domain.order.order.repository;

import com.back.domain.order.order.entity.OrderMenu;
import org.springframework.data.jpa.repository.JpaRepository;


public interface OrderMenuRepository extends JpaRepository<OrderMenu, Integer> {
}
