package com.example.LocationService.entity;

import lombok.Data;

import javax.persistence.Entity;
import javax.persistence.Table;

@Data
@Entity
@Table(name="custom_activity")
public class CustomActivity extends MasterActivity {

}
