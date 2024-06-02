import React, { useState } from "react";
import styled from "styled-components";
import { useQuery } from "react-query";
import { motion, AnimatePresence, useScroll } from "framer-motion";
import {
  getMovies,
  IGetmoviesResult,
  IGetGenresResult,
  getGenres,
} from "../../api";
import { makeImagePath } from "../../utils";
import { useMatch, PathMatch, useNavigate } from "react-router-dom";

const offset = 6;

const infoVariants = {
  hover: {
    opacity: 1,
    transition: { delay: 0.3, type: "tween" },
  },
};

export const rowVariants = {
  hidden: {
    x: window.outerWidth + 10,
  },
  visible: {
    x: 0,
  },
  exit: {
    x: -window.outerWidth - 10,
  },
};

export const boxVariants = {
  normal: { scale: 1 },
  hover: {
    zIndex: 99,
    scale: 1.3,
    y: -60,
    transition: { delay: 0.3, type: "tween" },
  },
};

const GenreRanking = () => {
  const { scrollY } = useScroll();
  const [index, setIndex] = useState(0);
  const navigate = useNavigate();
  const { data: genreData, isLoading: genreLoading } =
    useQuery<IGetGenresResult>(["getGenres"], getGenres);
  const { data: movieData, isLoading } = useQuery<IGetmoviesResult>(
    ["movies", "nowPlaying"],
    getMovies
  );

  const [leaving, setLeaving] = useState(false);
  const toggleLeaving = () => {
    setLeaving((prev) => !prev);
  };

  const increaseIndex = () => {
    if (movieData) {
      setIndex((prev) => {
        const totalMovies = movieData.results.length - 2;
        const maxIndex = Math.ceil(totalMovies / offset) - 1;
        return prev === maxIndex ? 0 : prev + 1;
      });
    }
  };

  const onBoxClicked = (movieId: number) => {
    navigate(`/movies/${movieId}`);
  };

  const bigMovieMatch: PathMatch<string> | null = useMatch("/movies/:movieId");

  const clickedMovie =
    bigMovieMatch?.params.movieId &&
    movieData?.results.find(
      (movie) => movie.id + "" === bigMovieMatch.params.movieId
    );
  const onOverlayClick = () => {
    navigate("/");
  };
  return (
    <>
      <Slider>
        <h2>오늘의 Movie TOP 랭킹 순위</h2>
        <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
          <Row
            key={index}
            variants={rowVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{
              type: "tween",
              duration: 1,
            }}
          >
            {movieData?.results

              .slice(offset * index, index * offset + offset)
              .map((movie, movieIndex) => (
                <Box
                  onClick={() => onBoxClicked(movie.id)}
                  key={movie.id}
                  bgphoto={makeImagePath(movie.backdrop_path)}
                  variants={boxVariants}
                  initial="normal"
                  transition={{ type: "tween" }}
                  whileHover="hover"
                  layoutId={movie.id + ""}
                >
                  {index === 0 ? <Count>{index + movieIndex + 1}</Count> : null}
                  {index === 1 ? <Count>{index + movieIndex + 6}</Count> : null}
                  {index === 2 ? (
                    <Count>{index + movieIndex + 11}</Count>
                  ) : null}
                  <Info variants={infoVariants}>
                    <h4>{movie.title}</h4>
                  </Info>
                </Box>
              ))}
          </Row>
          <Button onClick={increaseIndex}>&gt;</Button>
        </AnimatePresence>
      </Slider>
      <AnimatePresence>
        {bigMovieMatch ? (
          <>
            <Overlay
              onClick={onOverlayClick}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <BigMovie
              layoutId={bigMovieMatch?.params.movieId}
              style={{
                top: scrollY.get() + 150,
              }}
            >
              {clickedMovie && (
                <>
                  <BigCover
                    style={{
                      backgroundImage: `linear-gradient(to top, black, transparent),url(${makeImagePath(
                        clickedMovie.backdrop_path
                      )})`,
                    }}
                  />
                  <Exit onClick={onOverlayClick}>x</Exit>
                  <BigTitle>
                    {clickedMovie.title}{" "}
                    <VoteTitle>⭐{clickedMovie.vote_average}</VoteTitle>
                  </BigTitle>
                  <Genre>
                    {clickedMovie.genre_ids
                      ?.map(
                        (Id) =>
                          genreData?.genres.find((item) => item.id === Id)?.name
                      )
                      .filter((name) => name)
                      .join(" / ")}
                  </Genre>
                  <BigOverView>{clickedMovie.overview}</BigOverView>
                </>
              )}
            </BigMovie>
          </>
        ) : null}
      </AnimatePresence>
    </>
  );
};

