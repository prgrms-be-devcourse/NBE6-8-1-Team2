package com.back.domain.order.order.serivce;

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
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class OrderSerivce {
    private final OrderRepository orderRepository;
    private final OrderMenuRepository orderMenuRepository;
    private final MenuRepository menuRepository;

    // 주문 등록
    public OrderResponseDto createOrder(OrderRequestDto requestDto, User user) {
        // 주문생성
        Order order = new Order();
        order.setUser(user);
        order.setTotalPrice(0); // 총 금액 0원 시작
        List<OrderMenu> ordermenus = new ArrayList<>();

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

        List<OrderMenuResponseDto> responseMenus = ordermenus.stream()
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

}
