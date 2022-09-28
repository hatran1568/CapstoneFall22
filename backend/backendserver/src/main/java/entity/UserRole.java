package entity;


import lombok.Data;

import javax.persistence.*;

@Data
@Entity
@Table(name="user_role")
@IdClass(UserRolePK.class)
public class UserRole {

    @Id
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Id
    @ManyToOne
    @JoinColumn(name = "role_id", nullable = false)
    private Role role;



}
