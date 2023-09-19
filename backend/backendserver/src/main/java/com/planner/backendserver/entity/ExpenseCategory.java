package com.planner.backendserver.entity;

import javax.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "expense_category")
public class ExpenseCategory {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "expense_category_id", columnDefinition = "INT(1)")
  private int expenseCategoryId;

  @Column(name = "icon", columnDefinition = "text")
  private String icon;

  @Column(name = "name")
  private String name;
}
