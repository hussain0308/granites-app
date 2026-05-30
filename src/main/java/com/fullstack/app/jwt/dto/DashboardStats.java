package com.fullstack.app.jwt.dto;

public class DashboardStats {

    private long users;
    private long products;
    private long orders;
    private double revenue;

    public DashboardStats(long users, long products, long orders, double revenue) {
        this.users = users;
        this.products = products;
        this.orders = orders;
        this.revenue = revenue;
    }

    public long getUsers() { return users; }
    public long getProducts() { return products; }
    public long getOrders() { return orders; }
    public double getRevenue() { return revenue; }

    public void setUsers(long users) { this.users = users; }
    public void setProducts(long products) { this.products = products; }
    public void setOrders(long orders) { this.orders = orders; }
    public void setRevenue(double revenue) { this.revenue = revenue; }
}