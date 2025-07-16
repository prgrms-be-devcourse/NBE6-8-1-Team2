package com.back.domain.order.order.controller;

import com.back.domain.order.order.dto.OrderRequestDto;
import com.back.domain.order.order.dto.OrderResponseDto;
import com.back.domain.order.order.service.OrderService;
import com.back.domain.member.member.entity.Member;
import com.back.domain.member.member.repository.MemberRepository;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
// import org.springframework.security.core.annotation.AuthenticationPrincipal; 시큐리티 보류
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping
public class OrderController {

    private final OrderService orderService;

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
                .orElseThrow(() -> new RuntimeException("user not found"));

        return orderService.createOrder(orderRequestDto);
    }



    @GetMapping("/myorder")
    @Operation(summary = "내 주문 조회 (member id필요)")
    public List<OrderResponseDto> getMyOrders(@RequestParam int memberId // 추후 수정 예정
            // @AuthenticationPrincipal User user
    ) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new RuntimeException("user not found"));

        return orderService.getMyOrders(member);
    }

    @GetMapping("/admin/orders")
    @Operation(summary = "관리자 주문 전체 조회")
    public List<OrderResponseDto> getAllOrders(@RequestParam int memberId // 추후 수정 예정
            // @AuthenticationPrincipal User user
    ) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new RuntimeException("user not found"));
        // 권한
        if (member.getRole() != Member.Role.ADMIN) {
            throw new IllegalStateException("관리자만 접근 가능합니다.");
        }

        return orderService.getAllOrders();
    }

    private final MemberRepository memberRepository;
}
