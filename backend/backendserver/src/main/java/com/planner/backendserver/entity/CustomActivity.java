package com.planner.backendserver.entity;

import lombok.Data;

import javax.persistence.*;

@Data
@Entity
@Table(name="custom_activity")
public class CustomActivity extends MasterActivity {

}
