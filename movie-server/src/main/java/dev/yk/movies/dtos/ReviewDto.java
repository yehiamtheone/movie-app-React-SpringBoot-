package dev.yk.movies.dtos;

import jakarta.annotation.Nonnull;
import jakarta.validation.constraints.NotBlank;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;

public record ReviewDto(
        @Nonnull
        @NotBlank
        String reviewBody,
        String imdbId
) {}
