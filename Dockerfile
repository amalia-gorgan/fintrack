# ---- Build stage ----
FROM eclipse-temurin:21-jdk AS builder

WORKDIR /app

# Copy Gradle wrapper & config
COPY gradlew .
COPY gradle ./gradle
COPY build.gradle settings.gradle ./
COPY src ./src

RUN chmod +x gradlew

# Build Spring Boot fat jar (bootJar is default with spring-boot plugin)
RUN ./gradlew clean bootJar --no-daemon

# ---- Runtime stage ----
FROM eclipse-temurin:21-jre

ENV JAVA_OPTS=""

WORKDIR /app

# Copy the built jar from the builder stage
# This wildcard works with your 0.0.1-SNAPSHOT jar name
COPY --from=builder /app/build/libs/*.jar app.jar

EXPOSE 8000

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
