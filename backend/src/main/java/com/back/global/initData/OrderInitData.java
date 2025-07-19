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

    private static final String IMAGE_URL = "/images/test1.jpg";
    private static final String IMAGE_NAME = "test1.jpg";

    @EventListener(ApplicationReadyEvent.class)
    @Transactional
    public void init() {
        if (memberRepository.findByEmail("admin1@test.com").isPresent()) {
            System.out.println("초기 데이터가 이미 존재합니다. 스킵합니다.");
            return;
        }

        // 메뉴 등록
        Menu americano = menuRepository.save(new Menu("아메리카노", "아메리카노 입니다", 3000, 200, "커피", IMAGE_URL, IMAGE_NAME));
        Menu latte = menuRepository.save(new Menu("카페라떼", "카페라떼입니다", 4000, 200, "커피", IMAGE_URL, IMAGE_NAME));
        Menu mocha = menuRepository.save(new Menu("카페모카", "달콤한 초콜릿이 들어간 카페모카입니다", 4500, 150, "커피", IMAGE_URL, IMAGE_NAME));
        Menu vanillaLatte = menuRepository.save(new Menu("바닐라라떼", "향긋한 바닐라 시럽이 들어간 라떼입니다", 4500, 180, "커피", IMAGE_URL, IMAGE_NAME));
        Menu espresso = menuRepository.save(new Menu("에스프레소", "진한 원두의 향을 즐길 수 있는 에스프레소입니다", 2500, 100, "커피", IMAGE_URL, IMAGE_NAME));

        Menu kenya = menuRepository.save(new Menu("케냐AA", "케냐산 원두의 강렬한 산미와 깊은 풍미", 4800, 120, "원두", IMAGE_URL, IMAGE_NAME));
        Menu ethiopia = menuRepository.save(new Menu("에티오피아 예가체프", "꽃향기와 과일향이 어우러진 에티오피아산 스페셜 원두", 5000, 110, "원두", IMAGE_URL, IMAGE_NAME));
        Menu colombia = menuRepository.save(new Menu("콜롬비아 수프리모", "밸런스가 좋은 콜롬비아 원두", 4500, 130, "원두", IMAGE_URL, IMAGE_NAME));
        Menu brazil = menuRepository.save(new Menu("브라질 산토스", "고소하고 묵직한 바디감의 브라질산 원두", 4300, 100, "원두", IMAGE_URL, IMAGE_NAME));
        Menu guatemala = menuRepository.save(new Menu("과테말라 안티구아", "스모키한 향과 깊은 단맛이 매력적인 과테말라 원두", 4700, 90, "원두", IMAGE_URL, IMAGE_NAME));

        Menu ade = menuRepository.save(new Menu("레몬에이드", "상큼한 레몬이 톡 쏘는 에이드입니다", 3800, 120, "음료", IMAGE_URL, IMAGE_NAME));
        Menu milkTea = menuRepository.save(new Menu("타로 밀크티", "달콤한 타로와 부드러운 밀크티의 조화", 4200, 130, "음료", IMAGE_URL, IMAGE_NAME));
        Menu matchaLatte = menuRepository.save(new Menu("말차 라떼", "쌉쌀한 말차가 들어간 건강한 라떼", 4300, 90, "음료", IMAGE_URL, IMAGE_NAME));

        Menu tiramisu = menuRepository.save(new Menu("티라미수", "부드러운 마스카포네 크림이 가득한 티라미수", 5000, 50, "디저트", IMAGE_URL, IMAGE_NAME));
        Menu macaron = menuRepository.save(new Menu("마카롱 세트", "색색의 달콤한 마카롱 6종 세트", 7000, 30, "디저트", IMAGE_URL, IMAGE_NAME));
        Menu cheesecake = menuRepository.save(new Menu("뉴욕 치즈케이크", "진한 크림치즈 맛의 클래식 치즈케이크", 5500, 40, "디저트", IMAGE_URL, IMAGE_NAME));

        Menu hamSandwich = menuRepository.save(new Menu("햄치즈 샌드위치", "햄과 치즈가 조화로운 클래식 샌드위치", 4800, 60, "샌드위치", IMAGE_URL, IMAGE_NAME));
        Menu chickenWrap = menuRepository.save(new Menu("치킨 랩", "닭가슴살과 채소가 듬뿍 들어간 건강한 랩", 5200, 45, "샌드위치", IMAGE_URL, IMAGE_NAME));

        // 사용자 등록
        Member user1 = new Member("admin1@test.com", passwordEncoder.encode("123456"), "admin1", "서울시 어드민 주소", Role.ADMIN);
        Member user2 = new Member("user1@test.com", passwordEncoder.encode("123456"), "user1", "서울시 강남구");
        Member user3 = new Member("user2@test.com", passwordEncoder.encode("123456"), "user2", "서울시 마포구");
        Member user4 = new Member("user3@test.com", passwordEncoder.encode("123456"), "user3", "서울시 성동구");

        memberRepository.save(user1);
        memberRepository.save(user2);
        memberRepository.save(user3);
        memberRepository.save(user4);

        // 주문 등록
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
