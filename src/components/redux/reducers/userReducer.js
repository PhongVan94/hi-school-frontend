import {FETCH_USER_ERROR, FETCH_USER_SUCCESS, FETCH_USER_LOGIN, USER_LOGOUT, USER_REFRESH} from "../actions/userAction";
// import localStorage from "redux-persist/es/storage";

const INITIAL_STATE = {
    dataRedux: {
        isAuthenticated: false,
        token: "",
        account: {},

    },
    isLoading: false,
    isError: false,
};

const userReducer = (state = INITIAL_STATE, action) => {

    switch (action.type) {

        case FETCH_USER_LOGIN:

            return {

                ...state,
                isLoading: false,
                isError: false
            };

        case FETCH_USER_ERROR:

            return {
                ...state, dataRedux: {
                    isAuthenticated: false,
                },
                isLoading: true,
                isError: true
            };
        case FETCH_USER_SUCCESS:
            return {
                ...state, dataRedux: {
                    isAuthenticated: action.data.payload.isAuthenticated,
                    token: action.data.payload.token,
                    account: action.data.payload.account,                },

                isLoading: false,
                isError: false,
            };

        case USER_LOGOUT:
            localStorage.removeItem('jwt');
            return {
                ...state,dataRedux: {
                    isAuthenticated: false,
                    token: "",
                    account: {},
                },
                isLoading: false,

            }
        case USER_REFRESH:

            return {
                ...state,
            }
        default:
            return state;

    }

};

export default userReducer;