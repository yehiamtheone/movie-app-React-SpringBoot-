package dev.yk.movies.dtos;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;
import lombok.Data;
import org.bson.types.ObjectId;
@Data
public class ReviewDocDto {
    @JsonSerialize(using = ToStringSerializer.class)
    private ObjectId id;

    @JsonSerialize(using = ToStringSerializer.class)
    private ObjectId userId;

    private String reviewBody;
    private String imdbTitle;

    public ReviewDocDto(ObjectId id, String reviewBody, ObjectId userId, String imdbTitle) {
        this.id = id;
        this.reviewBody = reviewBody;
        this.userId = userId;
        this.imdbTitle = imdbTitle;
    }
}
