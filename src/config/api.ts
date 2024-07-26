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
        const token = state.userReducer.accessToken; // 토큰 또는 필요한 다른 값을 가져옵니다.

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
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

        if (error.response.status === 403 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const state = store.getState();
                const refreshToken = state.userReducer.refreshToken;

                const response = await axiosInstance.post('/auth/refresh-token', {
                    refreshToken,
                });

                const newAccessToken = response.data.accessToken;

                // 새로운 토큰을 Redux에 저장합니다.
                store.dispatch(userSlice.actions.setUserLogin({
                    id: state.userReducer.id,
                    token: newAccessToken,
                    refreshToken, // 이미 있는 리프레시 토큰 유지
                }));

                // 새로운 토큰을 사용하여 원래의 요청을 다시 시도합니다.
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return axiosInstance(originalRequest);
            } catch (refreshError) {
                // refresh 토큰이 유효하지 않으면 로그아웃 처리
                store.dispatch(userSlice.actions.setUserLogout());
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
