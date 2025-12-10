package dev.yk.movies;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Document(collection = "reviews")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Review {
    @Id
    @JsonSerialize(using = ToStringSerializer.class)
    private ObjectId id; // its own review id but not a relation type of id
    private String reviewBody;
    private ObjectId userId;
    private String imdbTitle;

    public Review(String reviewBody, ObjectId userId, String imdbTitle) {
        this.reviewBody = reviewBody;
        this.userId = userId;
        this.imdbTitle = imdbTitle;
    }
}
