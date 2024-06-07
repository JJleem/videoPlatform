import React, { useState, useEffect } from "react";
import {
  Route,
  Routes,
  useNavigate,
  useParams,
  useSearchParams,
  Link,
  useMatch,
  useLocation,
} from "react-router-dom";
import { useQuery } from "react-query";
import {
  IGetmoviesResult,
  getSearch,
  getGenres,
  IGetGenresResult,
  IMovie,
} from "../api";
import { styled } from "styled-components";
import { makeImagePath } from "../utils";
import { motion, AnimatePresence, useScroll } from "framer-motion";
import YouTube from "react-youtube";
import Related from "../components/Related";
import Review from "../components/Review";
import Pagination from "react-js-pagination";

const API_KEY = "0bc8bd2db453d7413d1c2844ec617b61";
const BASE_PATH = "https://api.themoviedb.org/3";

const Search = () => {
  const { query } = useParams();
  const {
    data: movieData,
    isLoading: movieLoading,
    refetch,
  } = useQuery<IGetmoviesResult>(
    ["movies", "value"],
    () => getSearch(`${query}`),
    {
      enabled: !!query && query.trim() !== "",
    }
  );

  const navigate = useNavigate();

  const [videos, setVideos] = useState<ContentsState<string>>({});
  const [recommends, setRecommends] = useState<ContentsState<Content>>({});
  const [reviews, setReviews] = useState<ContentsState<Content>>({});

  const fetchVideos = (movieId: number) => {
    return fetch(
      `${BASE_PATH}/movie/${movieId}/videos?language=en-US&page=1&api_key=${API_KEY}`
    ).then((response) => response.json());
  };

  const fetchReviews = (movieId: number) => {
    return fetch(
      `${BASE_PATH}/movie/${movieId}/reviews?language=en-US&page=1&api_key=${API_KEY}`
    ).then((response) => response.json());
  };

  const fetchRecommends = (movieId: number) => {
    return fetch(
      `${BASE_PATH}/movie/${movieId}/recommendations?language=en-US&page=1&api_key=${API_KEY}`
    ).then((response) => response.json());
  };

  useEffect(() => {
    if (movieData) {
      movieData.results.forEach((movie) => {
        fetchVideos(movie.id).then((videoData) => {
          const videoIds = videoData?.results?.map((video: any) => video.key);
          setVideos((prev) => ({
            ...prev,
            [movie.id]: videoIds,
          }));
        });
        fetchReviews(movie.id).then((reviewData) =>
          setReviews((prev) => ({
            ...prev,
            [movie.id]: reviewData?.results?.map((review: any) => ({
              author: review.author,
              content: review.content,
            })),
          }))
        );
        fetchRecommends(movie.id).then((recommendData) => {
          setRecommends((prev) => ({
            ...prev,
            [movie.id]: recommendData?.results?.map((recommend: any) => ({
              title: recommend.title,
              backdrop_path: recommend.backdrop_path,
            })),
          }));
        });
      });
    }
  }, [movieData]);
  const location = useLocation();
  const reviewMatch = useMatch("search/review");
  const relatedMatch = useMatch("search/related");
  const [showReviewContent, setShowReviewContent] = useState(false);
  const [showRelatedContent, setShowRelatedContent] = useState(false);
  const toggleReviewContent = () => {
    setShowReviewContent(!showReviewContent);
  };
  const toggleRelatedContent = () => {
    setShowRelatedContent(!showRelatedContent);
  };

  const { data: genreData, isLoading: genreLoading } =
    useQuery<IGetGenresResult>(["getGenres"], getGenres);

  useEffect(() => {
    refetch();
  }, [query, refetch]);

  const onBoxClicked = (movieId: number) => {
    navigate(`/movies/${movieId}`);
  };

  type Content = {
    author: string;
    content: string;
    title: string;
    backdrop_path: string;
  };

  type ContentsState<T> = {
    [key: number]: T[];
  };

  //pagenation 기능
  const [currentPage, setCurrentPage] = useState(1);
  const [moviesPerPage, setMoviesPerPage] = useState(4);
  // page변경함수
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const indexOfLastMovie = currentPage * moviesPerPage;
  const indexOfFirstMovie = indexOfLastMovie - moviesPerPage;
  const currentMovies: IMovie[] =
    movieData?.results.slice(indexOfFirstMovie, indexOfLastMovie) || [];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  return (
    <Container>
      {movieLoading && genreLoading && !movieData ? (
        <Wrapper>Loading.....</Wrapper>
      ) : (
        <>
          <Title> 검색하신 '{query}'의 내용들입니다.</Title>
          <Wrapper>
            {currentMovies?.map((movie) => (
              <InnerWrapper key={movie.id}>
                <LiWrapper>
                  <Innerdiv>
                    <Content>
                      <img
                        src={makeImagePath(
                          movie.backdrop_path ? movie.backdrop_path : ""
                        )}
                      ></img>
                    </Content>
                    <Info>
                      <InfoInner>
                        <h1>{movie.name ? movie.name : movie.title}</h1>
                        <h4>
                          {movie.original_title ? movie.original_title : null}
                        </h4>
                      </InfoInner>
                      <InfoInner>
                        <Genre>
                          {movie.genre_ids
                            ?.map(
                              (Id) =>
                                genreData?.genres.find((item) => item.id === Id)
                                  ?.name
                            )
                            .filter((name) => name)
                            .join(" / ")}
                        </Genre>
                        {movie.adult ? (
                          <h5 style={{ backgroundColor: "red" }}>
                            {"청소년관람불가"}
                          </h5>
                        ) : (
                          <h5 style={{ backgroundColor: "rgba(0,255,0,0.5)" }}>
                            {"전체이용가"}
                          </h5>
                        )}

                        <h5>{movie.media_type ? movie.media_type : null}</h5>
                        <h5>
                          {movie.original_language
                            ? movie.original_language
                            : null}
                        </h5>
                      </InfoInner>
                      <InfoInner>
                        <h4>
                          {movie.overview ? movie.overview : "상세 정보 없음"}
                        </h4>
                      </InfoInner>
                      <InfoInner>
                        <h4>
                          {movie.release_date
                            ? movie.release_date
                            : movie.first_air_date
                            ? movie.first_air_date
                            : "상세 정보 없음"}
                        </h4>
                        <h4>
                          {movie.vote_average
                            ? "⭐" + movie.vote_average.toFixed(2)
                            : "N/A"}{" "}
                          ({" "}
                          {movie.vote_count
                            ? movie.vote_count?.toLocaleString("ko-kr")
                            : "N/A"}{" "}
                          )
                        </h4>
                      </InfoInner>
                    </Info>
                  </Innerdiv>
                  <Tabs>
                    <Tab
                      onClick={toggleReviewContent}
                      isActive={reviewMatch !== null}
                    >
                      <Link to={`review${location.search}`}>Review</Link>
                    </Tab>
                    <Tab
                      onClick={toggleRelatedContent}
                      isActive={relatedMatch !== null}
                    >
                      <Link to={`related${location.search}`}>Related</Link>
                    </Tab>
                  </Tabs>
                  <Routes>
                    {showReviewContent && (
                      <Route
                        path="review"
                        element={
                          <Review reviews={reviews} movieId={movie.id} />
                        }
                      />
                    )}
                    {showRelatedContent && (
                      <Route
                        path="related"
                        element={
                          <Related recommends={recommends} movieId={movie.id} />
                        }
                      />
                    )}
                  </Routes>
                  <ReviewSection>
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
                    <h3>Review : </h3>
                    {reviews[movie.id]?.length > 0 ? (
                      reviews[movie.id].map((review, reviewIndex) => (
                        <p key={reviewIndex}>
                          <div>
                            <ReviewTitle>{review.author} </ReviewTitle>:{" "}
                            {review.content}
                          </div>
                        </p>
                      ))
                    ) : (
                      <p> No Reviews Available</p>
                    )}
                  </ReviewSection>
                </LiWrapper>
              </InnerWrapper>
            ))}
            <StyledPagination>
              <Pagination
                onChange={handlePageChange}
                activePage={currentPage}
                itemsCountPerPage={moviesPerPage}
                totalItemsCount={movieData?.results.length || 0}
                pageRangeDisplayed={5}
              />
            </StyledPagination>
          </Wrapper>
        </>
      )}
    </Container>
  );
};

