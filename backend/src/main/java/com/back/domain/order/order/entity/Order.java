package com.back.domain.order.order.entity;

import com.back.global.jpa.entity.BaseEntity;
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
public class Order extends BaseEntity {
    // 주문한 사용자 정보
    // User구현 후 예정
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    // 주문 총 금액
    @Column(name = "total_price")
    private Long totalPrice;

    // 주문에 포함된 메뉴 리스트
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderMenu> orderMenus = new ArrayList<>();

    // 주문 메뉴 추가
    public void addOrderMenu(OrderMenu orderMenu) {
        orderMenus.add(orderMenu);
        orderMenu.setOrder(this);
    }
}
