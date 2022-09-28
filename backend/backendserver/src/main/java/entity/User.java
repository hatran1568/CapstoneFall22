package entity;

import lombok.Data;

import javax.persistence.*;

@Data
@Entity
@Table(name="user")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="user_id",columnDefinition = "INT(1)")
    private int userID;

    @Column(name="avatar")
    private String avatar;

    @Column(name="email")
    private String email;

    @Column(name="password")
    private String password;


}
