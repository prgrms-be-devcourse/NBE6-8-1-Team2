package com.back.global.springDoc;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;
import org.springframework.context.annotation.Configuration;

@Configuration
@OpenAPIDefinition(info = @Info(title = "카페 관리 API", version = "beta", description = "관리자용 및 사용자용 메뉴/주문 API 서버 문서입니다."))
public class SpringDocConfig {
}
