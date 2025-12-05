package nl.fontys.fintrack.fintrack.usecase;

import nl.fontys.fintrack.fintrack.entity.User;
import nl.fontys.fintrack.fintrack.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class LoginUserUseCaseTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordHasher passwordHasher;

    @InjectMocks
    private LoginUserUseCase useCase;

    @Test
    void execute_returnsUser_whenCredentialsAreValid() {
        // Arrange
        String email = "test@example.com";
        String rawPassword = "secret";
        String hashedPassword = "hashed-secret";

        User user = new User(email, hashedPassword, "John", "Doe");
        user.setUserId(1L);

        when(userRepository.findByEmail(email)).thenReturn(Optional.of(user));
        when(passwordHasher.matches(rawPassword, hashedPassword)).thenReturn(true);

        // Act
        User result = useCase.execute(email, rawPassword);

        // Assert
        assertSame(user, result);
        verify(userRepository).findByEmail(email);
        verify(passwordHasher).matches(rawPassword, hashedPassword);
    }

    @Test
    void execute_throwsException_whenEmailIsNull() {
        IllegalArgumentException ex = assertThrows(
                IllegalArgumentException.class,
                () -> useCase.execute(null, "password")
        );
        assertEquals("Email is required", ex.getMessage());
        verifyNoInteractions(userRepository, passwordHasher);
    }

    @Test
    void execute_throwsException_whenEmailIsBlank() {
        IllegalArgumentException ex = assertThrows(
                IllegalArgumentException.class,
                () -> useCase.execute("   ", "password")
        );
        assertEquals("Email is required", ex.getMessage());
        verifyNoInteractions(userRepository, passwordHasher);
    }

    @Test
    void execute_throwsException_whenPasswordIsNull() {
        IllegalArgumentException ex = assertThrows(
                IllegalArgumentException.class,
                () -> useCase.execute("test@example.com", null)
        );
        assertEquals("Password is required", ex.getMessage());
        verifyNoInteractions(userRepository, passwordHasher);
    }

    @Test
    void execute_throwsException_whenPasswordIsEmpty() {
        IllegalArgumentException ex = assertThrows(
                IllegalArgumentException.class,
                () -> useCase.execute("test@example.com", "")
        );
        assertEquals("Password is required", ex.getMessage());
        verifyNoInteractions(userRepository, passwordHasher);
    }

    @Test
    void execute_throwsException_whenUserNotFound() {
        String email = "unknown@example.com";

        when(userRepository.findByEmail(email)).thenReturn(Optional.empty());

        IllegalArgumentException ex = assertThrows(
                IllegalArgumentException.class,
                () -> useCase.execute(email, "whatever")
        );
        assertEquals("Invalid email or password", ex.getMessage());
        verify(userRepository).findByEmail(email);
        verifyNoInteractions(passwordHasher);
    }

    @Test
    void execute_throwsException_whenPasswordDoesNotMatch() {
        String email = "test@example.com";
        String rawPassword = "wrong";
        String hashedPassword = "hashed-secret";

        User user = new User(email, hashedPassword, "John", "Doe");
        user.setUserId(1L);

        when(userRepository.findByEmail(email)).thenReturn(Optional.of(user));
        when(passwordHasher.matches(rawPassword, hashedPassword)).thenReturn(false);

        IllegalArgumentException ex = assertThrows(
                IllegalArgumentException.class,
                () -> useCase.execute(email, rawPassword)
        );
        assertEquals("Invalid email or password", ex.getMessage());

        verify(userRepository).findByEmail(email);
        verify(passwordHasher).matches(rawPassword, hashedPassword);
    }
}
