import axios from "axios";

const API = axios.create({
  baseURL: "https://emzagcw523.us-east-1.awsapprunner.com"
});

export const optimizeQuery = (sqlQuery) => {
  return API.post("/optimize", { sqlQuery });
};