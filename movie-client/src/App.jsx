import './App.css';
import Layout from './components/Layout';
import Home from './components/home/Home';
import { Routes, Route } from 'react-router-dom';
import Header from './components/header/Header';
import Trailer from './components/trailer/Trailer';
import Reviews from './components/reviews/Reviews';
import NotFound from './components/notFound/NotFound';
import LoginForm from './components/login/LoginForm';
import SignupForm from './components/signUp/SignupForm';
import Profile from './components/profile/Profile';
import WatchList from './components/watchlist/WatchList';
import GlobalAlert from './components/alert/AlertBox';
import { QueryClient } from '@tanstack/react-query';
import Footer from './components/footer/Footer';
import BlockLoginRouteForAuth from './BlockLoginRouteForAuth';
function App() {
const queryClient = new QueryClient();

  return (
    <div className="App">
        {<GlobalAlert />}
      <Header/>
      <Routes>
        {/* Parent route that provides the Layout for its children */}
        <Route path="/" element={<Layout />}>
          {/* Use 'index' instead of path='/' for the default child */}
          <Route index element={<Home/>} />
          <Route path='signup' element={
            <BlockLoginRouteForAuth>
            <SignupForm />
            </BlockLoginRouteForAuth>
            } />
          <Route path='login' element={
            <BlockLoginRouteForAuth>
              <LoginForm />
            </BlockLoginRouteForAuth>
            } />
          <Route path='profile' element={<Profile />} />
          <Route path="Trailer/:ytTrailerId" element={<Trailer />} />
          <Route path="Reviews/:movieId" element={<Reviews/>} />
          <Route path='WatchList' element={<WatchList/>}></Route>
          {/* These child routes will render inside the Layout's Outlet */}
        </Route>
        {/* The 404 route must be OUTSIDE and LAST to catch all unmatched paths */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer/>
    </div>
      
  );
}


export default App;
