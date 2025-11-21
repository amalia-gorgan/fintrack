package nl.fontys.fintrack.fintrack.entity;

import lombok.*;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
public class User {

    private Long userId;
    private String email;
    private String passwordHash;
    private String firstName;
    private String lastName;
    private LocalDateTime createdAt;

    // Custom constructor for new users
    public User(String email, String passwordHash, String firstName, String lastName) {
        this.email = email.toLowerCase();
        this.passwordHash = passwordHash;
        this.firstName = firstName;
        this.lastName = lastName;
        this.createdAt = LocalDateTime.now();
    }

    public static boolean isValidEmail(String email) {
        return email != null && email.matches("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$");
    }

    public String getFullName() {
        return firstName + " " + lastName;
    }
}