import React from 'react'
import './profile.css'
import { useAuth } from '../../auth/AuthContext'
import { useQuery } from '@tanstack/react-query';
import moviesApi from '../../api/axiosConfig';
import { Card, CardBody, Col, Container, Row } from 'react-bootstrap';

const Profile = () => {
    const { token } = useAuth();
    // console.log(token);
    
    const {isPending, error, data} = useQuery({
        enabled: !!token,
        queryKey: ['profile'], 
        queryFn: async()=> moviesApi.get('/auth/getMyProfile',{headers:{
            "Authorization": `Bearer ${token}` 
        }
        })
    });
    if (isPending) {
        return (
            <h1>loading...</h1>
        )
        
    }
    if (error) {
        // console.log(error);
        return (
            <h1>error connecting to server</h1>
            
            
        )
        
    }
    // console.log(data);
    const {username, reviews} = data.data;
  return (
    
    <Container>
        
        <h1 className='text-center'>{`${username}'s profile`}</h1>
        <Row>
            <Col md={4}>
            <h2>
            {`${username}'s reviews`}:
            </h2>
            </Col>

        </Row>
        <Row className='reviews'>
            <Card className='reviewcardd' >
                {reviews?.map((review, index)=>{
                    return(
                        <CardBody key={index}>
                            <h4>review number {index + 1} on movie {review?.imdbTitle}</h4> {review?.reviewBody}
                        </CardBody>
                    )
                })}
               
            </Card>
        </Row>

    

    </Container>
  )
}

export default Profile