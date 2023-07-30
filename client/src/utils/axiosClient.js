import axios from "axios";

let baseUrl = "http://localhost:4000/api/v1";
if (process.env.REACT_APP_NODE_ENV === "production") {
  baseUrl = process.env.REACT_APP_BASE_URL;
}
const axiosClient = axios.create({
  baseURL: baseUrl,
});

export default axiosClient;
