import React, { useState } from "react";
import { useQuery } from "react-query";
import { getTvTop, IGetTvRanking } from "../../api";
import styled from "styled-components";
import { motion, AnimatePresence, useScroll } from "framer-motion";
import { makeImagePath } from "../../utils";
import {
  useMatch,
  PathMatch,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { click } from "@testing-library/user-event/dist/click";

const offset = 6;

const infoVariants = {
  hover: {
    opacity: 1,
    transition: { delay: 0.3, type: "tween" },
    display: "block",
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

const TvTopRanking = () => {
  const location = useLocation();
  const { scrollY } = useScroll();
  const [index, setIndex] = useState(0);
  const navigate = useNavigate();
  const { data: tvData, isLoading } = useQuery<IGetTvRanking>(
    ["tvSeries", "TopRanking"],
    getTvTop
  );
  const [leaving, setLeaving] = useState(false);
  const toggleLeaving = () => {
    setLeaving((prev) => !prev);
  };

  const increaseIndex = () => {
    if (tvData) {
      setIndex((prev) => {
        const totalMovies = tvData.results.length - 2;
        const maxIndex = Math.ceil(totalMovies / offset) - 1;
        return prev === maxIndex ? 0 : prev + 1;
      });
    }
  };
  const currentPath = location.pathname;

  const onBoxClicked = (tvId: number) => {
    if (location.pathname.startsWith("/tv")) {
      navigate(`/tv/top/${tvId}`);
    } else if (location.pathname.startsWith("/")) {
      navigate(`/movies/tv/${tvId}`);
    }
  };

  const bigMovieMatch: PathMatch<string> | null = useMatch("/tv/top/:tvId");
  const smallMovieMatch: PathMatch<string> | null =
    useMatch("/movies/tv/:tvId");

  const clickedMovie = location.pathname.startsWith("/tv")
    ? tvData?.results.find((tv) => tv.id + "" === bigMovieMatch?.params.tvId)
    : tvData?.results.find((tv) => tv.id + "" === smallMovieMatch?.params.tvId);

  console.log(bigMovieMatch);
  console.log(smallMovieMatch);
  console.log(clickedMovie);
  const onOverlayClick = () => {
    navigate(-1);
  };

  return (
    <>
      <Slider>
        <h1>오늘의 Tv TOP 랭킹 순위</h1>
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
            {tvData?.results

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
                    <h4>{movie.name}</h4>
                  </Info>
                </Box>
              ))}
          </Row>
          <Button onClick={increaseIndex}>&gt;</Button>
        </AnimatePresence>
      </Slider>
      <AnimatePresence>
        {bigMovieMatch || smallMovieMatch ? (
          <>
            <Overlay
              onClick={onOverlayClick}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <BigMovie
              layoutId={
                bigMovieMatch?.params.tvId
                  ? bigMovieMatch?.params.tvId
                  : smallMovieMatch?.params.tvId
              }
              style={{
                top: scrollY.get() + 200,
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
                  <BigTitle>{clickedMovie.title}</BigTitle>
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

const Button = styled.button`
  position: absolute;
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
`;

const Info = styled(motion.div)`
  position: absolute;
  width: 100%;
  bottom: 0;
  background-color: ${(props) => props.theme.black.lighter};
  padding: 20px;
  opacity: 0;
  display: none;

  h4 {
    text-align: center;
    font-size: 18px;
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
  width: 40vw;
  height: 60vh;
  position: absolute;
  left: 0;
  right: 0;
  margin: 0 auto;
  background-color: ${(props) => props.theme.black.lighter};
  border-radius: 15px;
  overflow: hidden;
  z-index: 3;
`;

const BigCover = styled.div`
  width: 100%;
  height: 400px;
  background-size: cover;
  background-position: center center;
`;
const BigTitle = styled.h3`
  color: ${(props) => props.theme.white.lighter};
  text-align: left;
  font-size: 28px;
  padding: 10px;
  position: relative;
  top: -60px;
`;

const BigOverView = styled.p`
  padding: 20px;
  position: relative;
  top: -60px;
  color: ${(props) => props.theme.white.lighter};
`;

export default TvTopRanking;
