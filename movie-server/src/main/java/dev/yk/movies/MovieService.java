package dev.yk.movies;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mongodb.client.result.UpdateResult;
import dev.yk.movies.dtos.ReviewDocDto;
import dev.yk.movies.dtos.UserReviewOnMovie;
import org.bson.Document;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.FindAndModifyOptions;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import static java.util.Arrays.stream;

@Service
public class MovieService {
    @Autowired
    private MongoTemplate mongoTemplate;
    @Autowired
    private  MovieRepository movieRepository;
    @Autowired
    private MovieAggregation movieAggregation;
    public List<Movie> AllMovies(){
        return movieRepository.findAll();
    }

    public List<UserReviewOnMovie> singleMovieByImdbId(String id){
        List<Document> rawResults = movieAggregation.usersWithReviewsPipeline(id);
        List<UserReviewOnMovie> resultsall = new ArrayList<>();
       rawResults.forEach(
                doc-> {
//                    System.out.println(doc.get("user"));
                    UserReviewOnMovie obj = new UserReviewOnMovie();
                    Optional<Document> d = Optional.ofNullable((Document) doc.get("user"));
                    d.ifPresent(document -> obj.setUsername(document.getString("username")));
                    String movieTitle = (String) doc.get("movieTitle");
                    String moviePoster = (String) doc.get("moviePoster");
                    obj.setMovieTitle(movieTitle);
                    obj.setMoviePoster(moviePoster);
                    List<Document> reviews = (List<Document>) doc.get("reviews");

                    Optional<List<Document>> reviewsDoc = Optional.ofNullable(reviews);

                    List<Map<String, String>> reviewBodies = reviewsDoc
                            .map(listOfDocs -> listOfDocs.stream()
                                    .map(rev -> Map.of(
                                            "id", rev.getObjectId("_id").toString(),
                                            "body", rev.getString("reviewBody")
                                    ))
                                    .filter(review -> review.get("body") != null &&
                                            !review.get("body").toString().isEmpty())
                                    .collect(Collectors.toList()))
                            .orElse(List.of());

                    obj.setReviewBodies(reviewBodies);

                    resultsall.add(obj);
                }

        );

        return resultsall;


    }

}

