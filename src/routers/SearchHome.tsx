import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { motion, useAnimation, useScroll } from "framer-motion";
import { Link, useMatch, useNavigate } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";

interface IFormInput {
  value: string;
}

const SearchHome = () => {
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
const Title = styled.h1``;
const Button = styled.button`
  display: none;
`;
const Form = styled.form`
  width: 30%;
  display: flex;
  align-items: center;
  margin-top: 200px;
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
