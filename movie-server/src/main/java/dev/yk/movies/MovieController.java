package dev.yk.movies;

import dev.yk.movies.dtos.UserReviewOnMovie;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/movies")
public class MovieController {
    @Autowired
    private MovieService movieService;
    @GetMapping("/active")
    public String checkActivity(){
        return "working";
    }
    @GetMapping
    public ResponseEntity<List<Movie>> getAllMovies(){
        return new ResponseEntity<>(movieService.AllMovies(), HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<List<UserReviewOnMovie>> getSingleMovie(@PathVariable String id){
//        System.out.println(movieService.singleMovieByImdbId(id));
        return new ResponseEntity<>(movieService.singleMovieByImdbId(id),HttpStatus.OK);
    }


}
