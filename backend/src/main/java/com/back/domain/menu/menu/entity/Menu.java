package com.back.domain.menu.menu.entity;

import com.back.domain.menu.menu.dto.MenuDto;
import com.back.global.jpa.entity.BaseEntity;
import jakarta.persistence.Entity;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class Menu extends BaseEntity {
    private String name;
    private String description;
    private int price;
    private int stock_count;
    private String imageUrl;      // 이미지 URL
    private String imageName;     // 원본 파일명
    private String category;

    // 모든 필드를 포함한 생성자 추가
    public Menu(String name, String description, int price, int stock_count, String category, String imageUrl, String imageName) {
        this.name = name;
        this.description = description;
        this.price = price;
        this.stock_count = stock_count;
        this.category = category;
        this.imageUrl = imageUrl;
        this.imageName = imageName;
    }

    // DTO 기반 업데이트 시 모든 필드 반영
    public void update(MenuDto dto) {
        this.name = dto.name();
        this.description = dto.description();
        this.price = dto.price();
        this.stock_count = dto.stock_count();
        this.imageUrl = dto.imageUrl();
        this.imageName = dto.imageName();
    }

    // 재고 감소
    public void decreaseStock(int quantity) {
        if (this.stock_count < quantity) {
            throw new IllegalArgumentException("재고가 부족합니다.");
        }
        this.stock_count -= quantity;
    }

    // 수동 getter 추가
    public int getStockCount() {
        return this.stock_count;
    }
}
