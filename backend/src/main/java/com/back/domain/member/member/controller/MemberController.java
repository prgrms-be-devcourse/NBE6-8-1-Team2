package com.back.domain.member.member.controller;

import com.back.domain.member.member.dto.MemberDto;
import com.back.domain.member.member.entity.Member;
import com.back.domain.member.member.service.MemberService;
import com.back.global.exception.ServiceException;
import com.back.global.rsData.RsData;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping
@RequiredArgsConstructor
@Tag(name = "MemberAPI", description = "Member관련 API입니다")
public class MemberController {

    private final MemberService memberService;
    private final PasswordEncoder passwordEncoder;

    record MemberJoinReqBody(
            @NotBlank
            @Size(min=2, max=30)
            String email,

            @NotBlank
            @Size(min=2, max=30)
            String password,

            @NotBlank
            @Size(min=2, max=30)
            String nickname,

            @NotBlank
            @Size(min=2, max=30)
            String address
    ) {}

    @PostMapping("/signup")
    public RsData<MemberDto> join(
            @Valid @RequestBody MemberJoinReqBody reqBody
    ) {
        memberService.findByEmail(reqBody.email)
                .ifPresent(_member -> {
                    throw new ServiceException("409-1", "이미 존재하는 이메일입니다.");
                });

        Member member = memberService.join(
                reqBody.email(),
                passwordEncoder.encode(reqBody.password()),
                reqBody.nickname(),
                reqBody.address()
        );

        return new RsData<>(
                "201-1",
                "%s님 환영합니다. 회원가입이 완료되었습니다.".formatted(member.getEmail()),
                new MemberDto(member)
        );

    }

    @Operation(summary = "유저 조회 (임시)")
    @GetMapping("/{id}")
    public ResponseEntity<Member> getById(@PathVariable int id) {
        return memberService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @Operation(summary = "모든 유저 조회 (임시)")
    @GetMapping
    public ResponseEntity<List<Member>> getAll() {
        return ResponseEntity.ok(memberService.findAll());
    }

    @Operation(summary = "특정 유저 삭제 (임시)")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable int id) {
        memberService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
