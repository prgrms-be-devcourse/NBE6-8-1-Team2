package com.back.global.globalExceptionHandler;

import com.back.global.rsData.RsData;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

@ControllerAdvice
public class GlobalExceptionHandler {

    // 일반적인 IllegalArgumentException 처리
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<RsData<Void>> handleIllegalArgument(IllegalArgumentException e) {
        return ResponseEntity
                .badRequest()
                .body(RsData.fail(e.getMessage()));
    }

    // @Valid 유효성 검사 실패 처리
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<RsData<Void>> handleValidationException(MethodArgumentNotValidException e) {
        String errorMessage = e.getBindingResult().getFieldError() != null ?
                e.getBindingResult().getFieldError().getDefaultMessage() :
                "입력값이 올바르지 않습니다.";
        return ResponseEntity
                .badRequest()
                .body(RsData.fail(errorMessage));
    }

    // 기타 모든 예외 처리
    @ExceptionHandler(Exception.class)
    public ResponseEntity<RsData<Void>> handleException(Exception e) {
        return ResponseEntity
                .internalServerError()
                .body(RsData.fail("서버 오류: " + e.getMessage()));
    }
}