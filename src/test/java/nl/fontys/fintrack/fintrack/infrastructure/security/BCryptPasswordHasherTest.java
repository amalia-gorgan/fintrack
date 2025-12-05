package nl.fontys.fintrack.fintrack.infrastructure.security;

import nl.fontys.fintrack.fintrack.usecase.PasswordHasher;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

public class BCryptPasswordHasherTest {

    private final PasswordHasher hasher = new BCryptPasswordHasher();

    @Test
    public void hash_returnsNonNullAndDifferentFromPlainPassword() {
        // Arrange
        String raw = "password123";

        // Act
        String hashed = hasher.hash(raw);

        // Assert
        assertNotNull(hashed, "Hashed password should not be null");
        assertNotEquals(raw, hashed, "Hashed password should not equal raw password");
        assertTrue(hashed.startsWith("$2"), "BCrypt hash should start with $2");
    }

    @Test
    public void matches_returnsTrue_forCorrectPassword() {
        // Arrange
        String raw = "superSecret!";
        String hashed = hasher.hash(raw);

        // Act
        boolean result = hasher.matches(raw, hashed);

        // Assert
        assertTrue(result, "matches should return true for the correct password");
    }

    @Test
    public void matches_returnsFalse_forIncorrectPassword() {
        // Arrange
        String raw = "superSecret!";
        String hashed = hasher.hash(raw);

        // Act
        boolean result = hasher.matches("wrongPassword", hashed);

        // Assert
        assertFalse(result, "matches should return false for an incorrect password");
    }
}
