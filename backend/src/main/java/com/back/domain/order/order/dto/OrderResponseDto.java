package com.back.domain.order.order.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class OrderResponseDto {
    private int orderId;
    private int totalPrice;
    private LocalDateTime createdAt;
    private List<OrderItemsResponse> orderItems;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OrderItemsResponse {
        private Integer menuId;
        private String name;
        private Integer quantity;
        private Integer price;

    }
}
