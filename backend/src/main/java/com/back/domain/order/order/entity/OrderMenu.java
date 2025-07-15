package com.back.domain.order.order.entity;

import com.back.global.jpa.entity.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.awt.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class OrderMenu extends BaseEntity {
    // 이 주문 메뉴가 속한 주문
    @ManyToOne
    @JoinColumn(name = "order_id")
    private Order order;

    // 주문한 메뉴의 정보
    // Menu 구현 후 예정
    @ManyToOne
    @JoinColumn(name = "menu_id")
    private Menu menu;

    // 주문한 메뉴의 수량
    @Column(name = "quantity", nullable = false, columnDefinition = "INT DEFAULT 1")
    private int quantity;
}
