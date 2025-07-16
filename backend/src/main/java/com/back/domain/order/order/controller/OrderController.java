package com.back.domain.order.order.controller;

import com.back.domain.order.order.dto.OrderRequestDto;
import com.back.domain.order.order.dto.OrderResponseDto;
import com.back.domain.order.order.serivce.OrderSerivce;
import com.back.domain.member.member.entity.Member;
import com.back.domain.member.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
// import org.springframework.security.core.annotation.AuthenticationPrincipal; 시큐리티 보류
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping
public class OrderController {

    private final OrderSerivce orderSerivce;

    /*
        Security 인증 적용 전, Member관련 PR 적용시 수정할것!
        Post /orders : 주문 등록
     */
    @PostMapping("/orders")
    public OrderResponseDto createOrder(
            @RequestBody OrderRequestDto orderRequestDto
            // @AuthenticationPrincipal User user   // 추후 수정 예정 부분
            ) {
        Member member = memberRepository.findById(orderRequestDto.getMemberId())    // 추후 수정 예정 부분
                .orElseThrow(() -> new RuntimeException("user not found"));

        return orderSerivce.createOrder(orderRequestDto, member);
    }


    /*
        Security 인증 적용 전, Member관련 PR 적용시 수정할것!
        Get /myorder : 내 주문 목록 조회
     */
    @GetMapping("/myorder")
    public List<OrderResponseDto> getMyOrders(Member member // 추후 수정 예정
            // @AuthenticationPrincipal User user
    ) {
        return orderSerivce.getMyOrders(member);
    }


    /*
        Security 인증 적용 전, Member관련 PR 적용시 수정할것!
        // Get /admin/orders : 전체 주문 목록 조회 (관리자)
     */
    @GetMapping("/admin/orders")
    public List<OrderResponseDto> getAllOrders(Member member    // 추후 수정 예정
            // @AuthenticationPrincipal User user
    ) {
        // 권한
        if (member.getRole() != Member.Role.ADMIN) {
            throw new IllegalStateException("관리자만 접근 가능합니다.");
        }

        return orderSerivce.getAllOrders();
    }

    private final MemberRepository memberRepository;
}
