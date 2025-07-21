package com.back.domain.order.order.entity;

import com.back.domain.member.member.entity.Member;
import com.back.global.jpa.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "`order`")
public class Order extends BaseEntity {

    @ManyToOne
    @JoinColumn(name = "user_id")
    private Member member;

    // 주문 총 금액
    @Column(name = "total_price")
    private int totalPrice;

    // 주문에 포함된 메뉴 리스트
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderMenu> orderItems = new ArrayList<>();

    // 주문 메뉴 추가
    public void addOrderMenu(OrderMenu orderMenu) {
        orderItems.add(orderMenu);
        orderMenu.setOrder(this);
    }

}
