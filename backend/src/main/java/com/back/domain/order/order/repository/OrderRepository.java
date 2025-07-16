package com.back.domain.order.order.repository;

import com.back.domain.member.member.entity.Member;
import com.back.domain.order.order.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Integer> {

    List<Order> findByMember(Member member); // 특정 유저의 주문 목록
}
