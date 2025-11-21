package nl.fontys.fintrack.fintrack.infrastructure.config;


import nl.fontys.fintrack.fintrack.repository.UserRepository;
import nl.fontys.fintrack.fintrack.usecase.*;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ApplicationConfig {

    // PasswordHasher is already @Component, Spring auto-wires it

    @Bean
    public RegisterUserUseCase registerUserUseCase(UserRepository userRepository,
                                                   PasswordHasher passwordHasher) {
        return new RegisterUserUseCase(userRepository, passwordHasher);
    }

    @Bean
    public LoginUserUseCase loginUserUseCase(UserRepository userRepository,
                                             PasswordHasher passwordHasher) {
        return new LoginUserUseCase(userRepository, passwordHasher);
    }

    @Bean
    public GetUserByIdUseCase getUserByIdUseCase(UserRepository userRepository) {
        return new GetUserByIdUseCase(userRepository);
    }
}