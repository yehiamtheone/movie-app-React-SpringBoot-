import  { useState } from 'react';
import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';
import { NavLink, useNavigate } from 'react-router-dom';
import moviesApi from '../../api/axiosConfig';
import { useDispatch } from 'react-redux';
import {useMutation} from '@tanstack/react-query'
import { showAlert } from '../store/AlertSlice';

const SignupForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
   const {mutate} = useMutation({
      mutationFn: async(formDto)=> {
        const response = await moviesApi.post('/auth/signup', formDto);
        return response;
    },
      onSuccess:()=>{
        setForm({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
      })
      navigate('/login');
      dispatch(showAlert({message: "Signup successful!"}));
      // setSignUpSuccess(true);    
        
      },
      onError:(err)=>{
        console.log(err);
        
        dispatch(showAlert({message: `Couldnt register check hooks`,variant: "danger"}))
      }
    });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }
     
  const handleSubmit = async(e) => {
    e.preventDefault()
    if (form.password !== form.confirmPassword) {
      dispatch(showAlert({ message: "Passwords do not match", variant: "danger", show: true }))
      return
    }
    if (form.username.length < 3) {
      dispatch(showAlert({ message: "Username Too Short", variant: "danger", show: true }))
      return;
      
    }
    if (form.password.length < 5 ) {
      dispatch(showAlert({ message: "Password Too Short", variant: "danger", show: true }))
      return;
      
    }
    // Simulate successful signup
    
    const {confirmPassword, ...formDto}  = form;
    // console.log(formDto);
    mutate(formDto);
        
    
  }

  return (
    <Container>
      <Row className="justify-content-md-center">
        <Col xs={12} md={6}>
          <h2 className="mb-4">Sign Up</h2>
          {/* {error && <Alert variant="danger">{error}</Alert>} */}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formUsername">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter username"
                name="username"
                value={form.username}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formConfirmPassword">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Confirm Password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100">
              Sign Up
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  )
}

export default SignupForm;