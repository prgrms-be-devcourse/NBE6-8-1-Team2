package com.back.domain.member.member.service;

import com.back.domain.member.member.entity.Member;
import com.back.domain.member.member.entity.Role;
import com.back.domain.member.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class MemberService {

    private final MemberRepository memberRepository;

    public Member join(String email, String password, String nickname, String address) {
        Member member = new Member(email, password, nickname, address);
        return memberRepository.save(member);
    }

    public Member createUser(Member user) {
        return memberRepository.save(user);
    }

    public Optional<Member> findById(int id) {
        return memberRepository.findById(id);
    }

    public Optional<Member> findByEmail(String email) {
        return memberRepository.findByEmail(email);
    }

    public List<Member> findAll() {
        return memberRepository.findAll();
    }

    public void deleteById(int id) {
        memberRepository.deleteById(id);
    }
}
