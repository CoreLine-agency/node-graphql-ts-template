import { AxiosResponse } from 'axios';

export interface IFacebookApiResponse extends AxiosResponse {
  data: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
  };
}
