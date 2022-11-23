package com.example.LocationService.entity;

import lombok.Data;

import javax.persistence.*;

@Data
@Entity
@Table(name="category")
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="category_id",columnDefinition = "INT(1)")
    private int categoryID;

    @Column(name="category_name")
    private String categoryName;

    @Column(name="description", columnDefinition = "text")
    private String description;
}
