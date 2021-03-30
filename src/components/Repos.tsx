import React from "react";
import { useForm } from "react-hook-form";
import { useAppSelector, useAppDispatch } from "../redux/hook";
import { getRepos, selectRepos } from "../redux/repos/reposSlice";

interface NpmForm {
  search_term: string;
}

const Repos = () => {
  const state = useAppSelector(selectRepos);
  const dispatch = useAppDispatch();

  const { register, handleSubmit, errors } = useForm<NpmForm>();
  const onSubmit = ({ search_term }: NpmForm) => {
    dispatch(getRepos(search_term));
  };

  console.log(state);
  return (
    <div className="border-2 h-screen flex justify-center">
      <div className="mt-20">
        <h1>Search an npm registry package</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <input
            type="text"
            className="border-2 border-blue-600 rounded"
            name="search_term"
            ref={register}
          />
          <button type="submit">Search</button>
        </form>
      </div>
    </div>
  );
};

export default Repos;
