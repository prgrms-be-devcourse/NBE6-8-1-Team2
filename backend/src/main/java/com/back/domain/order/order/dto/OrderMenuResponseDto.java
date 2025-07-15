package com.back.domain.order.order.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class OrderMenuResponseDto {
    private int menuId;
    private String menuName;
    private int quantity;
    private int price;
}
