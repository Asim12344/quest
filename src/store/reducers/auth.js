import * as actionTypes from '../actions/actionTypes';

const initialState = {
    token: localStorage.getItem('token'),
    userID: localStorage.getItem('userID'),
    email: localStorage.getItem('email'),
    userName:localStorage.getItem('userName'),
    isAuthenticated:false
};

const reducer = ( state = initialState, action ) => {
    switch ( action.type ) {
        case actionTypes.loginSuccess:
            localStorage.setItem('token', action.data.token);
            localStorage.setItem('userID', action.data.userID);
            localStorage.setItem('email', action.data.email);
            localStorage.setItem('userName', action.data.userName)
            return{
                ...state,
                isAuthenticated: true
            }
        case actionTypes.logout:
            localStorage.removeItem('token');
            localStorage.removeItem('userID');
            localStorage.removeItem('email');
            localStorage.removeItem('userName');
            return{
                ...state,
                isAuthenticated: false
            }
        
    }
    return state;
}

export default reducer;