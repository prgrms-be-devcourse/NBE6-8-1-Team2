package com.back.domain.order.order.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class AdminOrderResponseDto {
    private int orderId;
    private int userId;
    private String email;
    private LocalDateTime createdAt;
    private int totalPrice;
    private List<OrderResponseDto.OrderItemsResponse> orderItems;

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class OrderItemsResponse {
        private Integer menuId;
        private String name;
        private Integer quantity;
        private Integer price;
    }
}
