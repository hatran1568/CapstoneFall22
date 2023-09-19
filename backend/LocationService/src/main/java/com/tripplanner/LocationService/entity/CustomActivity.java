package com.tripplanner.LocationService.entity;

import javax.persistence.Entity;
import javax.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "custom_activity")
public class CustomActivity extends MasterActivity {}
