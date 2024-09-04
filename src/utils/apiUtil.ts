import axios, { AxiosError } from "axios";
import { Toast } from "../components/CustomToast";

export const isAxiosError = <HttpErrorResponseType>(
  error: unknown,
): error is AxiosError<HttpErrorResponseType> => {
  return axios.isAxiosError(error);
};

export interface HttpErrorResponseType {
  message: string
}

export const errorHandler = (error: unknown) => {
  if (isAxiosError<HttpErrorResponseType>(error)) {
    const status = error.response?.status || 0;
    const message = error.response?.data.message;
    console.log(status, message);

    if (status === 403) {
      Toast.warning("로그인 유효시간이 만료되었습니다");
    } else {
      Toast.warning(`${message}`);
    }
  } else {
    Toast.error("예상치 못한 오류 발생");
  }
}



