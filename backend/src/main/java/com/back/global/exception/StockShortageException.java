package com.back.global.exception;

import java.util.List;
import java.util.Map;

public class StockShortageException extends ServiceException {
    private final List<Map<String, Object>> shortages;

    public StockShortageException(List<Map<String, Object>> shortages) {
        super("400-STOCK-FAIL", "재고 부족");
        this.shortages = shortages;
    }

    public List<Map<String, Object>> getShortages() {
        return shortages;
    }
}
