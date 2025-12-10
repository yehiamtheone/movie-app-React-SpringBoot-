import './header.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faVideoSlash } from "@fortawesome/free-solid-svg-icons";
import { Badge, Button, Dropdown, Container, Nav, Navbar } from "react-bootstrap";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import { useDispatch} from "react-redux";
import { showAlert } from "../store/AlertSlice";
import { useMutation } from '@tanstack/react-query';
import moviesApi from '../../api/axiosConfig';

const Header = () => {
    const dispatch = useDispatch();
    
    const { token, logOut, username } = useAuth();
      let firstLetter = null;
    const logoutProcess = ()=>{
        logOut();
        dispatch(showAlert({message: "logged Out successfully"}));
        // showAlert("logged Out successfully");

    }
    const deletionProcess = ()=>{
        //TODO: delete reviews from everywhere
        logOut();
        dispatch(showAlert({message: "Account deleted successfully"}));
        // showAlert("logged Out successfully");

    }
    
    if (username) { // Check if username exists
        firstLetter = username.charAt(0).toUpperCase();
    }
    const accountDeletion = ()=>{
        const confirmed = window.confirm("You Sure To Delete Your Account?")
        if (confirmed) {
            console.log("Deletefn");
            deleteAcc();
            
            
        }
        
    }
    const {mutate :deleteAcc} = useMutation({
        mutationFn: async()=>{
            const res = await moviesApi.delete("/auth/deleteUser",{
                headers: {
                    "Authorization" : `Bearer ${token}`
                }
            });
            return res;
        },
        onSuccess:()=>{
            deletionProcess();
        },
        onError:(err)=>{
            console.log(err);
            
            dispatch(showAlert({message:"Unable To Delete Account", variant: "danger"}));
            
        }
    });
    return (
        <header>

        <Navbar bg="dark" variant="dark" expand="lg" >
            <Container fluid>
                <Navbar.Brand href="/" style={{ "color": 'gold' }}>
                    <FontAwesomeIcon icon={faVideoSlash} />
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="navbarScroll" />
                <Navbar.Collapse id="navbarScroll">
                    <Nav className="me-auto my-2 my-lg-0"
                        style={{ maxHeight: '100px' }}
                        navbarScroll>
                        <NavLink className="nav-link" to="/">Home</NavLink>
                        <NavLink className="nav-link" to="/WatchList">Watch List</NavLink>
                    </Nav>
                    {token ? (
                <Dropdown>
                    <Dropdown.Toggle as="div" id="profile-dropdown" className="profile-dropdown-toggle">
                        <Badge pill
                            style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                fontSize: '1rem',
                                cursor: 'pointer'
                            }}
                        >
                            {firstLetter}
                        </Badge>
                    </Dropdown.Toggle>

                    <Dropdown.Menu align="end">
                        <Dropdown.Item as={Link} to="/profile">My Profile</Dropdown.Item>
                        <Dropdown.Item onClick={logoutProcess}>Log Out</Dropdown.Item>
                        <Dropdown.Item onClick={accountDeletion} style={{color: "red"}}> <h6>Delete Account</h6> </Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            ) : (
                        <>
                            <NavLink to="/login">
                                <Button variant="outline-info" className="me-2">Login</Button>
                            </NavLink>
                            <NavLink to="/signup">
                                <Button variant="outline-info" className="me-2">Register</Button>
                            </NavLink>
                        </>
                    )}
                </Navbar.Collapse>

            </Container>
        </Navbar>
        </header>

    );
};
export default Header;