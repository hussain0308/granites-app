package com.fullstack.app.jwt.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.fullstack.app.jwt.dto.ProductImageDto;
import com.fullstack.app.jwt.dto.ProductRequest;
import com.fullstack.app.jwt.dto.ProductResponse;
import com.fullstack.app.jwt.entity.Product;
import com.fullstack.app.jwt.entity.ProductImage;
import com.fullstack.app.jwt.repository.ProductRepository;

@Service
public class ProductService {

    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    // =========================
    // ADD PRODUCT
    // =========================
    public ProductResponse addProduct(ProductRequest request) {

        if (productRepository.existsByName(request.name())) {
            throw new IllegalStateException("PRODUCT_ALREADY_EXISTS");
        }

        Product product = new Product(
                request.name(),
                request.description(),
                request.price(),
                request.stock(),
                request.category(),
                request.imageUrl()
        );

        // =========================
        // MULTIPLE IMAGES
        // =========================
        if (request.images() != null &&
                !request.images().isEmpty()) {

            List<ProductImage> imageList =
                    request.images().stream().map(imgDto -> {

                        ProductImage img = new ProductImage();

                        img.setImageUrl(
                                imgDto.getImageUrl()
                        );

                        img.setPrimaryImage(
                                imgDto.isPrimaryImage()
                        );

                        img.setProduct(product);

                        return img;

                    }).collect(java.util.stream.Collectors.toList());;

            product.setImages(imageList);
        }

        Product savedProduct =
                productRepository.save(product);

        return mapToResponse(savedProduct);
    }

    // =========================
    // UPDATE PRODUCT
    // =========================
    public ProductResponse updateProduct(
            Long id,
            ProductRequest request
    ) {

        Product existingProduct =
                productRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Product not found with id: " + id
                                )
                        );

        existingProduct.setName(request.name());
        existingProduct.setDescription(request.description());
        existingProduct.setPrice(request.price());
        existingProduct.setStock(request.stock());
        existingProduct.setCategory(request.category());
        existingProduct.setImageUrl(request.imageUrl());

        // =========================
        // CLEAR OLD IMAGES
        // =========================
        existingProduct.getImages().clear();

        // =========================
        // ADD NEW IMAGES
        // =========================
        if (request.images() != null &&
                !request.images().isEmpty()) {

            List<ProductImage> imageList =
                    request.images().stream().map(imgDto -> {

                        ProductImage img =
                                new ProductImage();

                        img.setImageUrl(
                                imgDto.getImageUrl()
                        );

                        img.setPrimaryImage(
                                imgDto.isPrimaryImage()
                        );

                        img.setProduct(existingProduct);

                        return img;

                    }).collect(java.util.stream.Collectors.toList());

            existingProduct.setImages(imageList);
        }

        Product updatedProduct =
                productRepository.save(existingProduct);

        return mapToResponse(updatedProduct);
    }

    // =========================
    // DELETE PRODUCT
    // =========================
    public String deleteProduct(Long id) {

        Product existingProduct =
                productRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Product not found with id: " + id
                                )
                        );

        productRepository.delete(existingProduct);

        return "Product deleted successfully";
    }

    // =========================
    // GET PRODUCT BY ID
    // =========================
    public ProductResponse getProductById(Long id) {

        Product product =
                productRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Product not found with id: " + id
                                )
                        );

        return mapToResponse(product);
    }

    // =========================
    // GET ALL PRODUCTS
    // =========================
    public List<ProductResponse> getAllProducts() {

        return productRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    // =========================
    // MAP ENTITY -> RESPONSE DTO
    // =========================
    private ProductResponse mapToResponse(
            Product product
    ) {

        List<ProductImageDto> imageDtos = null;

        if (product.getImages() != null) {

            imageDtos =
                    product.getImages().stream()
                            .map(img ->
                                    new ProductImageDto(
                                            img.getImageUrl(),
                                            img.isPrimaryImage()
                                    )
                            )
                            .toList();
        }

        return new ProductResponse(
                product.getId(),
                product.getName(),
                product.getDescription(),
                product.getPrice(),
                product.getStock(),
                product.getCategory(),
                product.getImageUrl(),
                imageDtos
        );
    }
}