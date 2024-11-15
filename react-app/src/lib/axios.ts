import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "https://4n6xtz6wgi.execute-api.us-east-1.amazonaws.com/dev/todos/",
  timeout: 1000,
  headers: {},
});
