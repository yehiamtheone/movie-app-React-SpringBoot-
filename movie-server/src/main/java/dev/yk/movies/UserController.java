package dev.yk.movies;

import dev.yk.movies.dtos.LoginDto;
import dev.yk.movies.dtos.SignupDto;
import jakarta.annotation.Nonnull;
import jakarta.validation.Valid;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.parameters.P;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/auth")
public class UserController {
    @Autowired
    private UserService userService;

    @GetMapping("/welcome")
    public ResponseEntity<?> welcome (){

        return new ResponseEntity<>("this end point is not protected", HttpStatus.OK);
    }
    @GetMapping("/younotwelcome")
    public ResponseEntity<?> younotwelcomwelcome (){
        return new ResponseEntity<>("this end point is protected", HttpStatus.OK);
    }
    @GetMapping("/getMyProfile")
    public ResponseEntity<?> getMyProfile(){
        return userService.userDetailsAndReviews();
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@Nonnull @Valid @RequestBody SignupDto payload){
        return userService.signupAndEncryptPasswordAndInsertToDb(payload);
    }
    @PostMapping("/login")
    public ResponseEntity<?> login(@Nonnull @Valid @RequestBody LoginDto payload){
        return userService.ValidateBcryptLogUserAndCreateToken(payload);

    }
    @GetMapping("/getUserById")
    public ResponseEntity<?> getUserById(Authentication auth){
        String userId = auth.getName();
        return new ResponseEntity<>(userService.getUserById(userId),HttpStatus.OK);
    }
    @PostMapping("/AddToWatchList/{movieId}")
    public ResponseEntity<?> AddToWatchList(Authentication auth, @PathVariable String movieId){
//        System.out.println("check");
        String userId = auth.getName();
//        System.out.println("check2");

        Optional<User> user = userService.AddToWatchlistAndReturnUser(movieId, userId);
        if (user.isPresent()){
            List<Movie> movies = user.get().getWatchlist();
            List<Movie> mapped = movies.stream().filter(m-> m.getId().equals(new ObjectId(movieId))).toList();
            if (mapped.isEmpty()){
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        }


        return new ResponseEntity<>(user.get(), HttpStatus.OK);
    }
    @DeleteMapping("/watchlist/removeone/{movieId}")
    public ResponseEntity<HttpStatus> removeFromWatchlist(Authentication auth, @PathVariable String movieId){
        return userService.removeMovieFromWatchlist(auth, movieId);
    }
    @DeleteMapping("/deleteUser")
    public ResponseEntity<HttpStatus> deleteUser(Authentication auth){
        System.out.println("check");
        String userId = auth.getName();
        return userService.delUserFromDb(userId);
    }


}
