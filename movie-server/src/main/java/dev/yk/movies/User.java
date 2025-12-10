package dev.yk.movies;

import lombok.AllArgsConstructor;
import lombok.Builder;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.DocumentReference;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Document(collection = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {
    @Id
    private ObjectId id;
    private String username;
    private String email;
    private String password;
    @DocumentReference
    private List<Movie> watchlist;

    @Builder.Default
    private Set<String> roles = new HashSet<>();


}