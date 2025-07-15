package com.back.domain.order.order.controller;

import com.back.domain.order.order.dto.OrderRequestDto;
import com.back.domain.order.order.dto.OrderResponseDto;
import com.back.domain.order.order.serivce.OrderSerivce;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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


}
