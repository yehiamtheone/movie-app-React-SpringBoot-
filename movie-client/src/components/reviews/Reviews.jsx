import { useEffect, useRef, useState } from "react";
import moviesApi from "../../api/axiosConfig";
import { data, useParams } from "react-router-dom";
import { Container, Row, Col, Form } from "react-bootstrap";
import ReviewForm from "../reviewForm/ReviewForm";
import React from "react";
import { useAuth } from "../../auth/AuthContext";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faPen, faTrash, faXmark } from "@fortawesome/free-solid-svg-icons";
import { useDispatch } from "react-redux";
import { showAlert } from '../store/AlertSlice';
import './reviews.css'

const Reviews = () => {
  const dispatch = useDispatch();
  // const [reviews, setReviews] = useState([]);
  const qc = useQueryClient();
  const refText = useRef();
  const editedRevRef = useRef();
  const {movieId} = useParams();
  
 
  
  const {isPending: reviewPending, error:reviewError, data:reviews} = useQuery({
        queryKey: ['reviews'],
        queryFn: async ()=> {
          const res = await moviesApi.get(`/movies/${movieId}`);
          return res.data;
        }
      });
  
  
  const first = reviews?.[0];
  const moviePoster = first?.moviePoster ?? '';
  const movieTitle  = first?.movieTitle  ?? '';

   
  useEffect(()=>{
      // console.log(reviews);
      // if (reviews) {
        
      //   setReviews(reviews);
      // }
  } ,[reviews])
  const [isEditing, setIsEditing] = useState({
    b: false
    , 
    id:""});
  const toggleIsEditing = (revId)=>{
    if (!revId.trim()) {
      setIsEditing(prev => ({ ...prev, b: !prev.b }));
      
    }
    else{
      setIsEditing(prev=> ({...prev, b: !prev.b, id:revId}))
      
    }
    
  }
  const submitEditedReview = (revId)=>{
    const editedReview = editedRevRef.current.value;
    // console.log(editedReview);
    if (!editedRevRef.current.value.trim()) {
      return;
    }
    editedRevRef.current.value = "";

    toggleIsEditing("");
    const requestBody = {
      id: revId,
      reviewBody: editedReview
    }
    editReview(requestBody);
    
  }
  const {mutate: editReview} = useMutation({
    mutationFn: async(requestBody)=>{
      const response = await moviesApi.patch(`/reviews/editRevBody`,requestBody,{
        headers:{
          "Authorization":`Bearer ${token}`
        }
      });
      return response.data;
    },
    onSuccess:(updated)=>{
      // console.log(updated);
      qc.setQueryData(['reviews'], (old)=>{
        if (!Array.isArray(old) ) return old;
        return old.map(group=>({
          ...group,
          reviewBodies: group.reviewBodies.map(r=>
            r.id === updated.id? {...r, body: updated.reviewBody}: r
           ),
        }));
      });
      dispatch(showAlert({message: "Review edited successfully"}));
      
      
    },
    onError:()=>{
      
      dispatch(showAlert({message: "Unable to edit review", variant:"danger"}));
    }
  });
   

    const { token, username } = useAuth();
    const clearTextarea = () => {
      refText.current.value = ""; // This is correct
};
  const delReviewJson =(reviewId, movieTitle)=>{
    const reqBody = {
      reviewId,
      movieTitle
    }
    // console.log(reqBody);
    
    deleteReview(reqBody);

    

  }
   const { mutate: deleteReview } = useMutation({
      mutationFn: async(reqBody)=>{
        await moviesApi.delete("/reviews/delete",  {
              data: reqBody,
              headers: {
                "Authorization": `Bearer ${token}` 
              }
            });
      
        
      },
      onSuccess :()=>{
        // here i was planning to the a lot of mapping you say its unneccesry?
        // console.log("check");
        
         qc.invalidateQueries({ queryKey: ['reviews'] });
         dispatch(showAlert({message: "Review deleted successfully"}));

      },
      onError:(error)=>{
        console.log(error);
        
          dispatch(showAlert({message: "Unable to delete review", variant:"danger"}));

      }
   });
    const { mutate: postReview } = useMutation({
      
      mutationFn: () => reviewEndpointCall(),
      onSuccess: (created, vars)=>{
      // console.log(created);
      const createdReviewId = created.data.id;
    
      const ref = refText.current;
      const newReviewText = ref.value;
      const reviewObj = {
        id: createdReviewId,
        body: newReviewText

      };  
     
      
      qc.setQueryData(['reviews'], (old = []) => {
      // upsert user bucket
      const idx = old.findIndex(r => r.username === username);
      const reviewObj = {
        id: createdReviewId,
        body: newReviewText

      };  
      if (idx === -1) {
        return [...old, { username: username, reviewBodies: [reviewObj] }];
      }
      return old.map((r, i) =>
        i === idx ? { ...r, reviewBodies: [...r.reviewBodies, reviewObj] } : r
      );
    });
      clearTextarea();
      dispatch(showAlert({message: "Review Created Successfully"}));
      
      },
      onError: (error) => {
      // 4. On error, show an alert
      dispatch(showAlert({message:`Must login to post a review` ,variant: "danger"}));

    },


    });
    const reviewEndpointCall = async ()=>{
      const ref = refText.current;
      
        const response = await moviesApi.post('/reviews', {reviewBody: ref.value, imdbId: movieId},
            {
              headers: {
                "Authorization": `Bearer ${token}` 
              }
            }
          );
        return response;
        
     
    }
    const handleSubmit = (event) => {
      event.preventDefault();
      // const data = reviewEndpointCall();
      if (refText.current.value.trim()) {
        postReview();
        
      }
      dispatch(showAlert({message: "Cannot send an empty review", variant:"warning"}));
      return;
  };


  if (reviewError) {
    return (
      <h1>error connecting to the server</h1>
    )
    
  }  
  return (
    <Container>
      <Row>
        <Col><h3>Reviews On {movieTitle}</h3></Col>
      </Row>
      <Row className="mt-2" style={{height: "100%"}}>
        <Col>
          <img style={{height: "700px"}} src={moviePoster} alt="" />
        </Col>
        <Col className="reviewOverflow">
            {
              <>
                <Row>
                  <Col>
                    <ReviewForm handleSubmit={handleSubmit} refText={refText} labelText="Write a Review?" />
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <hr />
                  </Col>
                </Row>
              </>
            }
            {
              reviews?.map((r)=>{
                return r.reviewBodies.map((reviewObj, index)=>{
                  
                  return (
                    <React.Fragment key={index}> 
                        {isEditing.b && isEditing.id === reviewObj.id ? (
                          <>
                          <Row>
                            
                            <Col md={3}>{r.username} says:</Col>
                            <Col><Form.Control size="sm" type="text" ref={editedRevRef} placeholder="Edit Your Review" defaultValue={reviewObj.body} /></Col>
                            <Col md={1}><FontAwesomeIcon icon={faXmark} style={{cursor:"pointer"}} onClick={()=>toggleIsEditing("")}/></Col>
                            <Col md={1}><FontAwesomeIcon icon={faCheck} style={{cursor:"pointer"}} onClick={()=> submitEditedReview(reviewObj.id)}/></Col>


                          </Row>
                          </>
                          ):(
                          <Row>
                          <Col  md={10}>{r.username} says: {reviewObj.body}</Col>
                          {username === r.username?(
                            <>
                              <Col><FontAwesomeIcon icon={faPen} onClick={() => toggleIsEditing(reviewObj.id)} style={{cursor:"pointer"}} /></Col>
                              <Col><FontAwesomeIcon icon={faTrash} onClick={()=>delReviewJson(reviewObj.id, reviews[0].movieTitle)} style={{cursor:"pointer"}}/></Col>
                            </>
                          ): null}
                          
                          
                        </Row>
                    )}
                      
                      <Row>
                        <Col>
                          <hr />
                        </Col>
                      </Row>
                    </React.Fragment>
                  );
                })
              })
            }
        </Col>
      </Row>
        <Row>
          <Col>
            <hr />
          </Col>
        </Row>
    </Container>
  )
}

export default Reviews;