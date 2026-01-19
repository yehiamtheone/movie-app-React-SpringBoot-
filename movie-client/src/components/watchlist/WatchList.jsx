import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {Container, Card, Row,Col, Button} from 'react-bootstrap'
import moviesApi from '../../api/axiosConfig';
import { useAuth } from '../../auth/AuthContext';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCirclePlay } from '@fortawesome/free-solid-svg-icons';
import { useDispatch } from 'react-redux';
import { showAlert }  from '../store/AlertSlice'; 
const WatchList = () => {
    const dispatch = useDispatch();
    const {token} = useAuth();
    const qc = useQueryClient();
    const watchlistCache = useQuery({
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

  
    const {mutate :deleteFromWatchlist} = useMutation({
        mutationFn: async({movieId}) =>{
            const res = await moviesApi.delete(`/auth/watchlist/removeone/${movieId}`,{
                headers:{
                    "Authorization": `Bearer ${token}`
                }
            });
            return res.data;
        },
        onSuccess:(_data, { movieId })=>{
            // console.log(movieId);
            qc.setQueryData(['watchlistKey', token], (old) =>{
                
                const n = {...old , watchlist: old.watchlist.filter(m => m.id !== movieId)};
                // console.log(n);
                
                return n;
            });
            dispatch(showAlert({message: "Movie Deleted From Watch List Successfully"}));
            
        },
        onError:()=>{
            dispatch(showAlert({message: "Unable to delete check deleteFromWatchlist mutation"
                , variant: "danger"
            }));

        }
        
    });
    const handleDelete = (movieId)=>{
        deleteFromWatchlist({movieId});
        
    }

   
    return (
        <Container>
                
                <Row >
                {watchlistCache.status === "panding" && <div>Loading…</div>}
                {watchlistCache.error && <div>Failed to load</div>}
                {token &&  watchlistCache.data?.watchlist?.length > 0 ? (
                
                            watchlistCache.data?.watchlist?.map((movie, idx)=>
                            <Col sm={12} md={3} key={idx} className='mb-5'>
                                <Card>
                                    <Card.Body>
                                        <Card.Img src={movie.poster} ></Card.Img>
                                        <Card.Title >{movie.title}</Card.Title>
                                        <Card.Footer >
                                            <Row>
                                            
                                            <Col md={9}>
                                            <Button variant='danger' onClick={()=>handleDelete(movie.id)} >Delete from watch list</Button>
                                            </Col>
                                            <Col md={3}>
                                            <Link to={`/Trailer/${movie.trailerLink.substring(movie.trailerLink.length - 11)}`}>
                                                <div>
                                                    <FontAwesomeIcon  className="play-button-icon"
                                                        icon = {faCirclePlay} 
                                                    />
                                                </div>
                                            </Link>
                                            </Col>
                                        </Row>
                                        </Card.Footer>
                                    </Card.Body>
                                </Card>
                            </Col>
                        
                        
                        
                    )):((
                        watchlistCache.status === "success" && <div>No items</div>
                    ))}
                    </Row>
                
        </Container>
    )
}

export default WatchList;