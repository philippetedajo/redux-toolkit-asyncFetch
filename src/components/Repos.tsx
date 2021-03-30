import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { npmSchema } from "../utils/validationSchemas";
import { useAppSelector, useAppDispatch } from "../redux/hook";
import { getRepos, selectRepos } from "../redux/repos/reposSlice";

interface NpmForm {
  search_term: string;
}

const Repos: React.FC = () => {
  const { data, loading, error } = useAppSelector(selectRepos);
  const dispatch = useAppDispatch();

  const { register, handleSubmit, errors } = useForm<NpmForm>({
    resolver: yupResolver(npmSchema),
  });
  const onSubmit = ({ search_term }: NpmForm) => {
    dispatch(getRepos(search_term));
  };

  const list = data.map((repo: any, index: number) => (
    <li key={index}>{repo.name} </li>
  ));

  return (
    <div className="border-2 h-screen flex justify-center">
      <div className="mt-20">
        <h1 className="text-2xl mb-5">Search an npm registry package</h1>
        <div className="text-2xl mb-5">
          <form onSubmit={handleSubmit(onSubmit)}>
            <input
              type="text"
              className="border-2 border-blue-600 rounded mr-5 px-3"
              name="search_term"
              ref={register}
            />
            <button
              type="submit"
              className="bg-blue-600 text-white rounded p-1"
            >
              Search
            </button>
          </form>
          {errors.search_term && (
            <small className="text-red-500">{errors.search_term.message}</small>
          )}
        </div>

        {loading && <div>Loading...</div>}
        {data && <div> {list} </div>}
        {error && console.log(error)}
      </div>
    </div>
  );
};

export default Repos;
