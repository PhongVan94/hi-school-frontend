import axios from '../setups/customize-axios';

const createRoles = (roles) => {
    return axios.post('/api/v1/role/create', [...roles])
}
const fetchAllRole = () => {
    return axios.get('/api/v1/role/read');
}

const deleteRole = (user) => {
    return axios.delete('/api/v1/role/delete', { data: { id: user.id } });
}
const fetchRoleByGroup = (groupId) => {
    return axios.get(`/api/v1/role/by-group/${groupId}`);
}

const assignRolesToGroup = (data) => {
    return axios.post('/api/v1/role/assign-to-group', { data });
}

export { createRoles, fetchAllRole, deleteRole, fetchRoleByGroup, assignRolesToGroup }