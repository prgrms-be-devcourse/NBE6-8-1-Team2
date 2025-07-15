package com.back.domain.order.order.dto;

import lombok.Getter;

import java.util.List;

@Getter
public class OrderRequestDto {
    private List<OrderMenuDto> orderMenus;
}
