package com.fullstack.app.controllerendpoints;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class PageController {

    @GetMapping("/")
    public String home() {
        return "redirect:/index.html"; // better starting point
    }

    @GetMapping("/admin")
    public String adminHome() {
        return "admin_home";
    }

    @GetMapping("/customer")
    public String customerHome() {
        return "customer_home";
    }

    @GetMapping("/login")
    public String login() {
        return "login";
    }

    @GetMapping("/signup")
    public String signup() {
        return "signup";
    }
}
