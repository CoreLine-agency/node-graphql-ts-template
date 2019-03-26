import { AxiosResponse } from 'axios';

export interface IGoogleApiResponse extends AxiosResponse {
  data: {
    id: string;
    email: string;
    given_name: string;
    family_name: string;
  };
}
