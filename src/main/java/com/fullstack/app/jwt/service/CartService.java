package com.fullstack.app.jwt.service;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fullstack.app.jwt.dto.AddToCartRequest;
import com.fullstack.app.jwt.dto.CartItemResponse;
import com.fullstack.app.jwt.dto.CartResponse;
import com.fullstack.app.jwt.dto.UpdateCartRequest;
import com.fullstack.app.jwt.entity.CartItem;
import com.fullstack.app.jwt.entity.Product;
import com.fullstack.app.jwt.entity.User;
import com.fullstack.app.jwt.repository.CartItemRepository;
import com.fullstack.app.jwt.repository.ProductRepository;
import com.fullstack.app.jwt.repository.UserRepository;

@Service
public class CartService {

    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public CartService(CartItemRepository cartItemRepository,
                       ProductRepository productRepository,
                       UserRepository userRepository) {
        this.cartItemRepository = cartItemRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }

    /* ===================== ADD TO CART ===================== */
    public String addToCart(AddToCartRequest request) {

        User user = getCurrentUser();

        Product product = productRepository.findById(request.productId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        if (request.quantity() > product.getStock()) {
            throw new RuntimeException("Requested quantity exceeds stock");
        }

        CartItem existing = cartItemRepository.findByUserAndProduct(user, product)
                .orElse(null);

        if (existing != null) {
            int newQty = existing.getQuantity() + request.quantity();

            if (newQty > product.getStock()) {
                throw new RuntimeException("Requested quantity exceeds stock");
            }

            existing.setQuantity(newQty);
            cartItemRepository.save(existing);

            return "Cart updated";
        }

        CartItem newItem = new CartItem(user, product, request.quantity());
        cartItemRepository.save(newItem);

        return "Added to cart";
    }

    /* ===================== GET CART ===================== */
    public CartResponse getCart() {

        User user = getCurrentUser();

        List<CartItemResponse> items = cartItemRepository.findByUser(user)
                .stream()
                .map(this::mapToResponse)
                .toList();

        BigDecimal total = items.stream()
                .map(CartItemResponse::subtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return new CartResponse(items, total);
    }

    /* ===================== UPDATE CART ===================== */
    public String updateCartItem(Long cartItemId, UpdateCartRequest request) {

        User user = getCurrentUser();

        CartItem item = cartItemRepository.findByIdAndUser(cartItemId, user)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));

        if (request.quantity() > item.getProduct().getStock()) {
            throw new RuntimeException("Stock not available");
        }

        item.setQuantity(request.quantity());
        cartItemRepository.save(item);

        return "Updated";
    }

    /* ===================== REMOVE ITEM ===================== */
    public String removeCartItem(Long cartItemId) {

        User user = getCurrentUser();

        CartItem item = cartItemRepository.findByIdAndUser(cartItemId, user)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));

        cartItemRepository.delete(item);

        return "Removed";
    }

    /* ===================== CLEAR CART (FIXED) ===================== */
    @Transactional
    public String clearCart() {

        User user = getCurrentUser();

        cartItemRepository.deleteByUserId(user.getId());

        return "Cart cleared successfully";
    }

    /* ===================== CURRENT USER ===================== */
    private User getCurrentUser() {

        String username = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();

        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    /* ===================== MAPPER ===================== */
    private CartItemResponse mapToResponse(CartItem item) {

        Product p = item.getProduct();

        BigDecimal subtotal = p.getPrice()
                .multiply(BigDecimal.valueOf(item.getQuantity()));

        return new CartItemResponse(
                item.getId(),
                p.getId(),
                p.getName(),
                p.getPrice(),
                item.getQuantity(),
                subtotal,
                p.getCategory(),
                p.getImageUrl()
        );
    }
}