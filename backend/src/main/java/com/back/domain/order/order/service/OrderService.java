package com.back.domain.order.order.service;

import com.back.domain.member.member.repository.MemberRepository;
import com.back.domain.menu.menu.entity.Menu;
import com.back.domain.menu.menu.repository.MenuRepository;
import com.back.domain.order.order.dto.OrderMenuDto;
import com.back.domain.order.order.dto.OrderMenuResponseDto;
import com.back.domain.order.order.dto.OrderRequestDto;
import com.back.domain.order.order.dto.OrderResponseDto;
import com.back.domain.order.order.entity.Order;
import com.back.domain.order.order.entity.OrderMenu;
import com.back.domain.order.order.repository.OrderMenuRepository;
import com.back.domain.order.order.repository.OrderRepository;
import com.back.domain.member.member.entity.Member;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class OrderService {
    private final OrderRepository orderRepository;
    private final OrderMenuRepository orderMenuRepository;
    private final MenuRepository menuRepository;
    private final MemberRepository memberRepository;

    // 주문 등록
    public OrderResponseDto createOrder(OrderRequestDto requestDto) {
        Member member = memberRepository.findById(requestDto.getMemberId())
                .orElseThrow(() -> new RuntimeException("일치하는 Member를 찾을 수 없습니다."));

        // 주문생성
        Order order = new Order();
        order.setMember(member);
        int totalPrice = 0;

        for(OrderMenuDto menuDto : requestDto.getOrderMenus()) {
            Menu menu = menuRepository.findById(menuDto.getMenuId())
                    .orElseThrow(() -> new IllegalArgumentException("해당 메뉴가 없습니다"));

            int price = menu.getPrice();
            int quantity = menuDto.getQuantity();
            int subtotal = price * quantity;
            totalPrice += subtotal;

            OrderMenu orderMenu = new OrderMenu();
            orderMenu.setOrder(order);
            orderMenu.setMenu(menu);
            orderMenu.setQuantity(quantity);

            order.addOrderMenu(orderMenu);
        }
        order.setTotalPrice(totalPrice);
        orderRepository.save(order);    // order저장

        List<OrderMenuResponseDto> responseMenus = order.getOrderMenus().stream()
                .map(om -> new OrderMenuResponseDto(
                        om.getMenu().getId(),
                        om.getMenu().getName(),
                        om.getQuantity(),
                        om.getMenu().getPrice()
                )).toList();

        return new OrderResponseDto(
                order.getId(),
                order.getTotalPrice(),
                order.getCreateDate(),
                responseMenus
        );
    }

    // 내 주문목록
    public List<OrderResponseDto> getMyOrders(Member member) {
        List<Order> orders = orderRepository.findByMember(member);

        return orders.stream()
                .map(order -> {
                    List<OrderMenuResponseDto> menuResponses = order.getOrderMenus().stream()
                            .map(om -> new OrderMenuResponseDto(
                                    om.getMenu().getId(),
                                    om.getMenu().getName(),
                                    om.getQuantity(),
                                    om.getMenu().getPrice()
                            )).toList();

                    return new OrderResponseDto(
                            order.getId(),
                            order.getTotalPrice(),
                            order.getCreateDate(),
                            menuResponses
                    );
                }).toList();
    }


    // 전체 주문 목록 조회 (관리자)
    public List<OrderResponseDto> getAllOrders() {
        List<Order> orders = orderRepository.findAll();

        return orders.stream()
                .map(order -> {
                    List<OrderMenuResponseDto> menuResponses = order.getOrderMenus().stream()
                            .map(om -> new OrderMenuResponseDto(
                                    om.getMenu().getId(),
                                    om.getMenu().getName(),
                                    om.getQuantity(),
                                    om.getMenu().getPrice()
                            )).toList();

                    return new OrderResponseDto(
                            order.getId(),
                            order.getTotalPrice(),
                            order.getCreateDate(),
                            menuResponses
                    );
                }).toList();

    }
}
