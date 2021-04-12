import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import algoliasearch from "algoliasearch";
import { RootState } from "../store";
import axios from "axios";

interface ReposState {
  loading: boolean;
  error: string | null | unknown;
  data: any;
}

const initialState: ReposState = {
  loading: false,
  error: null,
  data: [],
};

export const getRepos = createAsyncThunk(
  "repos/getRepos",
  async (term: string) => {
    await axios
      .get("http://registry.npmjs.org/-/v1/search", {
        params: {
          text: term,
        },
      })
      .then((response) => {
        const data = response.data.objects.map((repo: any) => repo.package);
        return dataToAlgoliaObject(data);
      })
      .then(async (response) => {
        await sendDataToAlgolia(response);
        return;
      })
      .then(async () => {
        await configureAlgoliaIndex();
        return;
      })
      .catch(function (error) {
        console.warn(error);
      });
  }
);

//============================== algolia utils functions
function dataToAlgoliaObject(data_points: any) {
  var algoliaObjects = [];
  for (var i = 0; i < data_points.length; i++) {
    var data_point = data_points[i];
    var algoliaObject = {
      objectID: data_point.date,
      name: data_point.name,
    };
    algoliaObjects.push(algoliaObject);
  }

  return algoliaObjects;
}

const algoliaClient = algoliasearch(
  "EEYQ27VWH1",
  "2bd847ba6b65ccb8ddb6e82627daa3d2"
);
const algoliaIndex = algoliaClient.initIndex("codetree-npm");

function sendDataToAlgolia(algoliaObjects: any) {
  console.log(algoliaObjects);
  algoliaIndex
    .saveObjects(algoliaObjects)
    .then(({ objectIDs }) => {
      console.log(objectIDs);
    })
    .catch((err) => {
      console.log(err);
    });
}

async function configureAlgoliaIndex() {
  algoliaIndex.setSettings({
    searchableAttributes: ["name"],
    attributesToHighlight: ["name"],
    customRanking: ["desc(rating)"],
    attributesToRetrieve: ["name"],
  });
}
//============================== //

export const reposSlice = createSlice({
  name: "repos",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getRepos.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.data = [];
    });
    builder.addCase(getRepos.fulfilled, (state, action) => {
      state.loading = false;
      state.error = null;
      state.data = action.payload;
    });
    builder.addCase(getRepos.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.data = [];
    });
  },
});

export const selectRepos = (state: RootState) => state.repos;

export default reposSlice.reducer;
