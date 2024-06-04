import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useQuery } from "react-query";
import { motion, AnimatePresence, useScroll } from "framer-motion";
import {
  IGetmoviesResult,
  IGetGenresResult,
  getGenres,
  IGetTvRanking,
  ContentsState,
  Review,
  fetchVideos,
} from "../../api";
import { makeImagePath } from "../../utils";
import { useMatch, PathMatch, useNavigate } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import { boxVariants, infoVariants, rowVariants } from "../Variants/variants";
import YouTube from "react-youtube";
interface TopRankingProps {
  data: IGetmoviesResult | IGetTvRanking | undefined;
  isLoading: boolean;
  title: string;
  num: number;
  lay: string;
}

const MovieBox: React.FC<TopRankingProps> = ({
  data,
  isLoading,
  title,
  num,
  lay,
}) => {
  const is1024 = useMediaQuery({ minWidth: 730, maxWidth: 1024 });
  const is720 = useMediaQuery({ minWidth: 300, maxWidth: 729 });
  let offset = 5;
  if (is1024) {
    offset = 4;
  } else if (is720) {
    offset = 3;
  }
  const [reviews, setReviews] = useState<ContentsState<Review>>({});
  const [videos, setVideos] = useState<ContentsState<string>>({});
  const { scrollY } = useScroll();
  const [index, setIndex] = useState(0);
  const navigate = useNavigate();

  const { data: genreData, isLoading: genreLoading } =
    useQuery<IGetGenresResult>(["getGenres"], getGenres);

  const [leaving, setLeaving] = useState(false);
  const toggleLeaving = () => {
    setLeaving((prev) => !prev);
  };

  const increaseIndex = () => {
    if (data) {
      setIndex((prev) => {
        const totalMovies = data.results.length;
        const maxIndex = Math.ceil(totalMovies / offset) - 1;
        return prev === maxIndex ? 0 : prev + 1;
      });
    }
  };

  const onBoxClicked = (id: number) => {
    if (num === 1) {
      navigate(`/movies/${id}`);
    } else if (num === 2) {
      navigate(`/upComingMovie/${id}`);
    } else if (num === 3) {
      navigate(`/movies/tv/${id}`);
    } else if (num === 4) {
      navigate(`/movies/tv/popular/${id}`);
    } else if (num === 5) {
      navigate(`/tv/top/${id}`);
    } else if (num === 6) {
      navigate(`/tv/popular/${id}`);
    }
  };

  const bigMovieMatch: PathMatch<string> | null = useMatch("/movies/:id");

  const upcomingMovieMatch: PathMatch<string> | null =
    useMatch("/upComingMovie/:id");

  const tvTopMatch: PathMatch<string> | null = useMatch("/movies/tv/:id");
  const popularTvMatch: PathMatch<string> | null = useMatch(
    "/movies/tv/popular/:id"
  );
  const tvtvMatch: PathMatch<string> | null = useMatch("/tv/top/:id");
  const tvpopularMatch: PathMatch<string> | null = useMatch("/tv/popular/:id");

  const [clickedMovie, setClickedMovie] = useState<any>(null);

  useEffect(() => {
    if (bigMovieMatch?.params.id) {
      setClickedMovie(
        data?.results.find((movie) => movie.id + "" === bigMovieMatch.params.id)
      );
    } else if (upcomingMovieMatch?.params.id) {
      setClickedMovie(
        data?.results.find(
          (movie) => movie.id + "" === upcomingMovieMatch.params.id
        )
      );
    } else if (tvTopMatch?.params.id) {
      setClickedMovie(
        data?.results.find((movie) => movie.id + "" === tvTopMatch.params.id)
      );
    } else if (popularTvMatch?.params.id) {
      setClickedMovie(
        data?.results.find(
          (movie) => movie.id + "" === popularTvMatch.params.id
        )
      );
    } else if (tvtvMatch?.params.id) {
      setClickedMovie(
        data?.results.find((movie) => movie.id + "" === tvtvMatch.params.id)
      );
    } else if (tvpopularMatch?.params.id) {
      setClickedMovie(
        data?.results.find(
          (movie) => movie.id + "" === tvpopularMatch.params.id
        )
      );
    } else {
      setClickedMovie(null);
    }
  }, [
    bigMovieMatch,
    upcomingMovieMatch,
    tvTopMatch,
    popularTvMatch,
    tvtvMatch,
    tvpopularMatch,
  ]);

  console.log(clickedMovie);
  console.log(data);
  console.log(tvTopMatch);

  console.log(videos);
  const onOverlayClick = () => {
    navigate(-1);
  };

  // const { data: videoData, isLoading: videoIsLoading } = useQuery(
  //   ["movies", "value"],
  //   () => fetchVideos(clickedMovie.id)
  // );

  // useEffect(() => {
  //   if (clickedMovie) {
  //     clickedMovie?.results?.forEach((movie) =>
  //       fetchVideos(movie.id).then((videoData) => {
  //         const videoIds = videoData?.results?.map((video: any) => video.key);
  //         setVideos((prev) => ({
  //           ...prev,
  //           [movie.id]: videoIds,
  //         }));
  //       })
  //     );
  //   }
  // }, [clickedMovie]);
  // console.log(videoData);

  // console.log(clickedMovie);

  return (
    <>
      <Slider>
        <h2>{title}</h2>
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
            {data?.results

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
                  layoutId={`${movie?.id}+${lay}`}
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
                    <h4>{movie.title ? movie.title : movie.name}</h4>
                  </Info>
                </Box>
              ))}
          </Row>
          <Button onClick={increaseIndex}>&gt;</Button>
        </AnimatePresence>
      </Slider>
      <AnimatePresence>
        {clickedMovie ? (
          <>
            <Overlay
              onClick={onOverlayClick}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <BigMovie
              layoutId={`${clickedMovie?.id}+${lay}`}
              style={{
                top: scrollY.get() + 50,
              }}
            >
              <div>
                {videos[movie.id]?.length > 0 ? (
                  <YouTube
                    videoId={videos[movie.id][0]}
                    opts={{
                      width: "100%",
                      height: "800px",
                      playerVars: {
                        autoplay: 0,
                        modestbrandig: 1,
                        loop: 0,
                        playlist: videos[movie.id][0],
                      },
                    }}
                    onReady={(e) => {
                      e.target.mute();
                    }}
                  />
                ) : (
                  "No Videos"
                )}
              </div>
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
                    {clickedMovie.title
                      ? clickedMovie.title
                      : clickedMovie.name}{" "}
                    <VoteTitle>⭐{clickedMovie.vote_average}</VoteTitle>
                  </BigTitle>
                  <Genre>
                    {clickedMovie.genre_ids
                      ?.map(
                        (Id: number) =>
                          genreData?.genres.find((item) => item.id === Id)?.name
                      )
                      .filter((name: number) => name)
                      .join(" / ")}{" "}
                  </Genre>
                  <div style={{ display: "flex", gap: "5px" }}>
                    <Detail>
                      {clickedMovie?.first_air_date
                        ? "상영 일자 : " + clickedMovie?.first_air_date + " /"
                        : "개봉 일자 : " + clickedMovie?.release_date + " /"}
                    </Detail>
                    <Detail>
                      {clickedMovie?.origin_country
                        ? "국가ISO : " + clickedMovie?.origin_country + " /"
                        : null}
                    </Detail>
                    <Detail>
                      {clickedMovie?.original_language
                        ? "언어 : " + clickedMovie?.original_language
                        : null}
                    </Detail>
                  </div>
                  <BigOverView>
                    {clickedMovie.overview
                      ? clickedMovie.overview
                      : "상세 정보 없음"}
                  </BigOverView>
                </>
              )}
            </BigMovie>
          </>
        ) : null}
      </AnimatePresence>
    </>
  );
};

export default MovieBox;

const Detail = styled.div`
  font-size: 14px;
  margin-bottom: 10px;
`;
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
  margin-bottom: 2px;
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
  height: 90vh;
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
  background-position: center;

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
  font-size: 12px;
  @media ${({ theme }) => theme.sm} {
    font-size: 12px;
  }
`;
