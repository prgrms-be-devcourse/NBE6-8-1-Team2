package com.back.domain.order.order.controller;

import com.back.domain.member.member.entity.Member;
import com.back.domain.member.member.entity.Role;
import com.back.domain.member.member.repository.MemberRepository;
import com.back.domain.menu.menu.dto.MenuResponseDto;
import com.back.domain.menu.menu.service.MenuService;
import com.back.domain.order.order.dto.OrderRequestDto;
import com.back.domain.order.order.dto.OrderResponseDto;
import com.back.domain.order.order.service.OrderService;
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
    private final MenuService menuService;

    /*
        Security 인증 적용 전, Member관련 PR 적용시 수정할것!
        Get /orders : 주문 전체 조회
     */
    @GetMapping("/menus")
    @Operation(summary = "메뉴 목록 조회")
    public List<MenuResponseDto> getMenus(@RequestParam int memberId )    // 로그인 한 사람만 조회 가능
                              // @AuthenticationPrincipal User user 추후 수정예정
    {
        return orderService.getAllMenus(memberId);
    }

    /*
        Security 인증 적용 전, Member관련 PR 적용시 수정할것!
        Post /orders : 주문 등록
     */
    @PostMapping("/orders")
    @Operation(summary = "주문등록")
    public OrderResponseDto createOrder(
            @RequestBody OrderRequestDto orderRequestDto,
            @RequestParam int memberId
            // @AuthenticationPrincipal User user   // 추후 수정 예정 부분
    ) {
        Member member = memberRepository.findById((memberId))    // 추후 수정 예정 부분
                .orElseThrow(() -> new RuntimeException("해당 사용자를 찾을 수 없습니다."));

        return orderService.createOrder(orderRequestDto, memberId);
    }

    /*
        Security 인증 적용 전, Member관련 PR 적용시 수정할것!
    */
    @DeleteMapping("/orders/{orderId}")
    @Operation(summary = "주문 삭제")
    public String deleteOrder(
            @PathVariable int orderId,
            @RequestParam int memberId // 추후 @AutenticationPrincipal User user
    ) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new RuntimeException("사용자 없음"));

        orderService.deleteOrder(orderId, member);
        return "주문 삭제 완료";
    }


    @GetMapping("/myorder")
    @Operation(summary = "내 주문 조회 (member id필요)")
    public List<OrderResponseDto> getMyOrders(@RequestParam int memberId // 추후 수정 예정
                                              // @AuthenticationPrincipal User user
    ) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new RuntimeException("해당 사용자를 찾을 수 없습니다."));

        return orderService.getMyOrders(member);
    }

    @GetMapping("/myorder/{orderId}")
    @Operation(summary = "내 주문 상세 조회")
    public OrderResponseDto getOrderDetail(
            @PathVariable int orderId,
            @RequestParam int memberId // 추후 수정 예정
            // @AuthenticationPrincipal User user
    ) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new RuntimeException("해당 사용자를 찾을 수 없습니다."));

        return orderService.getOrderDetailById(orderId, member);
    }


    @GetMapping("/admin/orders")
    @Operation(summary = "관리자 주문 전체 조회")
    public List<OrderResponseDto> getAllOrders(@RequestParam int memberId // 추후 수정 예정
                                               // @AuthenticationPrincipal User user
    ) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new RuntimeException("user not found"));
        // 권한
        if (member.getRole() != Role.ADMIN) {
            throw new IllegalStateException("관리자만 접근 가능합니다.");
        }

        return orderService.getAllOrders();
    }

    private final MemberRepository memberRepository;
}
