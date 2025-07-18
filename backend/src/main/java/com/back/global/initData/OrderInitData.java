package com.back.global.initData;

import com.back.domain.member.member.entity.Member;
import com.back.domain.member.member.entity.Role;
import com.back.domain.member.member.repository.MemberRepository;
import com.back.domain.menu.menu.entity.Menu;
import com.back.domain.menu.menu.repository.MenuRepository;
import com.back.domain.order.order.entity.Order;
import com.back.domain.order.order.entity.OrderMenu;
import com.back.domain.order.order.repository.OrderRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@RequiredArgsConstructor
public class OrderInitData {
    private final MenuRepository menuRepository;
    private final MemberRepository memberRepository;
    private final OrderRepository orderRepository;

    // 기본 입력 데이터입니다.
    @PostConstruct
    @Transactional
    public void init() {
        // 1. 메뉴 등록
        Menu americano = menuRepository.save(new Menu("아메리카노", "아메리카노 입니다", 3000, 200, "커피"));
        Menu latte = menuRepository.save(new Menu("카페라떼", "카페라떼입니다", 4000, 200, "커피"));
        Menu mocha = menuRepository.save(new Menu("카페모카", "달콤한 초콜릿이 들어간 카페모카입니다", 4500, 150, "커피"));
        Menu vanillaLatte = menuRepository.save(new Menu("바닐라라떼", "향긋한 바닐라 시럽이 들어간 라떼입니다", 4500, 180, "커피"));
        Menu espresso = menuRepository.save(new Menu("에스프레소", "진한 원두의 향을 즐길 수 있는 에스프레소입니다", 2500, 100, "커피"));


        // 2. 사용자 등록
        Member user = new Member("admin1@example.com", "123456", Role.ADMIN);
        memberRepository.save(user);

        user = new Member("user1@example.com", "123456", "user1", "서울시 강남구");
        memberRepository.save(user);

        user = new Member("user2@example.com", "123456", "user2", "서울시 마포구");
        memberRepository.save(user);

        user = new Member("user3@example.com", "123456", "user3", "서울시 성동구");
        memberRepository.save(user);

        // 3. 주문 등록
        Order order = new Order();
        order.setMember(user);

        OrderMenu om1 = new OrderMenu();
        om1.setOrder(order);
        om1.setMenu(americano);
        om1.setQuantity(2);
        order.addOrderMenu(om1);

        OrderMenu om2 = new OrderMenu();
        om2.setOrder(order);
        om2.setMenu(latte);
        om2.setQuantity(1);
        order.addOrderMenu(om2);

        int totalPrice = om1.getMenu().getPrice() * om1.getQuantity() + om2.getMenu().getPrice() * om2.getQuantity();
        order.setTotalPrice(totalPrice);

        orderRepository.save(order);

    }
}
