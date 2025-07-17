package com.back.domain.menu.menu.entity;

import com.back.domain.menu.menu.dto.MenuDto;
import com.back.global.jpa.entity.BaseEntity;
import jakarta.persistence.Entity;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor
public class Menu extends BaseEntity {
    private String name;
    private String description;
    private int price;
    private int stock_count;

    public Menu(String name, String description, int price, int stock_count) {
        this.name = name;
        this.description = description;
        this.price = price;
        this.stock_count = stock_count;
    }

    public void update(MenuDto dto){
        this.name = dto.name();
        this.description = dto.description();
        this.price = dto.price();
        this.stock_count = dto.stock_count();
    }

    // 재고 감소
    public void decreaseStock(int quantity) {
        if (this.stock_count < quantity) {
            throw new IllegalArgumentException("재고가 부족합니다.");
        }
        this.stock_count -= quantity;
    }
}
