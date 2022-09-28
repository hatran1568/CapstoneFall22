package entity;

import java.io.Serializable;
import java.util.Objects;

public class UserRolePK implements Serializable {
    private User user;
    private Role role;

    public UserRolePK() {
    }

    public UserRolePK(User user, Role role) {
        this.user = user;
        this.role = role;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof UserRolePK)) return false;
        UserRolePK that = (UserRolePK) o;
        return user.equals(that.user) && role.equals(that.role);
    }

    @Override
    public int hashCode() {
        return Objects.hash(user, role);
    }
}
