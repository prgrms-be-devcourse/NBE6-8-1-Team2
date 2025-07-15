package com.back.domain.menu.menu.entity;

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
}
