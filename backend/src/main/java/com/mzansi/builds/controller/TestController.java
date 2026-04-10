package com.mzansi.builds.controller;

import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/test")
@CrossOrigin(origins = "http://localhost:4200")
public class TestController {

    @GetMapping
    public Map<String, String> test() {
        Map<String, String> response = new HashMap<>();
        response.put("message", "MzansiBuilds Backend is running!");
        response.put("status", "success");
        return response;
    }
}