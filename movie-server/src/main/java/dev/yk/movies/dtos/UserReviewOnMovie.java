package dev.yk.movies.dtos;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;

import java.util.Arrays;
import java.util.List;
import java.util.Map;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class UserReviewOnMovie {
    private String username;
    private List<Map<String, String>> reviewBodies;
    private String movieTitle;
    private String moviePoster;

    @Override
    public String toString() {
        return "UserReviewOnMovie{" +
                "username='" + username + '\'' +
                ", reviewBodies='" + reviewBodies + '\'' +
                ", movieTitle='" + movieTitle + '\'' +
                ", moviePoster='" + moviePoster + '\'' +
                '}';
    }
}
