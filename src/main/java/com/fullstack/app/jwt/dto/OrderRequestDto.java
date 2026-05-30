package com.fullstack.app.jwt.dto;

import java.util.List;
import java.math.BigDecimal;

public class OrderRequestDto {

	private BigDecimal totalAmount;

    private List<OrderItemDto> items;

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }

    public List<OrderItemDto> getItems() {
        return items;
    }

    public void setItems(List<OrderItemDto> items) {
        this.items = items;
    }
}