package com.tripplanner.AuthorizationService.entity.reppository;

import com.tripplanner.AuthorizationService.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {
  @Query("SELECT u FROM User u WHERE u.userID = :id")
  User findByUserID(int id);

  @Query("SELECT u FROM User u WHERE u.email = :email")
  User findByEmail(String email);
}
