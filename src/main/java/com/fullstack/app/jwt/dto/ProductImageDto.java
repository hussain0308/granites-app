package com.fullstack.app.jwt.dto;

public class ProductImageDto {

    private String imageUrl;

    private boolean primaryImage;

    // =========================
    // DEFAULT CONSTRUCTOR
    // =========================
    public ProductImageDto() {
    }

    // =========================
    // PARAMETERIZED CONSTRUCTOR
    // =========================
    public ProductImageDto(
            String imageUrl,
            boolean primaryImage
    ) {
        this.imageUrl = imageUrl;
        this.primaryImage = primaryImage;
    }

    // =========================
    // GETTERS & SETTERS
    // =========================
    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public boolean isPrimaryImage() {
        return primaryImage;
    }

    public void setPrimaryImage(boolean primaryImage) {
        this.primaryImage = primaryImage;
    }
}