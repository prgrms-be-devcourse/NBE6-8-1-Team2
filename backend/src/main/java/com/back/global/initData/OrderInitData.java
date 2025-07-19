package com.back.global.initData;

import com.back.domain.member.member.entity.Member;
import com.back.domain.member.member.entity.Role;
import com.back.domain.member.member.repository.MemberRepository;
import com.back.domain.menu.menu.entity.Menu;
import com.back.domain.menu.menu.repository.MenuRepository;
import com.back.domain.order.order.entity.Order;
import com.back.domain.order.order.entity.OrderMenu;
import com.back.domain.order.order.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@RequiredArgsConstructor
public class OrderInitData {
    private final MenuRepository menuRepository;
    private final MemberRepository memberRepository;
    private final OrderRepository orderRepository;
    private final PasswordEncoder passwordEncoder;

    // 기본 입력 데이터입니다.

    @EventListener(ApplicationReadyEvent.class)
    @Transactional
    public void init() {
        // 중복 체크: 이미 admin 계정이 있으면 초기화 하지 않음
        if (memberRepository.findByEmail("admin1@test.com").isPresent()) {
            System.out.println("초기 데이터가 이미 존재합니다. 스킵합니다.");
            return;
        }

        // 1. 메뉴 등록
        Menu americano = menuRepository.save(new Menu("아메리카노", "아메리카노 입니다", 3000, 200, "커피"));
        Menu latte = menuRepository.save(new Menu("카페라떼", "카페라떼입니다", 4000, 200, "커피"));
        Menu mocha = menuRepository.save(new Menu("카페모카", "달콤한 초콜릿이 들어간 카페모카입니다", 4500, 150, "커피"));
        Menu vanillaLatte = menuRepository.save(new Menu("바닐라라떼", "향긋한 바닐라 시럽이 들어간 라떼입니다", 4500, 180, "커피"));
        Menu espresso = menuRepository.save(new Menu("에스프레소", "진한 원두의 향을 즐길 수 있는 에스프레소입니다", 2500, 100, "커피"));

        // 2. 사용자 등록
        Member user1 = new Member("admin1@test.com", passwordEncoder.encode("123456"), "admin1", "서울시 어드민 주소", Role.ADMIN);
        Member user2 = new Member("user1@test.com", passwordEncoder.encode("123456"), "user1", "서울시 강남구");
        Member user3 = new Member("user2@test.com", passwordEncoder.encode("123456"), "user2", "서울시 마포구");
        Member user4 = new Member("user3@test.com", passwordEncoder.encode("123456"), "user3", "서울시 성동구");

        memberRepository.save(user1);
        memberRepository.save(user2);
        memberRepository.save(user3);
        memberRepository.save(user4);


        // 3. 주문 등록 (admin1의 주문, 25개 (편의를 위해 admin1로 했습니다.))
        for (int i = 1; i <= 25; i++) {
            Order order = new Order();
            order.setMember(user1); // admin1

            OrderMenu om1 = new OrderMenu();
            om1.setOrder(order);
            om1.setMenu(americano);
            om1.setQuantity(i % 3 + 1);

            OrderMenu om2 = new OrderMenu();
            om2.setOrder(order);
            om2.setMenu(latte);
            om2.setQuantity((i + 1) % 3 + 1);

            order.addOrderMenu(om1);
            order.addOrderMenu(om2);

            int totalPrice = om1.getMenu().getPrice() * om1.getQuantity()
                    + om2.getMenu().getPrice() * om2.getQuantity();
            order.setTotalPrice(totalPrice);

            orderRepository.save(order);
        }


        System.out.println("초기 데이터 삽입 완료");
    }
}
