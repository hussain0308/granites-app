package com.fullstack.app.jwt.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.*;

@Entity
@Table(name = "product_images")
public class ProductImage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String imageUrl;

    // optional
    private boolean primaryImage;

    @ManyToOne
    @JoinColumn(name = "product_id")
    @JsonBackReference
    private Product product;

    // GETTERS & SETTERS

    public Long getId() {
        return id;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public boolean isPrimaryImage() {
        return primaryImage;
    }

    public Product getProduct() {
        return product;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public void setPrimaryImage(boolean primaryImage) {
        this.primaryImage = primaryImage;
    }

    public void setProduct(Product product) {
        this.product = product;
    }
}