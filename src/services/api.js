import axios from "axios";
import endpoints from "./endpoints";


const getAllPizza = async () => {
  try {
    return await axios.get(`${process.env.REACT_APP_BASE_API_URL}${endpoints.pizza}`);
  } catch (error) {
    return error;
  }
};

export default getAllPizza;