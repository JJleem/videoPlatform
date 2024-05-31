import React, { useEffect } from "react";
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
  console.log(movieData);
  const { data: genreData, isLoading: genreLoading } =
    useQuery<IGetGenresResult>(["getGenres"], getGenres);

  useEffect(() => {
    refetch();
  }, [query, refetch]);

  const onBoxClicked = (movieId: number) => {
    navigate(`/movies/${movieId}`);
  };

  return (
    <Container>
      {movieLoading && genreLoading && !movieData ? (
        <Wrapper>Loading.....</Wrapper>
      ) : (
        <>
          <Title> 검색하신 '{query}'의 내용들입니다.</Title>
          <Wrapper>
            {movieData?.results?.map((movie) => (
              <LiWrapper key={movie.id}>
                <Content
                // bgPhoto={makeImagePath(movie.backdrop_path)}
                // onClick={() => onBoxClicked(movie.id)}
                >
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
                      {movie.original_language ? movie.original_language : null}
                    </h5>
                  </InfoInner>
                  <InfoInner>
                    <h4>
                      {movie.overview ? movie.overview : "상세 정보 없음"}
                    </h4>
                  </InfoInner>
                  <InfoInner style={{ position: "absolute", bottom: "20px" }}>
                    <h4>
                      {movie.release_date
                        ? movie.release_date
                        : movie.first_air_date
                        ? movie.first_air_date
                        : "상세 정보 없음"}
                    </h4>
                    <h4>
                      {movie.vote_average ? "⭐" + movie.vote_average : null} ({" "}
                      {movie.vote_count?.toLocaleString("ko-kr")} )
                    </h4>
                  </InfoInner>
                </Info>
              </LiWrapper>
            ))}
          </Wrapper>
        </>
      )}
    </Container>
  );
};

export default Search;

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

  flex-direction: column;
  padding-top: 145px;
`;
const LiWrapper = styled.li`
  width: 100%;
  height: 100%;
  /* box-shadow: 0px 0px 3px #f00; */
  display: flex;
  margin-bottom: 30px;
  padding: 20px;
  justify-content: center;
  align-items: center;
  position: relative;
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
