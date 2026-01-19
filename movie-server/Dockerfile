# STAGE 1: The Build
# Use the official Gradle 8.14.3 image with JDK 21
FROM gradle:8.14.3-jdk21-alpine AS build
WORKDIR /app

# Copy only the configuration files first to cache dependencies
# This makes subsequent builds MUCH faster
COPY build.gradle settings.gradle ./
RUN gradle dependencies --no-daemon

# Copy the rest of your source code
COPY src ./src

# Build the 'bootJar' (the executable jar)
RUN gradle bootJar -x test --no-daemon

# STAGE 2: The Runtime
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Copy the resulting jar from the build stage
# Note: Path is build/libs/ in Gradle 8.x
COPY --from=build /app/build/libs/*.jar app.jar

EXPOSE 8080

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]