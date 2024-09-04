import axios from 'axios';
import store from '../store';
import userSlice from '../slices/user';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:8000', // 여기에 API의 baseURL을 설정하세요.
});

// 요청 인터셉터를 추가하여 모든 요청에 헤더를 추가합니다.
axiosInstance.interceptors.request.use(
    (config) => {
        const state = store.getState();
        const token = config.url === '/user/refresh' ? state.userReducer.refreshToken : state.userReducer.accessToken; // 토큰 또는 필요한 다른 값을 가져옵니다.

        if (token) {
            config.headers.Authorization = `${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 응답 인터셉터를 추가하여 403 응답을 처리합니다.
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;
        const state = store.getState();

        if (error.response && error.response.status === 403) {
            if (originalRequest.url === '/user/refresh') {
                store.dispatch(userSlice.actions.setUserLogout());
                return Promise.reject(error);
            }

            try {
                // 새로운 토큰을 Redux에 저장합니다. TODO 변경 필요
                const response = await axiosInstance.post('/user/refresh');

                const newAccessToken = response.data.ACCESS_TOKEN;
                const newRefreshToken = response.data.REFRESH_TOKEN;

                // 새로운 토큰을 Redux에 저장합니다. TODO 변경 필요
                store.dispatch(userSlice.actions.setUserLogin({
                    id: state.userReducer.id,
                    name: state.userReducer.name,
                    accessToken: newAccessToken,
                    refreshToken: newRefreshToken,
                    accessKey: state.userReducer.accessKey,
                    secretKey: state.userReducer.secretKey,
                }));

                // 새로운 토큰을 사용하여 원래의 요청을 다시 시도합니다.
                originalRequest.headers.Authorization = newAccessToken;
                return axiosInstance(originalRequest);
            } catch (refreshError) {
                // refresh 토큰이 유효하지 않으면 로그아웃 처리
                store.dispatch(userSlice.actions.setUserLogout());
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error); // 여기에서 에러를 반환하여 무한 요청을 방지합니다.
    }
);

export default axiosInstance;
