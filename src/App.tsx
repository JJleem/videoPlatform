import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Home from "./routers/Home";
import Tv from "./routers/Tv";
import Search from "./routers/Search";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/movies/:movieId" element={<Home />} />
        <Route path="/movies/tv/:tvId" element={<Home />} />
        <Route path="/upComingMovie/:upComingMovieId" element={<Home />} />
        <Route path="/tv/:tvId" element={<Home />} />
        <Route path="/tv" element={<Tv />} />
        <Route path="/tv/popular/:tvId" element={<Tv />} />
        <Route path="/tv/top/:tvId" element={<Tv />} />
        <Route path="/search/:query" element={<Search />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
