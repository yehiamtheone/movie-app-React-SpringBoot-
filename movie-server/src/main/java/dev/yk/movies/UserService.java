package dev.yk.movies;

import com.mongodb.client.result.UpdateResult;
import dev.yk.movies.dtos.CustomUserDetails;
import dev.yk.movies.dtos.LoginDto;
import dev.yk.movies.dtos.SignupDto;
import dev.yk.movies.dtos.UserProfileDto;
import org.bson.types.ObjectId;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.data.mongodb.core.MongoOperations;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class UserService {
    private ReviewRepository reviewRepository;
    private UserRepository userRepository;
    private MongoTemplate mongoTemplate;
    private PasswordEncoder passwordEncoder;
    private MongoOperations mongoOperations;
    private JwtService jwtService;
    public MovieRepository movieRepository;


    public UserService(
            ReviewRepository reviewRepository,
            UserRepository userRepository,
            MongoTemplate mongoTemplate,
            PasswordEncoder passwordEncoder,
            MongoOperations mongoOperations,
            JwtService jwtService,
            MovieRepository movieRepository
    ){
        this.reviewRepository = reviewRepository;
        this.userRepository = userRepository;
        this.mongoTemplate = mongoTemplate;
        this.mongoOperations = mongoOperations;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.movieRepository = movieRepository;
    }

    public ResponseEntity<?>signupAndEncryptPasswordAndInsertToDb(SignupDto payload) {
        try {
            User user = User.builder()
                    .username(payload.username())
                    .email(payload.email())
                    .password(passwordEncoder.encode(payload.password()))
                    .roles(Collections.singleton("ROLE_USER"))
                    .build();
            userRepository.save(user);
            return new ResponseEntity<>("User registered successfully.", HttpStatus.CREATED);
        } catch (DuplicateKeyException e) {
            return new ResponseEntity<>("Username or email already exists.", HttpStatus.CONFLICT);
        } catch (Exception e) {
            return new ResponseEntity<>("An internal server error occurred.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public ResponseEntity<?> ValidateBcryptLogUserAndCreateToken(LoginDto payload) {
        User currentUser = mongoOperations.findOne(
                Query.query(Criteria.where("username").is(payload.username())),
                User.class,
                "users"
        );

        if (currentUser == null) {
            return new ResponseEntity<>("User not found", HttpStatus.NOT_FOUND);
        }
        if (!passwordEncoder.matches(payload.password(), currentUser.getPassword())) {
            return new ResponseEntity<>("Invalid credentials", HttpStatus.UNAUTHORIZED);
        }

        Set<SimpleGrantedAuthority> authorities = currentUser.getRoles().stream()
                .map(SimpleGrantedAuthority::new)
                .collect(Collectors.toSet());

        // This is the crucial fix: use your CustomUserDetails class
        CustomUserDetails customUserDetails = new CustomUserDetails(
                currentUser.getId(),
                currentUser.getPassword(),
                authorities
        );

        String token = jwtService.generateToken(customUserDetails, currentUser.getUsername());

        return new ResponseEntity<>(token, HttpStatus.OK);
    }

    public ResponseEntity<?> userDetailsAndReviews() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userId = authentication.getName();
        Optional<User> userOptional = userRepository.findById(new ObjectId(userId));
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            List<Review> reviews = reviewRepository.findByUserId(user.getId());
            UserProfileDto dto = new UserProfileDto();
            dto.setUsername(user.getUsername());
            dto.setEmail(user.getEmail());
            dto.setReviews(reviews);
            return new ResponseEntity<>(dto, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    public Optional<UserDetails> loadUserById(ObjectId userId) {

        return userRepository.findById(userId)
                .map(user -> {

                    Collection<? extends GrantedAuthority> authorities =
                            user.getRoles().stream()
                                    .map(SimpleGrantedAuthority::new)
                                    .collect(Collectors.toList());

                    return new CustomUserDetails(
                            user.getId(),
                            user.getPassword(),
                            authorities

                    );
                });
    }

    public Optional<User> AddToWatchlistAndReturnUser(String movieId, String userId) {
        ObjectId id = new ObjectId(userId);
        Optional<Movie> movie = movieRepository.findById(new ObjectId(movieId));
        movie.ifPresent(System.out::println);
        movie.ifPresent(m -> mongoTemplate.update(User.class)
                .matching(Criteria.where("_id").is(id))
                .apply(new Update().push("watchlist").value(m))
                .first());
        Optional<User> user = userRepository.findById(id);
        return user;



    }
    public Optional<User> getUserById(String userId){
        return userRepository.findById(new ObjectId(userId));


    }
    public ResponseEntity<HttpStatus> removeMovieFromWatchlist(Authentication auth, String movieId){
        String userId = auth.getName();
        Query q = new Query(Criteria.where("_id").is(new ObjectId(userId)));
        Update u = new Update().pull("watchlist",new ObjectId(movieId));
        UpdateResult res = mongoTemplate.updateFirst(q, u, User.class);
        if (res.getModifiedCount() == 0) return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);


    }

    public ResponseEntity<HttpStatus> delUserFromDb(String userId) {
        ObjectId objectId = new ObjectId(userId);
        Optional<User> user = userRepository.findById(objectId);
        try {
            user.ifPresent(u -> {
                userRepository.delete(u);
                Query reviewQuery = new Query(Criteria.where("userId").is(objectId));
                reviewQuery.fields().include("_id");
                List<Review> reviews = mongoTemplate.find(reviewQuery, Review.class, "reviews");

                List<ObjectId> reviewIds = reviews.stream()
                        .map(Review::getId)
                        .collect(Collectors.toList());

                System.out.println(reviewIds);
                Query movieQuery = new Query(Criteria.where("reviewIds").in(reviewIds));
                Update update = new Update().pullAll("reviewIds", reviewIds.toArray());
                mongoTemplate.updateMulti(movieQuery, update, Movie.class);
                reviewRepository.deleteAllByUserId(objectId);


            });


        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

            return new ResponseEntity<>(HttpStatus.NO_CONTENT);



    }
}