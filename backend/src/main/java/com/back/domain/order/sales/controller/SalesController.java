package com.back.domain.order.sales.controller;

import com.back.domain.order.sales.dto.DailySalesDto;
import com.back.domain.order.sales.entity.DailySales;
import com.back.domain.order.sales.repository.DailySalesRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/admin/sales")
@RequiredArgsConstructor
public class SalesController {

    private final DailySalesRepository dailySalesRepository;

    @GetMapping
    public List<DailySalesDto> getSales(
            @RequestParam(required = false) LocalDate from,
            @RequestParam(required = false) LocalDate to
    ) {
        LocalDate start = from != null ? from : LocalDate.now().minusDays(7);
        LocalDate end = to != null ? to : LocalDate.now();

        List<DailySales> results = dailySalesRepository.findByDateBetweenOrderByDateAsc(start, end);

        return results.stream()
                .map(s -> new DailySalesDto(s.getDate(), s.getTotalSales()))
                .toList();
    }
}
