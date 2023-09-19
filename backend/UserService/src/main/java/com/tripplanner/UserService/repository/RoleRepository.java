package com.tripplanner.UserService.repository;

import com.tripplanner.UserService.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface RoleRepository extends JpaRepository<Role, Integer> {
  @Query(
    value = "select * from role where role_name = :name limit 1",
    nativeQuery = true
  )
  Role getByName(String name);
}
