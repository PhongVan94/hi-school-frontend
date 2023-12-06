import React, {useEffect, useState} from "react";
import "./Users.scss"
import {fetchAllUser, deleteUser} from "../services/userServices";
import ReactPaginate from "react-paginate";
import {toast} from "react-toastify";
import ModalDelete from "./ModalDelete";
import ModalUser from "./ModalUser";
import _, {debounce} from "lodash";
import Papa from 'papaparse';
import {CSVLink} from "react-csv";

const Users = (props) => {
    const [listUsers, setListUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [currentLimit, setCurrentLimit] = useState(5);
    const [totalPages, setTotalPage] = useState(0);
    const [isShowModalDelete, setIsShowModalDelete] = useState(false);
    //modal delete
    const [dataModal, setDataModel] = useState({});
    const [isShowModalUser, setIsShowModalUser] = useState(false);
    //modal update/create
    const [actionModalUser, setActionModalUser] = useState("CREATE");
    const [dataModalUser, setDataModalUser] = useState({});

    const [sortBy, setSortBy] = useState("asc");
    const [sortField, setSortField] = useState("id");

    const [dataExport, setDataExport] = useState([]);


    useEffect(async () => {
        await fetchUsers();
    }, [currentPage])

    const fetchUsers = async () => {
        let response = await fetchAllUser(currentPage, currentLimit);
        if (response && response.dt && response.ec === 0) {
            setTotalPage(response.dt.totalPages)
            setListUsers(response.dt.users);
        }
    }
    const handlePageClick = async (event) => {
        setCurrentPage(+event.selected);
    };

    const handleDeleteUser = async (user) => {
        setDataModel(user);
        setIsShowModalDelete(true);

    }

    const handleClose = () => {
        setIsShowModalDelete(false);
        setDataModel({});
    }

    const onHideModalUser = async () => {
        setIsShowModalUser(false);
        setDataModalUser({});
        await fetchUsers();
    }


    const confirmDeleteUser = async () => {
        let response = await deleteUser(dataModal);
        if (response && response.ec === 0) {
            toast.success(response.em);
            await fetchUsers();
            setIsShowModalDelete(false);
        } else {
            toast.error(response.em)
        }
    }

    const handleEditUser = (user) => {
        setActionModalUser("UPDATE");
        setDataModalUser(user);
        setIsShowModalUser(true);
    }

    const handleRefresh = async () => {
        await fetchUsers();
    }

    const handleSort = (sortBy, sortField) => {
        setSortBy(sortBy);
        setSortField(sortField);

        let cloneListUsers = _.cloneDeep(listUsers);
        cloneListUsers = _.orderBy(cloneListUsers, [sortField], [sortBy]);
        setListUsers(cloneListUsers);

    }

    const handleSearch = debounce((event) => {
        let term = event.target.value;
        if (term) {
            let cloneListUsers = _.cloneDeep(listUsers);
            cloneListUsers = cloneListUsers.filter(item => item.email.includes(term))
            setListUsers(cloneListUsers);
        } else {
            fetchUsers();
        }
    }, 300)

    const getUsersExport = (event, done) => {
        let result = [];
        if (listUsers && listUsers.length > 0) {
            result.push(["id", "email", "first_name", "last_name", "group"]);

            listUsers.map((item, index) => {
                let arr = [];
                arr[0] = item.id;
                arr[1] = item.email;
                arr[2] = item.firstname;
                arr[3] = item.lastname;
                arr[4] = item.group.name;
                result.push(arr)
            })

            setDataExport(result);
            done();
        }
    }

    const handleImportCSV = (event) => {
        if (event.target && event.target.files && event.target.files[0]) {
            let file = event.target.files[0];

            if (file.type !== "text/csv") {
                toast.error("Only accept csv file...");
                return;
            }

            // Parse local CSV file
            Papa.parse(file, {
                // header: true,
                complete: function (results) {
                    let rawCSV = results.data;

                    console.log(rawCSV)

                    if (rawCSV.length > 0) {
                        if (rawCSV[0] && rawCSV[0].length === 5) {
                            if (rawCSV[0][0] !== "id"
                                || rawCSV[0][1] !== "email"
                                || rawCSV[0][2] !== "first_name"
                                || rawCSV[0][3] !== "last_name"
                                || rawCSV[0][4] !== "group"

                            ) {
                                toast.error("Wrong format Header CSV file!")
                            } else {
                                let result = [];

                                rawCSV.map((item, index) => {
                                    if (index > 0 && item.length === 5) {
                                        let obj = {};
                                        obj.id =item[0]
                                        obj.email = item[1];
                                        obj.firstname = item[2];
                                        obj.lastname = item[3];
                                        obj.group = item[4];
                                        result.push(obj);
                                    }
                                })
                                setListUsers(result);

                            }
                        } else {
                            toast.error("Wrong format CSV file!")
                        }

                    } else {
                        toast.error("Not found data on CSV file!")
                    }
                }
            });
        }


    }


    return (
        <>
            <div className="container">

                <div className='col-12 col-sm-4 my-3'>
                    <input className='form-control' placeholder='Search user by email....'
                        // value={keyword}
                           onChange={(event) => handleSearch(event)}
                    />
                </div>

                <div className="manage-users-container">
                    <div className="user-header row">
                        <div className="title mt-3"><h3>Manage Users</h3></div>
                        <div className="actions my-3">
                            <div className="header-left col-6">
                                <button
                                    className="btn btn-success refresh"
                                    onClick={() => handleRefresh()}
                                >

                                    <i className="fa fa-refresh"></i>Refresh
                                </button>
                                <button className="btn btn-primary"
                                        onClick={() => {
                                            setIsShowModalUser(true);
                                            setActionModalUser("CREATE")
                                        }}
                                >
                                    <i className="fa fa-plus-circle"></i>
                                    Add new user
                                </button>
                            </div>

                            <div className="header-right col-6 ">
                                    <label htmlFor='test' className='btn btn-danger btn_left'>
                                        <i className='fa-solid fa-file-import'></i> Import
                                    </label>
                                    <input id='test' type='file' hidden
                                           onChange={(event) => handleImportCSV(event)}

                                    />

                                  <CSVLink
                                      filename={"users.csv"}
                                      className="btn btn-warning btn_right"
                                      target="_blank"
                                      data={dataExport}
                                      asyncOnClick={true}
                                      onClick={getUsersExport}
                                  >
                                      <i className='fa-solid fa-file-arrow-down'></i> Export</CSVLink>

                            </div>


                        </div>
                    </div>
                    <div className="user-body">
                        <table className="table table-bordered table-hover  table-striped">
                            <thead>
                            <tr>
                                <th scope="col">No</th>
                                <th>
                                    <div className='sort-header'>
                                        <span>ID</span>
                                        <span>
                                    <i
                                        className="fa-solid fa-arrow-down-long"
                                        onClick={() => handleSort("desc", "id")}
                                    ></i>
                                    <i
                                        className="fa-solid fa-arrow-up-long"
                                        onClick={() => handleSort("asc", "id")}
                                    ></i>

                                </span>
                                    </div>
                                </th>
                                <th scope="col">Email</th>

                                <th>
                                    <div className='sort-header'>
                                <span>
                                    First Name
                                </span>
                                        <span>
                                    <i
                                        className="fa-solid fa-arrow-down-long"
                                        onClick={() => handleSort("desc", "firstname")}
                                    ></i>
                                    <i
                                        className="fa-solid fa-arrow-up-long"
                                        onClick={() => handleSort("asc", "firstname")}
                                    ></i>
                                </span>
                                    </div>

                                </th>

                                <th scope="col">Lastname</th>
                                <th scope="col">Group</th>
                                <th scope="col">Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {listUsers && listUsers.length > 0 ?
                                <>
                                    {listUsers.map((item, index) => {
                                        return (
                                            <tr key={`row-${index}`}>
                                                <td>{currentPage * currentLimit + index + 1}</td>
                                                <td>{item.id}</td>
                                                <td>{item.email}</td>
                                                <td>{item.firstname}</td>
                                                <td>{item.lastname}</td>
                                                <td>{item.group ? item.group.name : ''}</td>
                                                <td>
                                                        <span
                                                            title="Edit"
                                                            className="edit"
                                                            onClick={() => {
                                                                handleEditUser(item)
                                                            }}
                                                        >
                                                            <i className="fa fa-pencil"></i>
                                                        </span>
                                                    <span
                                                        title="Delete"
                                                        className="delete"
                                                        onClick={() => {
                                                            handleDeleteUser(item)
                                                        }}

                                                    ><i className="fa fa-trash-can"></i></span>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </>
                                :
                                <>
                                    <tr>
                                        <td>Not found User</td>
                                    </tr>
                                </>}
                            </tbody>
                        </table>

                    </div>
                    {totalPages > 0 &&
                        <div className="user-footer">
                            <ReactPaginate
                                nextLabel="next >"
                                onPageChange={handlePageClick}
                                pageRangeDisplayed={3}
                                marginPagesDisplayed={2}
                                pageCount={totalPages}
                                previousLabel="< previous"
                                pageClassName="page-item"
                                pageLinkClassName="page-link"
                                previousClassName="page-item"
                                previousLinkClassName="page-link"
                                nextClassName="page-item"
                                nextLinkClassName="page-link"
                                breakLabel="..."
                                breakClassName="page-item"
                                breakLinkClassName="page-link"
                                containerClassName="pagination"
                                activeClassName="active"
                                renderOnZeroPageCount={null}
                            />
                        </div>
                    }
                </div>
            </div>
            <ModalDelete
                show={isShowModalDelete}
                handleClose={handleClose}
                confirmDeleteUser={confirmDeleteUser}
                dataModal={dataModal}
            />
            <ModalUser
                show={isShowModalUser}
                onHide={onHideModalUser}
                action={actionModalUser}
                dataModalUser={dataModalUser}

            />

        </>
    )
}

export default Users;