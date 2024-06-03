import React, { useState } from "react";
import { useQuery } from "react-query";
import {
  getPopularMovie,
  IGetTvRanking,
  IGetGenresResult,
  getGenres,
} from "../../api";
import styled from "styled-components";
import { motion, AnimatePresence, useScroll } from "framer-motion";
import { makeImagePath } from "../../utils";
import { useMatch, PathMatch, useNavigate } from "react-router-dom";
import { useMediaQuery } from "react-responsive";

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

const PopularTv = () => {
  const is1024 = useMediaQuery({ minWidth: 730, maxWidth: 1024 });
  const is720 = useMediaQuery({ minWidth: 300, maxWidth: 729 });

  let offset = 5;
  if (is1024) {
    offset = 4;
  } else if (is720) {
    offset = 3;
  }
  const { scrollY } = useScroll();
  const [index, setIndex] = useState(0);
  const navigate = useNavigate();
  const { data: popularTvData, isLoading } = useQuery<IGetTvRanking>(
    ["tvSeries", "popularTv"],
    getPopularMovie
  );
  const { data: genreData, isLoading: genreLoading } =
    useQuery<IGetGenresResult>(["getGenres"], getGenres);
  const [leaving, setLeaving] = useState(false);
  const toggleLeaving = () => {
    setLeaving((prev) => !prev);
  };
  console.log(popularTvData);
  const increaseIndex = () => {
    if (popularTvData) {
      setIndex((prev) => {
        const totalMovies = popularTvData.results.length;
        const maxIndex = Math.ceil(totalMovies / offset) - 1;
        return prev === maxIndex ? 0 : prev + 1;
      });
    }
  };

  const onBoxClicked = (tvId: number) => {
    navigate(`/tv/popular/${tvId}`);
  };

  const bigMovieMatch: PathMatch<string> | null = useMatch("/tv/popular/:tvId");

  const clickedMovie =
    bigMovieMatch?.params.tvId &&
    popularTvData?.results.find(
      (tv) => tv.id + "" === bigMovieMatch.params.tvId
    );
  const onOverlayClick = () => {
    navigate("/tv");
  };

  return (
    <>
      <Slider>
        <h2>오늘의 인기있는 Tv 랭킹 순위</h2>
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
            {popularTvData?.results

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
                  {index === 0 ? <Count>{movieIndex + 1}</Count> : null}
                  {index === 1 ? (
                    <Count>{movieIndex + 1 + offset}</Count>
                  ) : null}
                  {index === 2 ? (
                    <Count>{movieIndex + 1 + offset * 2}</Count>
                  ) : null}
                  {index === 3 ? (
                    <Count>{movieIndex + 1 + offset * 3}</Count>
                  ) : null}
                  {index === 4 ? (
                    <Count>{movieIndex + 1 + offset * 4}</Count>
                  ) : null}
                  {index === 5 ? (
                    <Count>{movieIndex + 1 + offset * 5}</Count>
                  ) : null}
                  {index === 6 ? (
                    <Count>{movieIndex + 1 + offset * 6}</Count>
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
        {bigMovieMatch ? (
          <>
            <Overlay
              onClick={onOverlayClick}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <BigMovie
              layoutId={bigMovieMatch?.params.tvId}
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
                    {clickedMovie.name}{" "}
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

const Button = styled.button`
  position: absolute;
  right: -10px;
  width: 80px;
  top: 60%;
  transform: translate(0, -50%);
  border: none;
  cursor: pointer;
  border-radius: 100%;
  height: 80px;
  background: rgba(255, 0, 0, 0.3);
  font-size: 30px;
  color: #fff;
  &:hover {
    background: rgba(255, 0, 0, 0.8);
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
  display: flex;
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
  width: 100%;
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
const VoteTitle = styled.span`
  font-size: 16px;
`;
export default PopularTv;
