import { useEffect, useState, forwardRef, useImperativeHandle } from "react"
import { fetchGroup, deleteGroup } from "../services/groupService"
import { toast } from "react-toastify";

const TableGroup = forwardRef((props, ref) => {

    const [listGroups, setListGroups] = useState([]);

    useEffect(() => {
        getAllGroups();
    }, [])

    useImperativeHandle(ref, () => ({

        async fetchListGroupsAgain() {
            await getAllGroups();
        }

    }));

    const getAllGroups = async () => {
        let data = await fetchGroup();
        if (data && +data.ec === 0) {
            setListGroups(data.dt)
        }
    }

    const handleDeleteGroup = async (group) => {
        let data = await deleteGroup(group);
        if (data && data.ec === 0) {
            toast.success(data.em);
            await getAllGroups();
        }
    }



    return (
        <>
            <table className="table table-bordered table-hover  table-striped">
                <thead>
                    <tr>
                        <th scope="col">Id</th>
                        <th scope="col">Name</th>
                        <th scope="col">Description</th>
                        <th scope="col">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {listGroups && listGroups.length > 0 ?
                        <>
                            {listGroups.map((item, index) => {
                                return (
                                    <tr key={`row-${index}`}>
                                        <td>{item.id}</td>
                                        <td>{item.name}</td>
                                        <td>{item.description}</td>
                                        <td>
                                            {/* <span
                                                title="Edit"
                                                className="edit"
                                                onClick={() => {
                                                    handleEditUser(item)
                                                }}
                                            >
                                                <i className="fa fa-pencil"></i>
                                            </span> */}
                                            <span
                                                title="Delete"
                                                className="delete"
                                                onClick={() => {
                                                    handleDeleteGroup(item)
                                                }}

                                            ><i className="fa fa-trash-can"></i></span>
                                        </td>
                                    </tr>
                                )
                            })}
                        </>
                        :
                        <>
                            <tr><td colSpan={4}>Not found Group</td></tr>
                        </>}
                </tbody>
            </table>
        </>
    )
})
export default TableGroup;