import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useQuery } from "react-query";
import {
  IGetmoviesResult,
  getSearch,
  getGenres,
  IGetGenresResult,
} from "../api";
import { styled } from "styled-components";
import { makeImagePath } from "../utils";
import { motion, AnimatePresence, useScroll } from "framer-motion";
const API_KEY = "0bc8bd2db453d7413d1c2844ec617b61";
const BASE_PATH = "https://api.themoviedb.org/3";
const Search = () => {
  const { query } = useParams();
  const navigate = useNavigate();

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

  const { data: genreData, isLoading: genreLoading } =
    useQuery<IGetGenresResult>(["getGenres"], getGenres);

  useEffect(() => {
    refetch();
  }, [query, refetch]);

  const onBoxClicked = (movieId: number) => {
    navigate(`/movies/${movieId}`);
  };
  type ReviewState = {
    [key: number]: string[];
  };
  const [reviews, setReviews] = useState<ReviewState>({});
  const fetchReviews = (movieId: number) => {
    return fetch(
      `${BASE_PATH}/movie/${movieId}/reviews?language=en-US&page=1&api_key=${API_KEY}`
    ).then((response) => response.json());
  };
  useEffect(() => {
    if (movieData) {
      movieData.results.forEach((movie) =>
        fetchReviews(movie.id).then((reviewData) =>
          setReviews((prev) => ({
            ...prev,
            [movie.id]: reviewData?.results?.map(
              (review: any) => review.content
            ),
          }))
        )
      );
    }
  }, [movieData]);
  console.log(movieData, reviews);
  return (
    <Container>
      {movieLoading && genreLoading && !movieData ? (
        <Wrapper>Loading.....</Wrapper>
      ) : (
        <>
          <Title> 검색하신 '{query}'의 내용들입니다.</Title>
          <Wrapper>
            {movieData?.results?.map((movie) => (
              <InnerWrapper>
                <LiWrapper key={movie.id}>
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
                      <InfoInner
                      // style={{ position: "absolute", bottom: "20px" }}
                      >
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
                  <ReviewSection>
                    <h3>Review : </h3>
                    {reviews[movie.id]?.length > 0 ? (
                      reviews[movie.id].map((content, reviewIndex) => (
                        <p key={reviewIndex}>
                          <div>
                            <ReviewTitle>UserReview </ReviewTitle>: {content}
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
  /* background: linear-gradient(
    to left,
    white,
    transparent,
    transparent,
    transparent
  ); */
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
  background: #f8f9fa;
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
