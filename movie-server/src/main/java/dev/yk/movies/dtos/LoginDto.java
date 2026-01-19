package dev.yk.movies.dtos;

import jakarta.annotation.Nonnull;
import jakarta.validation.constraints.Size;

public record LoginDto(
        @Nonnull @Size(min = 3, max = 100)
        String username,
        @Nonnull @Size(min = 5, max = 100)
        String password

)
{}
