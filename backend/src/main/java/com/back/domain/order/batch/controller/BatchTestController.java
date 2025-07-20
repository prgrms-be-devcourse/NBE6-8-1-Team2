package com.back.domain.order.batch.controller;

import com.back.domain.order.batch.service.OrderBatchService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin/batch")
@RequiredArgsConstructor
public class BatchTestController {

    private final OrderBatchService orderBatchService;

    @PostMapping("/test")
    public String runBatchManually() {
        orderBatchService.calculateDailySales();
        return "수동 배치 실행 완료";
    }
}
