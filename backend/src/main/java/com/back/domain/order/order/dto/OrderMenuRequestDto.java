package com.back.domain.order.order.dto;

public record OrderMenuRequestDto(
        int menuId,
        int quantity
) {}