import React, { useState } from "react";
import styled from "styled-components";
import { useQuery } from "react-query";

import { getMovies, IGetmoviesResult } from "../api";
import { makeImagePath } from "../utils";

import TopRanking from "../components/HomeComponents/TopRanking";

const Home = () => {
  const { data, isLoading } = useQuery<IGetmoviesResult>(
    ["movies", "nowPlaying"],
    getMovies
  );

  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner bgPhoto={makeImagePath(data?.results[3].backdrop_path || "")}>
            <Title>{data?.results[3].title}</Title>
            <Overview>{data?.results[3].overview}</Overview>
          </Banner>
          <TopRanking />
        </>
      )}
    </Wrapper>
  );
};

export default Home;

const Wrapper = styled.div`
  background: #000;
  height: 100%;
  overflow: hidden;
  padding: 20px;
`;

const Loader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 20vh;
`;

const Banner = styled.div<{ bgPhoto: string | undefined }>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100vh;
  padding: 60px;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
    url(${(props) => props.bgPhoto});
  background-size: cover;
`;

const Title = styled.h2`
  font-size: 68px;
  margin-top: 20px;
`;

const Overview = styled.p`
  font-size: 30px;
  width: 50%;
`;
