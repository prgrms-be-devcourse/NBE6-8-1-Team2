package com.back.domain.order.order.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@AllArgsConstructor
public class OrderResponseDto {
    private int orderId;
    private int totalPrice;
    private LocalDateTime createdAt;
    private List<OrderMenuResponseDto> orderMenus;
}
