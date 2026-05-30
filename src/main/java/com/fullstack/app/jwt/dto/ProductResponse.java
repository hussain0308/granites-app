package com.fullstack.app.jwt.dto;

import java.math.BigDecimal;
import java.util.List;

public record ProductResponse(
        Long id,
        String name,
        String description,
        BigDecimal price,
        Integer stock,
        String category,
        String imageUrl,
        List<ProductImageDto> images
) {
}