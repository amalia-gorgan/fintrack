package nl.fontys.fintrack.fintrack.usecase;

import nl.fontys.fintrack.fintrack.entity.User;
import nl.fontys.fintrack.fintrack.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class GetUserByIdUseCaseTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private GetUserByIdUseCase useCase;

    @Test
    void execute_returnsUser_whenUserExists() {
        // Arrange
        Long userId = 1L;
        User expectedUser = new User();
        expectedUser.setUserId(userId);

        when(userRepository.findById(userId))
                .thenReturn(Optional.of(expectedUser));

        // Act
        User result = useCase.execute(userId);

        // Assert
        assertThat(result).isEqualTo(expectedUser);
    }

    @Test
    void execute_throwsException_whenUserDoesNotExist() {
        // Arrange
        Long userId = 1L;

        when(userRepository.findById(userId))
                .thenReturn(Optional.empty());

        // Act + Assert
        assertThatThrownBy(() -> useCase.execute(userId))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("User not found");
    }
}
