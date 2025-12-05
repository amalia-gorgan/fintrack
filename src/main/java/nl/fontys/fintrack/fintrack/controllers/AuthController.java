package nl.fontys.fintrack.fintrack.controllers;

import nl.fontys.fintrack.fintrack.entity.User;
import nl.fontys.fintrack.fintrack.infrastructure.security.JwtTokenProvider;
import nl.fontys.fintrack.fintrack.usecase.LoginUserUseCase;
import nl.fontys.fintrack.fintrack.usecase.RegisterUserUseCase;
import nl.fontys.fintrack.fintrack.usecase.GetUserByIdUseCase;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final RegisterUserUseCase registerUserUseCase;
    private final LoginUserUseCase loginUserUseCase;
    private final GetUserByIdUseCase getUserByIdUseCase;
    private final JwtTokenProvider jwtTokenProvider;

    public AuthController(RegisterUserUseCase registerUserUseCase,
                          LoginUserUseCase loginUserUseCase,
                          GetUserByIdUseCase getUserByIdUseCase,
                          JwtTokenProvider jwtTokenProvider) {
        this.registerUserUseCase = registerUserUseCase;
        this.loginUserUseCase = loginUserUseCase;
        this.getUserByIdUseCase = getUserByIdUseCase;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    // POST /api/auth/register
    @PostMapping("/register")
    public ResponseEntity<RegisterResponse> register(@RequestBody RegisterRequest request) {
        try {
            Long userId = registerUserUseCase.execute(
                    request.email,
                    request.password,
                    request.firstName,
                    request.lastName
            );

            String token = jwtTokenProvider.generateToken(userId);

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(new RegisterResponse(userId, token, "User registered successfully"));

        } catch (IllegalArgumentException e) {
            return ResponseEntity
                    .badRequest()
                    .body(new RegisterResponse(null, null, e.getMessage()));
        }
    }

    // POST /api/auth/login
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        try {
            User user = loginUserUseCase.execute(request.email, request.password);

            String token = jwtTokenProvider.generateToken(user.getUserId());

            return ResponseEntity.ok(new LoginResponse(
                    user.getUserId(),
                    user.getEmail(),
                    user.getFullName(),
                    token,
                    "Login successful"
            ));

        } catch (IllegalArgumentException | IllegalStateException e) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(new LoginResponse(null, null, null, null, e.getMessage()));
        }
    }

    // GET /api/auth/me (get current user from token)
    @GetMapping("/me")
    public ResponseEntity<UserResponse> getCurrentUser(@RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.replace("Bearer ", "");
            Long userId = jwtTokenProvider.getUserIdFromToken(token);
            User user = getUserByIdUseCase.execute(userId);

            return ResponseEntity.ok(new UserResponse(
                    user.getUserId(),
                    user.getEmail(),
                    user.getFirstName(),
                    user.getLastName()
            ));

        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(null);
        }
    }

    //DTOs

    public static class RegisterRequest {
        public String email;
        public String password;
        public String firstName;
        public String lastName;
    }

    public static class RegisterResponse {
        public Long userId;
        public String token;
        public String message;

        public RegisterResponse(Long userId, String token, String message) {
            this.userId = userId;
            this.token = token;
            this.message = message;
        }
    }

    public static class LoginRequest {
        public String email;
        public String password;
    }

    public static class LoginResponse {
        public Long userId;
        public String email;
        public String fullName;
        public String token;
        public String message;

        public LoginResponse(Long userId, String email, String fullName, String token, String message) {
            this.userId = userId;
            this.email = email;
            this.fullName = fullName;
            this.token = token;
            this.message = message;
        }
    }

    public static class UserResponse {
        public Long userId;
        public String email;
        public String firstName;
        public String lastName;

        public UserResponse(Long userId, String email, String firstName, String lastName) {
            this.userId = userId;
            this.email = email;
            this.firstName = firstName;
            this.lastName = lastName;
        }
    }
}
