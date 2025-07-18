package com.back.domain.order.order.controller;

import com.back.domain.member.member.entity.Member;
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
// @SecurityRequirement(name = "bearerAuth")
public class OrderController {

    private final OrderService orderService;
    private final Rq rq;

    @GetMapping("/menus")
    @Operation(summary = "메뉴 목록 조회")
    public List<MenuResponseDto> getMenus() {
        return orderService.getAllMenus();
    }

    @PostMapping("/orders")
    @Operation(summary = "주문등록")
    public OrderResponseDto createOrder(@RequestBody OrderRequestDto orderRequestDto) {
        Member member = rq.getActor();
        if (member == null) {throw new RuntimeException("로그인이 필요합니다.");}
        return orderService.createOrder(orderRequestDto, member);
    }

    @DeleteMapping("/orders/{orderId}")
    @Operation(summary = "주문 삭제")
    public String deleteOrder(@PathVariable int orderId) {
        Member member = rq.getActor();
        if (member == null) {
            throw new RuntimeException("로그인이 필요합니다.");
        }
        orderService.deleteOrder(orderId, member);
        return "주문 삭제 완료";
    }

    @GetMapping("/myorder")
    @Operation(summary = "내 주문 조회")
    public List<OrderResponseDto> getMyOrders() {
        Member member = rq.getActor();
        if (member == null) {
            throw new RuntimeException("로그인이 필요합니다.");
        }
        return orderService.getMyOrders(member);
    }

    @GetMapping("/myorder/{orderId}")
    @Operation(summary = "내 주문 상세 조회(orderId 필요)")
    public OrderResponseDto getOrderDetail(@PathVariable int orderId) {
        Member member = rq.getActor();
        if (member == null) {
            throw new RuntimeException("로그인이 필요합니다.");
        }
        return orderService.getOrderDetailById(orderId, member);
    }

    @GetMapping("/admin/orders")
    @Operation(summary = "관리자 주문 전체 조회")
    public List<AdminOrderResponseDto> adminGetAllOrders() {
        Member member = rq.getActor();
        if (member == null) {
            throw new RuntimeException("로그인이 필요합니다.");
        }
        // 권한
        if (member.getRole() != Role.ADMIN) {
            throw new IllegalStateException("관리자만 접근 가능합니다.");
        }
        return orderService.adminGetAllOrders();
    }

    @DeleteMapping("/admin/orders/{orderId}")
    @Operation(summary = "관리자 주문 삭제")
    public String adminDeleteOrder(@PathVariable int orderId) {
        Member member = rq.getActor();
        if (member == null) {
            throw new RuntimeException("로그인이 필요합니다.");
        }
        if (member.getRole() != Role.ADMIN) {
            throw new IllegalStateException("관리자만 접근 가능합니다.");
        }

        orderService.deleteOrder(orderId, member);
        return "주문 삭제 완료";
    }
}
