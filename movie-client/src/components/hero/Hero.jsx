import { Paper } from '@mui/material';
import Carousel from 'react-material-ui-carousel';
import './Hero.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCirclePlay } from '@fortawesome/free-solid-svg-icons';
import {  Link, useNavigate, useParams } from 'react-router-dom';
import { Button } from 'react-bootstrap'; 
import {  useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import moviesApi from '../../api/axiosConfig';
import { useAuth } from '../../auth/AuthContext';
import { useEffect } from 'react';
const Hero = () => {
  const qc = useQueryClient();
  const { token } = useAuth();
  const navigate = useNavigate();

  const { isPending, error, data: movies } = useQuery({
    queryKey: ['movies'],
    queryFn: async () => {
      const response = await moviesApi.get("/movies");
      return response.data;
    }
  });
    const watchlistLoadFromDB = useQuery({
        initialData:[],
        queryKey: ['watchlistKey', token],
        enabled: !!token,
        queryFn: async () => {
            const res = await moviesApi.get(`/auth/getUserById`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
                
            });
            return res.data;
            
        }
    });

  const { mutate: addMovieToWatchList, isPending: isAdding } = useMutation({
    mutationFn: async (movieId) => {
      const response = await moviesApi.post(`/auth/AddToWatchList/${movieId}`, null, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    },
    onSuccess: (user) => {
      qc.setQueryData(['watchlistKey',token], user);
    }
  });

  const navigateToReviews = (movieId) => {
    navigate(`/Reviews/${movieId}`);
  };

  const AddToWatchList = (movieId) => {
    const user = qc.getQueryData(['watchlistKey', token]);
    const inWatchList = !!user?.watchlist?.find(m => m.id === movieId);

    if (!inWatchList) {
      addMovieToWatchList(movieId);
    }
  };

  const isInWatchList = (movieId) => {
    const user = qc.getQueryData(['watchlistKey',token]);
    return !!user?.watchlist?.find(m => m.id === movieId);
  };
  const getCarouselIndex = () => {
    return qc.getQueryData(['carouselIndex']) || 0;
  };

  const handleCarouselChange = (now, previous) => {
    // Cache the current index
    // console.log(now);
    
    qc.setQueryData(['carouselIndex'], now);
  };

  if (isPending) return <h1>Loading... (Might take a few minutes to get the server app due to inactivity)</h1>;
  if (error) return <h1>Error connecting to the server</h1>;

  return (
    <div className='movie-carousel-container'>
      <Carousel className='carouselpages' index={getCarouselIndex()}  onChange={handleCarouselChange}>
        {movies.map((movie,idx) => (
          <Paper className={`classnumber${idx}`} key={movie.id}>
            <div className='movie-card-container '>
              <div className='movie-card' style={{ "--img": `url(${movie.backdrops[0]})` }}>
                <div className='movie-detail'>
                  <div className='movie-poster'>
                    <img src={movie.poster} alt={movie.title} />
                  </div>
                  <div className='movie-title'>
                    <h4>{movie.title}</h4>
                  </div>
                  <div className="movie-buttons-container">
                    <Link to={`/Trailer/${movie.trailerLink.substring(movie.trailerLink.length - 11)}`}>
                      <div className="play-button-icon-container">
                        <FontAwesomeIcon className="play-button-icon" icon={faCirclePlay} />
                      </div>
                    </Link>
                    <div className='movie-review-button-container'>
                      <Button variant="info" onClick={() => navigateToReviews(movie.imdbId)}>Reviews</Button>
                      <Button
                        variant={isInWatchList(movie.id) ? "success" : "info"}
                        className='mt-1'
                        onClick={() => AddToWatchList(movie.id)}
                        disabled={isAdding || isInWatchList(movie.id) || !token}
                      >
                        {!token? "login to use watchlist" : isInWatchList(movie.id) ? "In Watchlist" : "Add to Watchlist"}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Paper>
        ))}
      </Carousel>
    </div>
  );
};

export default Hero;
