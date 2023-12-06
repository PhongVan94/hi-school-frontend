import axios from "../setups/customize-axios";

const fetchGroup = () => {
    return axios.get(`/api/v1/group/read`);
}
const createGroups = (groups) => {
    return axios.post('/api/v1/group/create', [...groups])
}
const deleteGroup = (user) => {
    return axios.delete('/api/v1/group/delete', { data: { id: user.id } });
}

export {
    fetchGroup,createGroups,deleteGroup
}