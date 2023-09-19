package com.tripplanner.UserService.repository;

import com.tripplanner.UserService.dto.response.UserListDTO;
import com.tripplanner.UserService.entity.Provider;
import com.tripplanner.UserService.entity.User;
import java.util.ArrayList;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {
  @Query("SELECT u FROM User u WHERE u.userID = :id")
  User findByUserID(int id);

  @Query("SELECT u FROM User u WHERE u.email = :email")
  User findByEmail(String email);

  @Modifying
  @Query("UPDATE User u SET u.provider = ?2 WHERE u.userID = ?1")
  void updateAuthenticationType(int UserID, Provider authType);

  @Modifying
  @Transactional
  @Query("UPDATE User u SET u.avatar=:newAvatar WHERE u.userID=:userID")
  void updateAvatar(int userID, String newAvatar);

  @Modifying
  @Transactional
  @Query("UPDATE User u SET u.name=:newUsername WHERE u.userID=:userId")
  void updateUsername(int userId, String newUsername);

  @Modifying
  @Transactional
  @Query("UPDATE User u SET u.password=:newPassword WHERE u.userID=:userId")
  void updatePassword(int userId, String newPassword);

  @Modifying
  @Transactional
  @Query("UPDATE User u SET u.resetPasswordToken=:token WHERE u.userID=:userId")
  void updateResetToken(int userId, String token);

  @Query(
    value = "SELECT u.user_id as userId, u.avatar, u.date_created as created, u.date_modified as modified,\n" +
    "       u.email, u.name, u.role_id as roleId, r.role_name as roleName, (SELECT COUNT(*) FROM trip t WHERE t.user_id = u.user_id) as trips\n" +
    "FROM user u LEFT JOIN role r ON u.role_id = r.role_id\n" +
    "WHERE u.status <> 'DELETED' AND u.name LIKE CONCAT('%',?2,'%')\n" +
    "ORDER BY\n" +
    "    (CASE\n" +
    "        WHEN (?1 = 'dateDESC') THEN u.date_modified\n" +
    "        WHEN (?1 = 'nameDESC') THEN u.name\n" +
    "        WHEN (?1 = 'roleDESC') THEN u.role_id\n" +
    "    END\n" +
    ") DESC,\n" +
    "    (CASE\n" +
    "        WHEN (?1 = 'dateASC') THEN u.date_modified\n" +
    "        WHEN (?1 = 'nameASC') THEN u.name\n" +
    "        WHEN (?1 = 'roleASC') THEN u.role_id\n" +
    "    END\n" +
    ") ASC\n" +
    "LIMIT ?3, ?4",
    nativeQuery = true
  )
  ArrayList<UserListDTO> getUserList(
    String filter,
    String key,
    int page,
    int skip
  );

  @Query(
    value = "SELECT COUNT(*) FROM user u\n" +
    "WHERE u.status <> 'DELETED' AND u.name LIKE CONCAT('%',?1,'%')",
    nativeQuery = true
  )
  int getUserListAdminCount(String nameKeyword);

  @Modifying
  @Transactional
  @Query(
    value = "UPDATE user\n" + "SET status = 'ACTIVE'\n" + "WHERE user_id = ?1",
    nativeQuery = true
  )
  void activateUser(int userId);

  @Modifying
  @Transactional
  @Query(
    value = "UPDATE user\n" +
    "SET status = 'DEACTIVATED'\n" +
    "WHERE user_id = ?1",
    nativeQuery = true
  )
  void deactivateUser(int userId);

  @Modifying
  @Transactional
  @Query(
    value = "UPDATE user\n" + "SET status = 'DELETED'\n" + "WHERE user_id = ?1",
    nativeQuery = true
  )
  void deleteUser(int userId);

  @Query(
    value = "SELECT u.user_id FROM user u left join role r on u.role_id = r.role_id WHERE r.role_name = 'guest' limit 1",
    nativeQuery = true
  )
  Integer findGuestUser();
}
