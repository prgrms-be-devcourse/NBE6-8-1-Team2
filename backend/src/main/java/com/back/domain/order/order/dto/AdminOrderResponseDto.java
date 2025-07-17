package com.back.domain.order.order.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@AllArgsConstructor
public class AdminOrderResponseDto {
    private int orderId;
    private int userId;
    private String email;
    private LocalDateTime createdAt;
    private int totalPrice;
    private List<OrderMenuResponseDto> orderItems;
}
