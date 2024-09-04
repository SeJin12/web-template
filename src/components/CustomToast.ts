import { ProviderContext, SnackbarProvider, useSnackbar, VariantType } from 'notistack';
import React from 'react';

// SnackbarProvider를 사용하기 위해 useSnackbarRef를 선언합니다.
let useSnackbarRef: ProviderContext;
export const SnackbarUtilsConfigurator: React.FC = () => {
    useSnackbarRef = useSnackbar();
    return null;
};

// toast 객체에 다양한 타입의 메시지 표시 메서드를 추가합니다.
export const Toast = {
    success(msg: string) {
        useSnackbarRef.enqueueSnackbar(msg, {
            variant: 'success', anchorOrigin: { vertical: 'top', horizontal: 'center' }, autoHideDuration: 1000
            , disableWindowBlurListener: true
        });
    },
    error(msg: string) {
        useSnackbarRef.enqueueSnackbar(msg, { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' }, autoHideDuration: 1000, disableWindowBlurListener: true });
    },
    info(msg: string) {
        useSnackbarRef.enqueueSnackbar(msg, { variant: 'info', anchorOrigin: { vertical: 'top', horizontal: 'center' }, autoHideDuration: 1000, disableWindowBlurListener: true });
    },
    warning(msg: string) {
        useSnackbarRef.enqueueSnackbar(msg, { variant: 'warning', anchorOrigin: { vertical: 'top', horizontal: 'center' }, autoHideDuration: 1000, disableWindowBlurListener: true });
    },
    toast(msg: string, variant: VariantType = 'default') {
        useSnackbarRef.enqueueSnackbar(msg, { variant });
    }
};