package nl.fontys.fintrack.fintrack.infrastructure.persistence;

import nl.fontys.fintrack.fintrack.entity.User;
import nl.fontys.fintrack.fintrack.repository.UserRepository;
import org.springframework.stereotype.Component;
import java.util.Optional;

@Component
public class UserRepositoryImpl implements UserRepository {

    private final JpaUserRepository jpaUserRepository;

    public UserRepositoryImpl(JpaUserRepository jpaUserRepository) {
        this.jpaUserRepository = jpaUserRepository;
    }

    @Override
    public User save(User user) {
        UserJpaEntity jpaEntity = toJpaEntity(user);
        UserJpaEntity saved = jpaUserRepository.save(jpaEntity);
        user.setUserId(saved.getUserId());
        return user;
    }

    @Override
    public Optional<User> findById(Long userId) {
        return jpaUserRepository.findById(userId)
                .map(this::toDomainEntity);
    }

    @Override
    public Optional<User> findByEmail(String email) {
        return jpaUserRepository.findByEmail(email)
                .map(this::toDomainEntity);
    }

    @Override
    public boolean existsByEmail(String email) {
        return jpaUserRepository.existsByEmail(email);
    }

    // Mappers
    private UserJpaEntity toJpaEntity(User user) {
        UserJpaEntity jpa = new UserJpaEntity();
        jpa.setUserId(user.getUserId());
        jpa.setEmail(user.getEmail());
        jpa.setPasswordHash(user.getPasswordHash());
        jpa.setFirstName(user.getFirstName());
        jpa.setLastName(user.getLastName());
        jpa.setCreatedAt(user.getCreatedAt());
        return jpa;
    }

    private User toDomainEntity(UserJpaEntity jpa) {
        // use your 4-arg constructor
        User user = new User(
                jpa.getEmail(),
                jpa.getPasswordHash(),
                jpa.getFirstName(),
                jpa.getLastName()
        );

        // then set the technical fields
        user.setUserId(jpa.getUserId());
        user.setCreatedAt(jpa.getCreatedAt());

        return user;
    }

}