package dev.yk.movies;

import dev.yk.movies.dtos.ReviewDocDto;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.FindAndModifyOptions;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class ReviewService {
    @Autowired
    private ReviewRepository reviewRepository;
    @Autowired
    private MovieRepository movieRepository;

    @Autowired
    private MongoTemplate mongoTemplate;

    public ResponseEntity<?> creareReview(String reviewBody, String imdbId){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userId = authentication.getName();
        Optional<Movie> movie = movieRepository.findByImdbId(imdbId);
        if (movie.isEmpty())
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        Review review = reviewRepository.insert(new Review(new ObjectId() ,reviewBody, new ObjectId(userId), movie.get().getTitle()));
        mongoTemplate.update(Movie.class)
                .matching(Criteria.where("imdbId").is(imdbId))
                .apply(new Update().push("reviewIds").value(review))
                .first();
        ReviewDocDto revIdToString = new ReviewDocDto(review.getId(), review.getReviewBody(),
                review.getUserId(), review.getImdbTitle());
        return new ResponseEntity<>(revIdToString, HttpStatus.CREATED);

    }
    public HttpStatus deleteOne(ObjectId reviewId, String movieTitle){
        reviewRepository.deleteById(reviewId);
        Query query = new Query(Criteria.where("title").is(movieTitle));
        Movie movie = mongoTemplate.findOne(query, Movie.class);
        System.out.println(movie);

        Update update = new Update().pull("reviewIds", reviewId);
        mongoTemplate.updateFirst(query, update, Movie.class);

        return HttpStatus.OK;
    }
    public Review editReview(ReviewDocDto reqBody){
        var q = new Query(Criteria.where("_id").is(reqBody.getId()));
        var u = new Update().set("reviewBody", reqBody.getReviewBody());
        var opts = FindAndModifyOptions.options().returnNew(true);
        return mongoTemplate.findAndModify(q, u, opts, Review.class);


    }

}
