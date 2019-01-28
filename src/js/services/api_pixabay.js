import axios from "axios";

const BASE_URL = "https://pixabay.com/api/";
const API_KEY = "10482228-408f6b22fcb86c00bbed30e3f";
const RETURN_QUANTITY = "12";

export const getImages = (request, page) => {
  return axios
    .get(
      `${BASE_URL}?key=${API_KEY}&q=${request}&per_page=${RETURN_QUANTITY}&page=${page}`
    )
    .then(response => {
      return response.data;
    })
    .catch(err => {
      console.log(`Error while fetching, with status-code ${err.status}`);
    });
};