export default Search;

const InnerWrapper = styled.div`
  width: 100%;
  height: fit-content;
`;
const Innerdiv = styled.div`
  display: flex;
`;

const Genre = styled.div``;

const Title = styled.h1`
  position: absolute;
  top: 100px;
  color: #fff;
  width: fit-content;
`;

const Container = styled.div`
  padding-top: 145px;
  padding: 20px;
  width: 100%;
  height: 100vh;
  display: flex;
`;

const Content = styled(motion.div)`
  background-color: #fff;

  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
  height: 500px;
  width: 100%;
  color: #fff;
  border-radius: 20px;
  background-color: transparent;
  img {
    width: 100%;
    object-fit: cover;
    height: 100%;
    background: black;
    border-radius: 20px;
  }
`;
const Info = styled.div`
  width: 100%;
  height: 100%;
  padding: 50px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Wrapper = styled.ul`
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: column;
  padding-top: 145px;
`;
const LiWrapper = styled.li`
  width: 100%;
  height: 100%;

  display: flex;
  margin-bottom: 30px;
  padding: 20px;
  justify-content: center;

  position: relative;
  flex-direction: column;
  gap: 10px;
`;

const InfoInner = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;

  h5 {
    padding: 1px 8px;
    border-radius: 10px;
    background: #fff;
    color: #000;
    line-height: 1.5;
  }
`;

const ReviewSection = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;

  height: 100%;
  padding: 20px;
  font-size: 12px;
  background: rgba(255, 255, 255, 0.7);

  color: ${(props) => props.theme.black.darker};
  border-radius: 10px;
  p {
    padding: 10px;
    width: 100%;
    div {
      width: 100%;
    }
  }
`;

const ReviewTitle = styled.span`
  font-size: 18px;
  font-weight: bold;
  color: ${(props) => props.theme.red};
`;

const Tabs = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-start;
  margin: 25px 0;
  padding-left: 100px;
  gap: 10px;
`;
const Tab = styled.span<{ isActive: boolean }>`
  text-align: center;
  text-transform: uppercase;
  font-size: 16px;
  background-color: rgba(255, 255, 255, 1);
  padding: 7px 30px;
  border-radius: 10px;
  color: ${(props) =>
    props.isActive ? props.theme.red : props.theme.black.darker};
  transition: all 0.3s;
  &:hover {
    background-color: ${(props) => props.theme.red};
    color: #fff;
  }
`;

const StyledPagination = styled.div`
  display: flex;
  justify-content: center;
  margin: 20px 0;
  ul {
    display: inline;
    margin: 0 5px;
  }
  li {
    display: inline;
    margin: 0 5px;
    a {
      text-decoration: none;
      color: #fff;
      padding: 5px 10px;
      border-radius: 50%;
      transition: background-color 0.3s, color 0.3s;
      &:hover {
        background-color: ${(props) => props.theme.red};
        color: #fff;
      }
    }
    &.active a {
      color: #fff;
      background-color: ${(props) => props.theme.red};
    }
  }
`;
