import { IHome } from "@/interfaces/home";
import axios from "axios";

const homeService = {
  get: () => {
    return axios.get<IHome>(`${process.env.NEXT_PUBLIC_API_URL}/home-all`);
  },
};
export default homeService;
