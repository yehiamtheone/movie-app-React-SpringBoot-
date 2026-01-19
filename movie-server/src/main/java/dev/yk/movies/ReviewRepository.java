package dev.yk.movies;

import dev.yk.movies.dtos.UserProfileDto;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends MongoRepository<Review, ObjectId> {
    List<Review> findByUserId(ObjectId id);
    void deleteAllByUserId(ObjectId userId);

}
