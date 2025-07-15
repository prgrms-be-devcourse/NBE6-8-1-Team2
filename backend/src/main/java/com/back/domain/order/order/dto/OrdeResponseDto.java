package com.back.domain.order.order.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class OrdeResponseDto {
    private int orderId;
    private LocalDateTime createdAt;
    private Long totalPrice;
    private List<OrderItemsResponse> orderItems;

    public static class OrderItemsResponse {
        private Integer orderId;
        private Integer quantity;

    }
}
