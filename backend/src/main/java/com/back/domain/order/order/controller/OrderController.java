package com.back.domain.order.order.controller;

import com.back.domain.member.member.entity.Role;
import com.back.domain.menu.menu.dto.MenuResponseDto;
import com.back.domain.order.order.dto.AdminOrderResponseDto;
import com.back.domain.order.order.dto.OrderRequestDto;
import com.back.domain.order.order.dto.OrderResponseDto;
import com.back.domain.order.order.service.OrderService;
import com.back.global.rq.Rq;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping
@Tag(name = "OrderAPI", description = "관리자 및 사용자가 사용하는 주문 CRUD API")
public class OrderController {

    private final OrderService orderService;
    private final Rq rq;  // 로그인 사용자 가져오기용

    // 메뉴 전체 조회 (비인증)
    @GetMapping("/menus")
    @Operation(summary = "메뉴 목록 조회")
    public List<MenuResponseDto> getMenus() {
        return orderService.getAllMenus();
    }

    // 주문 등록 (인증 사용자)
    @PostMapping("/orders")
    @Operation(summary = "주문 등록")
    public OrderResponseDto createOrder(@RequestBody OrderRequestDto orderRequestDto) {
        return orderService.createOrder(orderRequestDto, rq.getActor());
    }

    // 주문 삭제
    @DeleteMapping("/orders/{orderId}")
    @Operation(summary = "주문 삭제")
    public String deleteOrder(@PathVariable int orderId) {
        orderService.deleteOrder(orderId, rq.getActor());
        return "주문 삭제 완료";
    }

    // 내 주문 목록 조회
    @GetMapping("/myorder")
    @Operation(summary = "내 주문 조회")
    public List<OrderResponseDto> getMyOrders() {
        return orderService.getMyOrders(rq.getActor());
    }

    // 내 주문 상세 조회
    @GetMapping("/myorder/{orderId}")
    @Operation(summary = "내 주문 상세 조회")
    public OrderResponseDto getOrderDetail(@PathVariable int orderId) {
        return orderService.getOrderDetailById(orderId, rq.getActor());
    }

    // 관리자 주문 전체 조회
    @GetMapping("/admin/orders")
    @Operation(summary = "관리자 주문 전체 조회")
    public List<AdminOrderResponseDto> adminGetAllOrders() {
        if (rq.getActor().getRole() != Role.ADMIN) {
            throw new IllegalStateException("관리자만 접근 가능합니다.");
        }
        return orderService.adminGetAllOrders();
    }

    // 관리자 주문 삭제
    @DeleteMapping("/admin/orders/{orderId}")
    @Operation(summary = "관리자 주문 삭제")
    public String adminDeleteOrder(@PathVariable int orderId) {
        if (rq.getActor().getRole() != Role.ADMIN) {
            throw new IllegalStateException("관리자만 접근 가능합니다.");
        }

        orderService.deleteOrder(orderId, rq.getActor());
        return "주문 삭제 완료";
    }
}
