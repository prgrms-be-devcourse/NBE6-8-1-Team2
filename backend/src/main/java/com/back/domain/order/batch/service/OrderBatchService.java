package com.back.domain.order.batch.service;

import com.back.domain.order.order.entity.Order;
import com.back.domain.order.order.repository.OrderRepository;
import com.back.domain.order.sales.entity.DailySales;
import com.back.domain.order.sales.repository.DailySalesRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.*;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderBatchService {

    private final OrderRepository orderRepository;
    private final DailySalesRepository dailySalesRepository;

    @Scheduled(cron = "0 0 14 * * *", zone = "Asia/Seoul") // 매일 14시
    public void calculateDailySales() {
        ZonedDateTime now = ZonedDateTime.now(ZoneId.of("Asia/Seoul"));
        ZonedDateTime today2PM = now.withHour(14).withMinute(0).withSecond(0).withNano(0);
        ZonedDateTime start = today2PM.minusDays(1);
        ZonedDateTime end = today2PM;

        LocalDate targetDate = start.toLocalDate();

        // 중복 방지
        if (dailySalesRepository.existsByDate(targetDate)) return;

        List<Order> orders = orderRepository.findByCreateDateBetween(start.toLocalDateTime(), end.toLocalDateTime());
        int total = orders.stream().mapToInt(Order::getTotalPrice).sum();

        DailySales dailySales = new DailySales(null, targetDate, total);
        dailySalesRepository.save(dailySales);

        System.out.println("매출 저장 완료 [" + targetDate + "] ₩" + total);
    }
}
