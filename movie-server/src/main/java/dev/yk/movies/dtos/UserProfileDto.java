package dev.yk.movies.dtos;

import dev.yk.movies.Review;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
@Data
public class UserProfileDto{
    private String username;
    private String email;
    private List<Review> reviews;
}
