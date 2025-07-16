package com.back.global.initData;

import com.back.domain.member.member.entity.Member;
import com.back.domain.member.member.repository.MemberRepository;
import com.back.domain.menu.menu.entity.Menu;
import com.back.domain.menu.menu.repository.MenuRepository;
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
//        Menu americano = menuRepository.save(new Menu("아메리카노", "아메리카노 입니다", 3000, 200));
//        Menu latte = menuRepository.save(new Menu("카페라떼","카페라떼입니다", 4000, 200));
//        Menu mocha = menuRepository.save(new Menu("카페모카", "달콤한 초콜릿이 들어간 카페모카입니다", 4500, 150));
//        Menu vanillaLatte = menuRepository.save(new Menu("바닐라라떼", "향긋한 바닐라 시럽이 들어간 라떼입니다", 4500, 180));
//        Menu espresso = menuRepository.save(new Menu("에스프레소", "진한 원두의 향을 즐길 수 있는 에스프레소입니다", 2500, 100));


        // 2. 사용자 등록
        Member user = new Member("admin1@example.com", "1234", Member.Role.ADMIN);
        memberRepository.save(user);

        user = new Member("user1@example.com", "1234");
        memberRepository.save(user);

        user = new Member("user2@example.com", "1234");
        memberRepository.save(user);


    }
}
