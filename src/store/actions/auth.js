import * as actionTypes from './actionTypes'

export const loginSuccess = (data) => {
    return{
        type: actionTypes.loginSuccess,
        data: data
    };
};

export const logout = () => {
    return{
        type: actionTypes.logout,
    };
};
