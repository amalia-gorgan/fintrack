package nl.fontys.fintrack.fintrack.usecase;

public interface PasswordHasher {
    public String hash(String plainPassword);
    public boolean matches(String plainPassword, String hashedPassword);
}
