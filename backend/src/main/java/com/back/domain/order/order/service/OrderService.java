package com.back.domain.order.order.service;

import com.back.domain.member.member.entity.Member;
import com.back.domain.member.member.entity.Role;
import com.back.domain.member.member.repository.MemberRepository;
import com.back.domain.menu.menu.dto.MenuResponseDto;
import com.back.domain.menu.menu.entity.Menu;
import com.back.domain.menu.menu.repository.MenuRepository;
import com.back.domain.order.order.dto.*;
import com.back.domain.order.order.entity.Order;
import com.back.domain.order.order.entity.OrderMenu;
import com.back.domain.order.order.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class OrderService {
    private final OrderRepository orderRepository;
    private final MenuRepository menuRepository;
    private final MemberRepository memberRepository;

    // 사용자 검증을 포함한 메뉴 조회
    public List<MenuResponseDto> getAllMenus(int memberId) {
        memberRepository.findById(memberId)
                .orElseThrow(() -> new IllegalArgumentException("로그인/회원가입 후 진행 해 주세요" ));
        return menuRepository.findAll().stream()
                .map(MenuResponseDto::from)
                .toList();
    }

    // 주문 등록
    public OrderResponseDto createOrder(OrderRequestDto requestDto, int memberId) {
        final Member member = findMemberById(memberId);
        final Order order = new Order();
        order.setMember(member);

        int totalPrice = 0;
        for (OrderMenuRequestDto menuDto : requestDto.orderItems()) {
            final Menu menu = findMenuById(menuDto.menuId());
            final int quantity = menuDto.quantity();

            menu.decreaseStock(quantity);   // 재고 감소
            int subtotal = menu.getPrice() * quantity;
            totalPrice += subtotal;

            OrderMenu orderMenu = new OrderMenu();
            orderMenu.setOrder(order);
            orderMenu.setMenu(menu);
            orderMenu.setQuantity(quantity);
            order.addOrderMenu(orderMenu);
        }

        order.setTotalPrice(totalPrice);
        orderRepository.save(order);    // order저장


        List<OrderMenuResponseDto> responseMenus = order.getOrderItems().stream()
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
                responseMenus,
                member.getEmail()
        );
    }

    // 주문 삭제
    public void deleteOrder(int orderId, Member member) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("주문이 존재하지 않습니다."));

        boolean isOwner = order.getMember().getId() == (member.getId());
        boolean isAdmin = member.getRole() == Role.ADMIN;

        if (!isOwner && !isAdmin) {
            throw new IllegalStateException("주문 삭제는 본인 또는 관리자만 가능합니다.");
        }

        orderRepository.delete(order);
    }


    // 내 주문목록
    public List<OrderResponseDto> getMyOrders(Member member) {
        List<Order> orders = orderRepository.findByMember(member);

        return orders.stream()
                .map(order -> {
                    List<OrderMenuResponseDto> menuResponses = order.getOrderItems().stream()
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
                            menuResponses,
                            member.getEmail()
                    );
                }).toList();
    }

    // 주문 상세 조회
    public OrderResponseDto getOrderDetailById(int orderId, Member member) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("주문이 존재하지 않습니다."));

        boolean isOwner = order.getMember().getId() == member.getId();
        boolean isAdmin = member.getRole() == Role.ADMIN;
        if (!isOwner && !isAdmin) {
            throw new IllegalStateException("해당 주문을 조회할 권한이 없습니다.");
        }

        List<OrderMenuResponseDto> menuResponses = order.getOrderItems().stream()
                .map(om -> new OrderMenuResponseDto(
                        om.getMenu().getId(),
                        om.getMenu().getName(),
                        om.getQuantity(),
                        om.getMenu().getPrice()
                )).toList();

        return new OrderResponseDto(order.getId(), order.getTotalPrice(), order.getCreateDate(), menuResponses, member.getEmail());
    }


    // 전체 주문 목록 조회 (관리자)
    public List<AdminOrderResponseDto> AdminGetAllOrders() {
        List<Order> orders = orderRepository.findAll();

        return orders.stream()
                .map(order -> {
                    List<OrderMenuResponseDto> menuResponses = order.getOrderItems().stream()
                            .map(om -> new OrderMenuResponseDto(
                                    om.getMenu().getId(),
                                    om.getMenu().getName(),
                                    om.getQuantity(),
                                    om.getMenu().getPrice()
                            )).toList();

                    return new AdminOrderResponseDto(
                            order.getId(),
                            order.getMember().getId(),
                            order.getMember().getEmail(),
                            order.getCreateDate(),
                            order.getTotalPrice(),
                            menuResponses
                    );
                }).toList();
    }

    // Member 존재 확인
    private Member findMemberById(int memberId) {
        return memberRepository.findById(memberId)
                .orElseThrow(() -> new RuntimeException("일치하는 Member를 찾을 수 없습니다."));
    }

    // Menu 존재 확인
    private Menu findMenuById(int menuId) {
        return menuRepository.findById(menuId)
                .orElseThrow(() -> new IllegalArgumentException("해당 메뉴가 없습니다"));
    }


}
