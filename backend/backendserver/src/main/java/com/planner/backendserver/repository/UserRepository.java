package com.planner.backendserver.repository;
import com.planner.backendserver.entity.Provider;
import com.planner.backendserver.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User,Integer> {
    @Query("SELECT u FROM User u WHERE u.userID = :id")
    User findByUserID(int id);

    @Query("SELECT u FROM User u WHERE u.email = :email")
    User findByEmail(String email);
    @Modifying
    @Query("UPDATE User u SET u.provider = ?2 WHERE u.userID = ?1")
    public void updateAuthenticationType(int UserID, Provider authType);
}
