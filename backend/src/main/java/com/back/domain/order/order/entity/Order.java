package com.back.domain.order.order.entity;

/*

 */

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Order {
    // 주문 고유 id
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    // 주문한 사용자 정보
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    // 주문 생성일시
    private LocalDateTime createdAt;

    // 주문 총 금액
    private int totalPrice;

    // 주문에 포함된 메뉴 리스트
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderMenu> orderMenus = new ArrayList<>();

    // 주문 메뉴 추가
    public void addOrderMenu(OrderMenu orderMenu) {
        orderMenus.add(orderMenu);
        orderMenu.setOrder(this);
    }
}
