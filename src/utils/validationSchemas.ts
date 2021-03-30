import * as yup from "yup";

export const npmSchema = yup.object().shape({
  search_term: yup.string().required("Enter an npm package"),
});
