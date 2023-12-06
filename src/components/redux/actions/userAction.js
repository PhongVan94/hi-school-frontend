import {loginUser} from "../../services/userServices";
import {toast} from "react-toastify";

// import localStorage from "redux-persist/es/storage";

export const FETCH_USER_LOGIN = 'FETCH_USER_LOGIN';
export const FETCH_USER_ERROR = 'FETCH_USER_ERROR';
export const FETCH_USER_SUCCESS = 'FETCH_USER_SUCCESS';

export const USER_LOGOUT = 'USER_LOGOUT';
export const USER_REFRESH = 'USER_REFRESH';

export const handleLoginRedux = (valueLogin, password) => {

    return async (dispatch, getState) => {
        dispatch({type: FETCH_USER_LOGIN});

        let response = await loginUser(valueLogin, password);
        if (response && +response.ec === 0) {
            //success
            let group = response.dt.group;
            let email = response.dt.email;
            let firstname = response.dt.firstname;
            let lastname = response.dt.lastname;
            let token = response.dt.token;
            let payload = {
                isAuthenticated: true,
                token,
                account: {group, email, firstname,lastname}
            }

            localStorage.setItem('jwt', token)

            dispatch({
                type: FETCH_USER_SUCCESS,
                data: {payload}
            });
        }

else
    {
        //error
        if (response && +response.ec !== 0) {
            //error
            toast.error(response.em)
        }
        dispatch({
            type: FETCH_USER_ERROR
        });

    }

}
}
export const handleLogoutRedux = () => {
    return (dispatch, getState) => {
        dispatch({
            type: USER_LOGOUT
        })
    }
}

export const handleRefresh = () => {
    return (dispatch, getState) => {
        dispatch({
            type: USER_REFRESH
        })
    }
}
