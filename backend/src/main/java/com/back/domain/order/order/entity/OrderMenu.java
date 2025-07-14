package com.back.domain.order.order.entity;

import jakarta.persistence.*;
import lombok.Setter;

import java.awt.*;

@Entity
@Setter
public class OrderMenu {
    // 주문 메뉴 고유 id
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    // 이 주문 메뉴가 속한 주문
    @ManyToOne
    @JoinColumn(name = "order_id")
    private Order order;

    // 주문한 메뉴의 정보
    @ManyToOne
    @JoinColumn(name = "menu_id")
    private Menu menu;

    // 주문한 메뉴의 수량
    private int quantity;
}
