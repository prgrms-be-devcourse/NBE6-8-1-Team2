package com.back.domain.order.order.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
public class OrderRequestDto {
    private List<OrderMenuDto> orderMenus;


    @Getter
    @Setter
    private int memberId; // !!!인증인가 적용 전 임시 사용!!!
}
