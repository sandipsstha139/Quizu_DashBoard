import axios from "axios";

const ApiRequest = axios.create({
  baseURL: "http://localhost:4000/api/v1",
  withCredentials: true,
});

export default ApiRequest;
// https://quizu-backend-1.onrender.com/api/v1 render url
