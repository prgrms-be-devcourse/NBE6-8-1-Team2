package com.back.domain.menu.menu.dto;

import com.back.domain.menu.menu.entity.Menu;
import jakarta.validation.constraints.*;

public record MenuDto(
        @NotBlank String name,
        String description,
        @Min(0) int price,
        @Min(0) int stock_count,
        String category
) {
    public Menu toEntity() {
        return new Menu(name, description, price, stock_count, category);
    }
}
