import axios from "axios";

const contactService = {
  create: (data: any) => {
    return axios.post<{ message: string }>(`${process.env.NEXT_PUBLIC_API_URL}/contato`, data);
  },
};

export default contactService;
