package com.back.domain.menu.menu.dto;

import com.back.domain.menu.menu.entity.Menu;

public record MenuDto(
        String name,
        String description,
        int price,
        int stock_count
) {
    public Menu toEntity() {
        return new Menu(name, description, price, stock_count);
    }
}
