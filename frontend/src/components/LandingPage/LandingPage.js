import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { Link } from 'react-router-dom';


const Container = styled.div`
  background-color: black;
  color: white;
`;
const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;  
  padding: 0px 20px;  
  height: 100px;  
`;


const Footer = styled.div`
  background-color: #333;
  color: white;
  padding: 20px;
`;

const Section = styled.div`
  position: relative;
  border-bottom: 1px solid grey;
  padding: 20px;
  margin-bottom: 20px;
`;

const HeroSection = styled.section`
  background-image: url('/path/to/your/image.jpg');
  background-size: cover;
  text-align: center;
  color: white;
  padding: 100px;
  margin-bottom: 20px;
`;

const MovieRow = styled.div`
    display: flex;
    overflow: hidden;
`;

const MovieBanner = styled.div`
  flex: 0 0 auto;
  width: 250px;  
  height: 420px;  
  margin: 10px;
  text-align: center;
  scroll-snap-align: start;

  img {
    width: 100%;
    height: auto;
  }

  p {
    color: grey;
    margin-top: 5px;
  }

  &:hover p {
    color: white;
  }
`;
const ArrowButton = styled.button`
    position: absolute;
    top: 50%;
    z-index: 1;
    cursor: pointer;
    background: rgba(0, 0, 0, 0.5);
    color: white;
    border: none;
    padding: 10px;
    font-size: 24px;
    transform: translateY(-50%); 
`;

const LeftArrow = styled(ArrowButton)`
  left: 0;
`;

const RightArrow = styled(ArrowButton)`
  right: 0;
`;
const StyledNavButton = styled(Link)`
  background-color: #333333;
  color: white;
  padding: 10px 20px;
  margin: 5px;
  text-decoration: none;
  border-radius: 4px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #006fe6;
  }
`;

  const scroll = (ref, direction) => {
    let scrollAmount = 0;
    const slideTimer = setInterval(function(){
      if(direction === 'left'){
        ref.current.scrollLeft -= 10;
      } else {
        ref.current.scrollLeft += 10;
      }
      scrollAmount += 10;
      if(scrollAmount >= 300){
        window.clearInterval(slideTimer);
      }
    }, 25);
  };
  
  
const API_KEY = 'f67cfa0e4c5da118274eb715d4f32a82';

const LandingPage = () => {
  const nowPlayingRef = useRef(null);
  const [nowPlaying, setNowPlaying] = useState([]);

  const popularRef = useRef(null);
  const [popular, setPopular] = useState([]);

  const topRatedRef = useRef(null);
  const [topRated, setTopRated] = useState([]);

  const upcomingRef = useRef(null);
  const [upcoming, setUpcoming] = useState([]);

  const fetchMovies = async (category) => {
    const url = `https://api.themoviedb.org/3/movie/${category}?api_key=${API_KEY}&language=en-US&page=1`;
    const response = await axios.get(url);
    return response.data.results;
  };

  useEffect(() => {
    const fetchData = async () => {
      const nowPlayingData = await fetchMovies('now_playing');
      const popularData = await fetchMovies('popular');
      const topRatedData = await fetchMovies('top_rated');
      const upcomingData = await fetchMovies('upcoming');
  
      setNowPlaying(nowPlayingData);
      setPopular(popularData);
      setTopRated(topRatedData);
      setUpcoming(upcomingData);
    };
  
    fetchData();
  }, []);

  return (
    <Container>
      <Header>
        <div>Logo</div>
        <div>
            <StyledNavButton to="/login">Log In</StyledNavButton>
            <StyledNavButton to="/signup">Sign Up</StyledNavButton>
        </div>
      </Header>
      <HeroSection>
        <h1>Welcome to My Movie Web</h1>
        <p>Find your next favorite movie here!</p>
      </HeroSection>

      <Section>
        <h2>Now Playing</h2>
        <LeftArrow onClick={() => scroll(nowPlayingRef, 'left')}>{"<"}</LeftArrow>
        <MovieRow ref={nowPlayingRef}>
          {nowPlaying.map((movie) => (
            <MovieBanner key={movie.id}>
            <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} />
            <p>{movie.title}</p>
          </MovieBanner>          
          ))}
        </MovieRow>
        <RightArrow onClick={() => scroll(nowPlayingRef, 'right')}>{">"}</RightArrow>
      </Section>

      <Section>
        <h2>Popular</h2>
        <LeftArrow onClick={() => scroll(popularRef, 'left')}>{"<"}</LeftArrow>
        <MovieRow ref={popularRef}>
          {popular.map((movie) => (
            <MovieBanner key={movie.id}>
              <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} />
              <p>{movie.title}</p>
            </MovieBanner>
          ))}
        </MovieRow>
        <RightArrow onClick={() => scroll(popularRef, 'right')}>{">"}</RightArrow>
      </Section>

      <Section>
        <h2>Top Rated</h2>
        <LeftArrow onClick={() => scroll(topRatedRef, 'left')}>{"<"}</LeftArrow>
        <MovieRow ref={topRatedRef}>
          {topRated.map((movie) => (
            <MovieBanner key={movie.id}>
              <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} />
              <p>{movie.title}</p>
            </MovieBanner>
          ))}
        </MovieRow>
        <RightArrow onClick={() => scroll(topRatedRef, 'right')}>{">"}</RightArrow>
      </Section>

      <Section>
        <h2>Upcoming</h2>
        <LeftArrow onClick={() => scroll(upcomingRef, 'left')}>{"<"}</LeftArrow>
        <MovieRow ref={upcomingRef}>
          {upcoming.map((movie) => (
            <MovieBanner key={movie.id}>
              <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} />
              <p>{movie.title}</p>
            </MovieBanner>
          ))}
        </MovieRow>
        <RightArrow onClick={() => scroll(upcomingRef, 'right')}>{">"}</RightArrow>
      </Section>
      <Footer>
        {/* Footer content */}
      </Footer>
    </Container>
  );
};

export default LandingPage;
