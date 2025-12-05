package nl.fontys.fintrack.fintrack.usecase;

import nl.fontys.fintrack.fintrack.entity.User;
import nl.fontys.fintrack.fintrack.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class RegisterUserUseCaseTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordHasher passwordHasher;

    @InjectMocks
    private RegisterUserUseCase useCase;

    @Test
    void execute_returnsUserId_whenDataIsValid() {
        String email = "test@example.com";
        String password = "password123";
        String firstName = "John";
        String lastName = "Doe";
        String hashed = "hashed-password";

        User savedUser = new User(email, hashed, firstName, lastName);
        savedUser.setUserId(42L);

        when(userRepository.existsByEmail(email)).thenReturn(false);
        when(passwordHasher.hash(password)).thenReturn(hashed);
        when(userRepository.save(any(User.class))).thenReturn(savedUser);

        Long resultId = useCase.execute(email, password, firstName, lastName);

        assertEquals(42L, resultId);
        verify(userRepository).existsByEmail(email);
        verify(passwordHasher).hash(password);
        verify(userRepository).save(any(User.class));
    }

    @Test
    void execute_throwsException_whenEmailInvalid() {
        String invalidEmail = "not-an-email";

        IllegalArgumentException ex = assertThrows(
                IllegalArgumentException.class,
                () -> useCase.execute(invalidEmail, "password123", "John", "Doe")
        );

        assertEquals("Invalid email format", ex.getMessage());
        // no repository / hasher call when email is invalid
        verifyNoInteractions(userRepository, passwordHasher);
    }

    @Test
    void execute_throwsException_whenEmailAlreadyExists() {
        String email = "test@example.com";

        when(userRepository.existsByEmail(email)).thenReturn(true);

        IllegalArgumentException ex = assertThrows(
                IllegalArgumentException.class,
                () -> useCase.execute(email, "password123", "John", "Doe")
        );

        assertEquals("Email already exists", ex.getMessage());
        verify(userRepository).existsByEmail(email);
        verifyNoMoreInteractions(userRepository);
        verifyNoInteractions(passwordHasher);
    }

    @Test
    void execute_throwsException_whenPasswordTooShort() {
        String email = "test@example.com";

        when(userRepository.existsByEmail(email)).thenReturn(false);

        IllegalArgumentException ex = assertThrows(
                IllegalArgumentException.class,
                () -> useCase.execute(email, "short", "John", "Doe")
        );

        assertEquals("Password must be at least 8 characters", ex.getMessage());
        // repo is called for existsByEmail, passwordHasher is not
        verify(userRepository).existsByEmail(email);
        verifyNoInteractions(passwordHasher);
    }

    @Test
    void execute_throwsException_whenFirstNameMissing() {
        String email = "test@example.com";

        when(userRepository.existsByEmail(email)).thenReturn(false);

        IllegalArgumentException ex = assertThrows(
                IllegalArgumentException.class,
                () -> useCase.execute(email, "password123", "   ", "Doe")
        );

        assertEquals("First name is required", ex.getMessage());
        verify(userRepository).existsByEmail(email);
        verifyNoInteractions(passwordHasher);
    }

    @Test
    void execute_throwsException_whenLastNameMissing() {
        String email = "test@example.com";

        when(userRepository.existsByEmail(email)).thenReturn(false);

        IllegalArgumentException ex = assertThrows(
                IllegalArgumentException.class,
                () -> useCase.execute(email, "password123", "John", null)
        );

        assertEquals("Last name is required", ex.getMessage());
        verify(userRepository).existsByEmail(email);
        verifyNoInteractions(passwordHasher);
    }
}
