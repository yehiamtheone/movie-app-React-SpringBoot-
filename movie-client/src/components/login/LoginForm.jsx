import { useContext, useState } from "react";
import { Form, Button, Container, Row, Col, Alert } from "react-bootstrap";
import moviesApi from "../../api/axiosConfig";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import GlobalAlert from "../alert/AlertBox";
import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { showAlert } from "../store/AlertSlice";
const LoginForm = () => {
  const dispatch = useDispatch();
  const { logIn } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const {mutate :logInRequest} = useMutation({
    mutationFn: async(form)=>{
      const response = await moviesApi.post("/auth/login", form);
      return response.data;
    },
    onSuccess:(data)=>{
      dispatch(showAlert({message: "Logged in successfuly"}));
      logIn(data);
      
      
    },
    onError:(err)=>{
      // console.log(err);
      dispatch(showAlert({message: "Username or Password are invalid", variant:"danger"}));
      

    }
  });
  const handleSubmit = async(e) => { 
    e.preventDefault();
    if (form.username.length < 3) {
      dispatch(showAlert({ message: "Username Too Short", variant: "danger", show: true }))
      return;
      
    }
    if (form.password.length < 5 ) {
      dispatch(showAlert({ message: "Password Too Short", variant: "danger", show: true }))
      return;
      
    }
    logInRequest(form);
    // console.log(form);
    
/*
    try {
      const response = await moviesApi.post("/auth/login", form);
      // console.log(response);

      if (response.status == 200) {
        logIn(response.data);
        navigate("/");
        showAlert("login successful");
    
        
      }
      
    } catch (error) {
      console.log(error.response.data);
      
      
    }
      */
    
    
  };

  return (
    <Container>
      <Row className="justify-content-center">
        <Col xs={12} md={6} lg={4}>
        {/* {signUpSuccess && <Alert variant="success">Signup successful!</Alert>} */}
          <Form onSubmit={handleSubmit} className="text-center">
            <Form.Group className="mb-3" controlId="loginUsername">
              <Form.Label className="w-100 text-center">Username</Form.Label>
              <Form.Control
                type="text"
                name="username"
                placeholder="Enter Your Username"
                value={form.username}
                onChange={handleChange}
                autoComplete="username"
                style={{ width: "80%", margin: "0 auto" }}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="loginPassword">
              <Form.Label className="w-100 text-center">Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                placeholder="Enter Your Password"
                value={form.password}
                onChange={handleChange}
                style={{ width: "80%", margin: "0 auto" }}
                autoComplete="current-password"

              />
            </Form.Group>
            <Button variant="outline-info" type="submit" className="w-50">
              Login
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginForm;