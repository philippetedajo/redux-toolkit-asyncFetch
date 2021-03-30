import React from "react";
import { useAppSelector, useAppDispatch } from "../redux/hook";
import { getRepos, selectRepos } from "../redux/repos/reposSlice";

const Repos = () => {
  const state = useAppSelector(selectRepos);
  const dispatch = useAppDispatch();

  console.log(state);
  return (
    <div>
      <button onClick={(e) => dispatch(getRepos())}>Get all react repos</button>
    </div>
  );
};

export default Repos;
