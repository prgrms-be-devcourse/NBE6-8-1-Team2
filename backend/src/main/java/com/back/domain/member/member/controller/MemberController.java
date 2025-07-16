package com.back.domain.member.member.controller;

import com.back.domain.member.member.entity.Member;
import com.back.domain.member.member.service.MemberService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
@Tag(name = "MemberAPI(임시용)", description = "임시로 사용하는 Member관련 API입니다")
public class MemberController {

    private final MemberService memberService;

    @Operation(summary = "유저 생성 (임시)")
    @PostMapping
    public ResponseEntity<Member> create(@RequestBody Member member ) {
        return ResponseEntity.ok(memberService.createUser(member));
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
