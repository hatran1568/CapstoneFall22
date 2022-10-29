package com.planner.backendserver.repository;
import com.planner.backendserver.entity.Provider;
import com.planner.backendserver.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public interface UserRepository extends JpaRepository<User,Integer> {
    @Query("SELECT u FROM User u WHERE u.userID = :id")
    User findByUserID(int id);

    @Query("SELECT u FROM User u WHERE u.email = :email")
    User findByEmail(String email);
    @Modifying
    @Query("UPDATE User u SET u.provider = ?2 WHERE u.userID = ?1")
    public void updateAuthenticationType(int UserID, Provider authType);

    @Modifying
    @Transactional
    @Query("UPDATE User u SET u.avatar=:newAvatar WHERE u.userID=:userID")
    public void updateAvatar(int userID, String newAvatar);

    @Modifying
    @Transactional
    @Query("UPDATE User u SET u.name=:newUsername WHERE u.userID=:userId")
    public void updateUsername(int userId, String newUsername);
    @Modifying
    @Transactional
    @Query("UPDATE User u SET u.password=:newPassword WHERE u.userID=:userId")
    public void updatePassword(int userId, String newPassword);
    @Modifying
    @Transactional
    @Query("UPDATE User u SET u.resetPasswordToken=:token WHERE u.userID=:userId")
    public void updateResetToken(int userId, String token);

}
