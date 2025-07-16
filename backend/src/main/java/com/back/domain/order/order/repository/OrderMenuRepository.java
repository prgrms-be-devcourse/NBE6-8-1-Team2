package com.back.domain.order.order.repository;

import com.back.domain.menu.menu.entity.Menu;
import com.back.domain.order.order.entity.Order;
import com.back.domain.order.order.entity.OrderMenu;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderMenuRepository extends JpaRepository<OrderMenu, Integer> {
    List<OrderMenu> findByOrder(Order order);   // 주문 상세 조회
    List<OrderMenu> findByMenu(Menu menu);  // 특정 메뉴에 대한 모든 주문 내역
}
