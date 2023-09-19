package com.planner.backendserver.entity;

import javax.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "custom_activity")
public class CustomActivity extends MasterActivity {}
