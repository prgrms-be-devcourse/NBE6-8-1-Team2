package com.back.domain.order.order.dto;

import java.util.List;

public record OrderRequestDto(
        List<OrderMenuRequestDto> orderItems
) {}