package com.back.domain.order.sales.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDate;

@Getter
@AllArgsConstructor
public class DailySalesDto {
    private LocalDate date;
    private int totalSales;
}
