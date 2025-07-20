package com.back.global.file;

import com.back.global.exception.ServiceException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class FileStorageService {

    @Value("${file.upload-dir:./uploads}")
    private String uploadDir;

    // 이미지 파일을 저장하고 접근 URL을 반환

    public String saveImage(MultipartFile file) {
        validateImageFile(file);

        try {
            // 업로드 디렉토리 생성
            Path uploadPath = Paths.get(uploadDir).toAbsolutePath().normalize();
            Files.createDirectories(uploadPath);

            // 고유한 파일명 생성 (중복 방지)
            String originalFileName = file.getOriginalFilename();
            String fileExtension = getFileExtension(originalFileName);
            String newFileName = UUID.randomUUID().toString() + fileExtension;

            // 파일 저장 경로
            Path filePath = uploadPath.resolve(newFileName);

            // 파일 저장
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            // 접근 가능한 URL 반환
            return "/images/" + newFileName;

        } catch (IOException e) {
            throw new ServiceException("500-1", "파일 저장 중 오류가 발생했습니다: " + e.getMessage());
        }
    }

    // 파일 삭제
    public void deleteImage(String imageUrl) {
        if (imageUrl == null || !imageUrl.startsWith("/images/")) {
            return;
        }

        try {
            String fileName = imageUrl.replace("/images/", "");
            Path filePath = Paths.get(uploadDir).resolve(fileName);
            Files.deleteIfExists(filePath);
        } catch (IOException e) {
            System.err.println("파일 삭제 실패: " + imageUrl);
        }
    }

    // 이미지 파일 검증
    private void validateImageFile(MultipartFile file) {
        if (file.isEmpty()) {
            throw new ServiceException("400-1", "파일이 비어있습니다");
        }

        // 파일 크기 검증 (5MB 제한)
        if (file.getSize() > 5 * 1024 * 1024) {
            throw new ServiceException("400-2", "파일 크기는 5MB 이하여야 합니다");
        }

        // 파일 형식 검증
        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new ServiceException("400-3", "이미지 파일만 업로드 가능합니다");
        }

        String fileName = file.getOriginalFilename();
        if (fileName == null || !isValidImageExtension(fileName)) {
            throw new ServiceException("400-4", "지원하지 않는 이미지 형식입니다");
        }
    }

    private String getFileExtension(String fileName) {
        if (fileName == null || !fileName.contains(".")) {
            return "";
        }
        return fileName.substring(fileName.lastIndexOf("."));
    }

    private boolean isValidImageExtension(String fileName) {
        String extension = getFileExtension(fileName).toLowerCase();
        return extension.matches("\\.(jpg|jpeg|png|gif|webp)$");
    }
}