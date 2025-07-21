package com.back.global.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Value("${file.upload-dir:./uploads}")
    private String uploadDir;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // /images/** 요청을 실제 파일 경로로 매핑
        String location = uploadDir.startsWith("./") ? 
            "file:" + System.getProperty("user.dir") + "/" + uploadDir.substring(2) + "/" :
            "file:" + uploadDir + "/";
            
        registry.addResourceHandler("/images/**")
                .addResourceLocations(location)
                .setCachePeriod(0); // 캐시 비활성화로 즉시 반영
    }
}
