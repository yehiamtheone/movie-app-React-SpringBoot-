package dev.yk.movies;

import ch.qos.logback.core.net.SyslogOutputStream;
import dev.yk.movies.dtos.DeleteReviewDto;
import dev.yk.movies.dtos.ReviewDocDto;
import dev.yk.movies.dtos.ReviewDto;
import jakarta.validation.Valid;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/reviews")
public class ReviewController {
    @Autowired
    private ReviewService reviewService;


    @PostMapping
    public ResponseEntity<?> createReview(@RequestBody @Valid ReviewDto payload){
        return reviewService.creareReview(payload.reviewBody(),payload.imdbId());
    }
    @DeleteMapping("/delete")
    public ResponseEntity<?> deleteReview(@RequestBody DeleteReviewDto payload){
        return new ResponseEntity<>(reviewService.deleteOne(payload.reviewId(), payload.movieTitle()));

    }
    @PatchMapping("/editRevBody")
    public ResponseEntity<?> editRevBody(@RequestBody ReviewDocDto reqBody){
        return new ResponseEntity<>(reviewService.editReview(reqBody), HttpStatus.OK);

    }
}
