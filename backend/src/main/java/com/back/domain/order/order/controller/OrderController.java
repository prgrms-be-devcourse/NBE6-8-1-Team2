package com.back.domain.order.order.controller;

import com.back.domain.order.order.dto.OrderRequestDto;
import com.back.domain.order.order.dto.OrderResponseDto;
import com.back.domain.order.order.serivce.OrderSerivce;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping
public class OrderController {

    private final OrderSerivce orderSerivce;

    // Post /orders : 주문 등록
    @PostMapping("/orders")
    public OrderResponseDto createOrder(
            @RequestBody OrderRequestDto orderRequestDto,
            @AuthenticationPrincipal User user) {
        return orderSerivce.createOrder(orderRequestDto, user);
    }

    // Get /myorder : 내 주문 목록 조회
    @GetMapping("/myorder")
    public List<OrderResponseDto> getMyOrders(
            @AuthenticationPrincipal User user) {
        return orderSerivce.getMyOrders(user);
    }

    // Get /admin/orders : 전체 주문 목록 조회 (관리자)
    @GetMapping("/admin/orders")
    public List<OrderResponseDto> getAllOrders(
            @AuthenticationPrincipal User user) {
        // 권한
        if (!user.getRole().equals("ADMIN")) {
            throw new IllegalStateException("관리자만 접근 가능합니다.");
        }

        return orderSerivce.getAllOrders();
    }
}
