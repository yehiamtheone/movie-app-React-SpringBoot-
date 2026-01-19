package dev.yk.movies;

import org.bson.Document;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class MovieAggregation {
    @Autowired
    private MongoTemplate mongoTemplate;
    public List<Document> usersWithReviewsPipeline(String id){
        Aggregation agg = Aggregation.newAggregation(
                Aggregation.match(Criteria.where("imdbId").is(id)),
                Aggregation.unwind("reviewIds", true),
                Aggregation.lookup("reviews", "reviewIds", "_id", "review"),
                Aggregation.unwind("review",true),
                Aggregation.lookup("users", "review.userId", "_id", "user"),
                Aggregation.unwind("user", true),
                Aggregation.group("user._id")
                        .first("user").as("user")
                        .push("review").as("reviews")
                        .first("imdbId").as("movieImdbId")
                        .first("title").as("movieTitle")
                        .first("poster").as("moviePoster")
        );
        List<Document> rawResults =  mongoTemplate.aggregate(agg, "movies", Document.class)
                .getMappedResults();
        return  rawResults;
    }

}
