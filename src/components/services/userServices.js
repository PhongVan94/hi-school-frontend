import axios from '../setups/customize-axios';

const registerNewUser = (email, phone, firstname, lastname, password) => {
    return axios.post('/api/v1/auth/register', {
        email, phone, firstname, lastname, password
    })
}
// test ok
const loginUser = (valueLogin, password) => {
    return axios.post('/api/v1/auth/login', {
        valueLogin, password
    })
}
const fetchAllUser = (page, limit) => {
    return axios.get(`/api/v1/user/read?page=${page}&limit=${limit}`);//template String
}
const deleteUser = (user) => {
    return axios.post(`/api/v1/user/delete/${user.id}`);
}

const createNewUser = (userData) => {
    return axios.post("/api/v1/user/create", {...userData})
}

const updateCurrentUser = (userData) => {
    return axios.put("/api/v1/user/update", {...userData})
}

const getUserAccount = () => {
    return axios.get(`/api/v1/account`);
}

const logoutUser = () => {
    return axios.post(`/api/v1/auth/logout`);
}

export {
    fetchAllUser, deleteUser, createNewUser, updateCurrentUser, getUserAccount,
    registerNewUser, loginUser, logoutUser
}

