package com.back.domain.menu.menu.dto;

import com.back.domain.menu.menu.entity.Menu;

public record MenuResponseDto(
        int id,
        String name,
        String description,
        int price,
        int stock_count,
        String category
) {
    public static MenuResponseDto from(Menu menu) {
        return new MenuResponseDto(
                menu.getId(),
                menu.getName(),
                menu.getDescription(),
                menu.getPrice(),
                menu.getStock_count(),
                menu.getCategory()
        );
    }
}