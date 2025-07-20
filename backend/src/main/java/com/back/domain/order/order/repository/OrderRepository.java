package com.back.domain.order.order.repository;

import com.back.domain.member.member.entity.Member;
import com.back.domain.order.order.entity.Order;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Integer> {
    Page<Order> findByMember(Member member, Pageable pageable); // List -> Page로 변경
    List<Order> findByCreateDateBetween(LocalDateTime start, LocalDateTime end);
}
