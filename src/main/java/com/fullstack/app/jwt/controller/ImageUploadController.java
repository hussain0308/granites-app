package com.fullstack.app.jwt.controller;


import java.io.IOException;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.cloudinary.Cloudinary;

@RestController
@RequestMapping("/upload")
@CrossOrigin("*")
public class ImageUploadController {

   private final Cloudinary cloudinary;
   
   public ImageUploadController(Cloudinary cloudinary) {
       this.cloudinary = cloudinary;
   }


    @PostMapping
    public ResponseEntity<List<String>> uploadImages(
            @RequestParam("files") MultipartFile[] files
    ) throws IOException {

    

        List<String> imageUrls = new ArrayList<>();

        for (MultipartFile file : files) {
        	Map uploadResult = cloudinary.uploader().upload(
        		    file.getBytes(),
        		    Map.of("folder", "granites-products")
        		);
        	
            String imageUrl = uploadResult.get("secure_url").toString();
            
            imageUrls.add(imageUrl);
        }

        return ResponseEntity.ok(imageUrls);
    }
}