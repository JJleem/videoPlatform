import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { motion, useAnimation, useScroll } from "framer-motion";
import { Link, useMatch, useNavigate } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";
import MovieBox from "../components/HomeComponents/MovieBox";
import { useQuery } from "react-query";
import {
  getMovies,
  IGetmoviesResult,
  getPopularMovie,
  IGetTvRanking,
  getTvTop,
  getUpcomingMovie,
} from "../api";

interface IFormInput {
  value: string;
}

const SearchHome = () => {
  const { data: movieData, isLoading: movieIsLoading } =
    useQuery<IGetmoviesResult>(["movies", "nowPlaying"], getMovies);

  const { data: tvData, isLoading: tvIsLoading } = useQuery<IGetTvRanking>(
    ["tvSeries", "TopRanking"],
    getTvTop
  );

  const navigate = useNavigate();
  const { register, handleSubmit, reset, setValue } = useForm<IFormInput>();
  const onSubmit: SubmitHandler<IFormInput> = (value) => {
    navigate(`/search/${value.value}`);
    setValue("value", "");
  };
  return (
    <Container>
      <Title>어떤 컨텐츠를 찾고 계세요?</Title>
      <h5>지금 바로 검색해보세요!</h5>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Input
          {...register("value")}
          type="text"
          placeholder="Search for movie or tv..."
        />
        <Button type="submit"></Button>
      </Form>
      <Movie>
        <MovieBox
          data={movieData}
          isLoading={movieIsLoading}
          title={"오늘의 Movie TOP 랭킹 순위"}
          num={1}
          lay={"topmovie"}
        />
        <MovieBox
          data={tvData}
          isLoading={tvIsLoading}
          title={"오늘의 Tv TOP 랭킹 순위"}
          num={3}
          lay={"tvtop"}
        />
      </Movie>
    </Container>
  );
};

export default SearchHome;

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #fff;
  z-index: 2;
  padding-top: 120px;
`;
const Movie = styled.div`
  width: 100%;
  margin-top: 100px;
`;
const Title = styled.h1``;
const Button = styled.button`
  display: none;
`;
const Form = styled.form`
  width: 800px;
  display: flex;
  align-items: center;
  margin-top: 100px;
  margin-bottom: 100px;
  @media ${({ theme }) => theme.lg} {
    width: 700px;
  }
  @media ${({ theme }) => theme.md} {
    width: 600px;
  }
  @media ${({ theme }) => theme.sm} {
    width: 400px;
  }
  @media ${({ theme }) => theme.xs} {
    width: 350px;
  }
`;
const Input = styled.input`
  width: 100%;
  height: 100%;
  padding: 20px 25px;
  padding-right: 40px;
  font-size: 16px;
  border: none;
  border-bottom: 1px solid gray;
  border-radius: 4px;
  background-color: rgba(0, 0, 0, 0.5);
  color: #fff;
  &:focus {
    outline: none;
    border-bottom: 1px solid #f00;
  }
`;
