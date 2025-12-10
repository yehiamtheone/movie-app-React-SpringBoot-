package dev.yk.movies.dtos;

import org.bson.types.ObjectId;

public record DeleteReviewDto(
        ObjectId reviewId,
        String movieTitle
) {
}