export default GenreRanking;
const VoteTitle = styled.span`
  font-size: 16px;
`;

const Exit = styled.button`
  padding: 10px;
  border: none;
  border-radius: 5px;
  position: absolute;
  top: 10px;
  right: 10px;
  font-weight: bold;
  font-size: 16px;
  background-color: white;
  box-shadow: 0px 0px 3px #000;
  cursor: pointer;
`;
const Genre = styled.div`
  margin-bottom: 20px;
  margin-top: -50px;
  @media ${({ theme }) => theme.sm} {
    font-size: 12px;
    margin-top: 0;
  }
`;

const Button = styled.button`
  position: absolute;
  opacity: 0.5;
  right: -10px;
  width: 50px;
  top: 60%;
  transform: translate(0, -50%);
  border: none;
  cursor: pointer;
  border-radius: 100%;
  height: 50px;
  background: rgba(0, 0, 0, 0.3);
  font-size: 30px;
  color: #fff;
  &:hover {
    background: rgba(0, 0, 0, 0.8);
  }
`;

const Count = styled.span`
  text-shadow: 0px 0px 10px #000;
  position: relative;
  top: -25px;
  left: 5px;
  font-size: 50px;
  font-weight: bold;
  margin-top: 50px;
  @media ${({ theme }) => theme.sm} {
    font-size: 30px;
    left: 0px;
  }
`;

const Slider = styled.div`
  position: relative;
  top: -100px;
  width: 100%;
  height: 300px;
  margin-top: 20px;
`;

const Row = styled(motion.div)`
  position: absolute;
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 10px;
  margin-top: 50px;
`;

const Box = styled(motion.div)<{ bgphoto: string }>`
  background-color: #fff;
  background-image: url(${(props) => props.bgphoto});
  background-size: cover;
  background-position: center center;
  height: 200px;
  margin-bottom: 10px;
  color: #fff;
  font-size: 30px;
  cursor: pointer;
  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
  @media ${({ theme }) => theme.sm} {
    width: 100%;
  }
`;

const Info = styled(motion.div)`
  position: absolute;
  width: 100%;
  bottom: 0;
  background-color: ${(props) => props.theme.black.lighter};
  padding: 20px;
  opacity: 0;
  h4 {
    text-align: center;
    font-size: 18px;
  }
  @media ${({ theme }) => theme.sm} {
    h4 {
      text-align: center;
      font-size: 12px;
    }
  }
`;

const Overlay = styled(motion.div)`
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 2;
`;

const BigMovie = styled(motion.div)`
  width: 70vw;
  height: 80vh;
  position: absolute;
  left: 0;
  right: 0;
  margin: 0 auto;
  background-color: ${(props) => props.theme.black.lighter};
  border-radius: 15px;
  overflow: hidden;
  z-index: 3;
  padding: 20px;
`;

const BigCover = styled.div`
  width: 100%;
  height: 500px;
  background-size: cover;
  background-position: top;
  @media ${({ theme }) => theme.sm} {
  }
`;
const BigTitle = styled.h3`
  color: ${(props) => props.theme.white.lighter};
  text-align: left;
  font-size: 28px;
  padding: 10px;
  position: relative;
  top: -60px;
  @media ${({ theme }) => theme.sm} {
    font-size: 16px;
  }
`;

const BigOverView = styled.p`
  color: ${(props) => props.theme.white.lighter};
  @media ${({ theme }) => theme.sm} {
    font-size: 12px;
  }
`;
