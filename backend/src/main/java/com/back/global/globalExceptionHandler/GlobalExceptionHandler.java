package com.back.global.globalExceptionHandler;

import com.back.global.exception.ServiceException;
import com.back.global.exception.StockShortageException;
import com.back.global.rsData.RsData;
import io.swagger.v3.oas.annotations.Hidden;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@ControllerAdvice
@Hidden // Swagger에서 이 클래스 숨김 처리(로직은 정상 작동)
public class GlobalExceptionHandler {

    // ServiceException 처리 추가
    @ExceptionHandler(ServiceException.class)
    public ResponseEntity<RsData<Void>> handleServiceException(ServiceException e) {
        return ResponseEntity
                .status(getHttpStatusFromCode(e.getResultCode()))
                .body(RsData.fail(e.getMsg()));
    }

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

    // 재고 부족 StockShortageException 처리
    @ExceptionHandler(StockShortageException.class)
    public ResponseEntity<RsData<List<Map<String, Object>>>> handleStockShortage(StockShortageException e) {
        return ResponseEntity
                .badRequest()
                .body(RsData.fail(e.getMsg(), e.getShortages()));
    }

    // 기타 모든 예외 처리
    @ExceptionHandler(Exception.class)
    public ResponseEntity<RsData<Void>> handleException(Exception e) {
        return ResponseEntity
                .internalServerError()
                .body(RsData.fail("서버 오류: " + e.getMessage()));
    }

    private int getHttpStatusFromCode(String code) {
        if (code.startsWith("401")) return 401;
        if (code.startsWith("404")) return 404;
        if (code.startsWith("409")) return 409;
        return 400; // 기본값
    }
}