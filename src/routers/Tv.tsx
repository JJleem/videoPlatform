import React, { useState } from "react";
import styled from "styled-components";
import { useQuery } from "react-query";

import { getTvTop, IGetTvRanking } from "../api";
import { makeImagePath } from "../utils";

import TopRanking from "../components/HomeComponents/TopRanking";
import TvTopRanking from "../components/HomeComponents/TvTopRanking";
import PopularTv from "../components/HomeComponents/PopularTv";

const Tv = () => {
  const { data, isLoading } = useQuery<IGetTvRanking>(
    ["tvSeries", "TopRanking"],
    getTvTop
  );

  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner>
            <Overlay />
            <img
              src={makeImagePath(data?.results[0].backdrop_path || "")}
            ></img>
            <TextInfo>
              <Title>{data?.results[0].name}</Title>

              <Overview>{data?.results[0].overview}</Overview>
            </TextInfo>
          </Banner>

          <TvTopRanking />

          <PopularTv />
        </>
      )}
    </Wrapper>
  );
};

export default Tv;

const Overlay = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1));
`;

const Wrapper = styled.div`
  background: #000;
  height: 100%;
  overflow: hidden;
  padding: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const Loader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 20vh;
`;

const Banner = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  margin-bottom: 80px;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    padding-top: 50px;
  }
  @media ${({ theme }) => theme.lg} {
    margin-bottom: 100px;
  }
  @media ${({ theme }) => theme.md} {
  }
  @media ${({ theme }) => theme.sm} {
    width: 100%;
    height: 500px;
    margin-top: 30px;
    img {
      width: 100%;
      height: 800px;
      padding-top: 20px;
    }
  }
  @media ${({ theme }) => theme.xs} {
  }
`;

const TextInfo = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 65%;
`;
const Title = styled.h2`
  font-size: 50px;
  color: #fff;
  z-index: 2;
  @media ${({ theme }) => theme.lg} {
    font-size: 36px;
  }
  @media ${({ theme }) => theme.md} {
    font-size: 30px;
  }
  @media ${({ theme }) => theme.sm} {
    font-size: 26px;
  }
  @media ${({ theme }) => theme.xs} {
    margin-top: 10px;
  }
`;

const Overview = styled.p`
  font-size: 26px;
  width: 70%;

  @media ${({ theme }) => theme.lg} {
    font-size: 22px;
  }
  @media ${({ theme }) => theme.md} {
    font-size: 16px;
    width: 70%;
  }
  @media ${({ theme }) => theme.sm} {
    font-size: 16px;
    width: 70%;
  }
  @media ${({ theme }) => theme.xs} {
  }
`;
