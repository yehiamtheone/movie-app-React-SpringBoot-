package dev.yk.movies;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.MongoTransactionOptions;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface UserRepository extends MongoRepository<User, ObjectId> {

    User getUserByUsername(String username);

}
