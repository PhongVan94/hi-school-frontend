import { useState } from 'react'
import './Group.scss'
import _ from 'lodash'
import { useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'react-toastify';
import { createGroups } from '../services/groupService';
import TableGroup from './TableGroup';
import { useRef } from 'react';



const Group = (props) => {

    const dataChildDefault = {
        name: '', description: '', isValidName: true
    }
    const childRef = useRef();

    const [listChilds, setListChilds] = useState({
        child1: dataChildDefault
    })

    const handleOnChangeInput = (name, value, key) => {
        let _listChilds = _.cloneDeep(listChilds);
        _listChilds[key][name] = value;
        if (value && name === 'name') {
            _listChilds[key]['isValidName'] = true;
        }
        setListChilds(_listChilds)
    }

    const handleAddNewInput = () => {
        let _listChilds = _.cloneDeep(listChilds);
        _listChilds[`child-${uuidv4()}`] = dataChildDefault;
        setListChilds(_listChilds)
    }

    const handleDeleteInput = (key) => {
        let _listChilds = _.cloneDeep(listChilds);
        delete _listChilds[key];
        setListChilds(_listChilds)
    }

    const buildDataToPersist = () => {
        let _listChilds = _.cloneDeep(listChilds);
        let result = [];
        Object.entries(_listChilds).map(([key, child], index) => {
            result.push({
                name: child.name,
                description: child.description
            })
        })
        return result;
    }

    const handleSave = async () => {
        let check = true;
        let invalidObj = Object.entries(listChilds).find(([key, child], index) => {
            return child && !child.name;
        })
        if (!invalidObj) {
            //call api
            let data = buildDataToPersist();
            let response = await createGroups(data);
            if (response && response.ec === 0) {
                toast.success(response.em)
                childRef.current.fetchListGroupsAgain();
            }
        } else {
            //error
            toast.error("Input Name must not be empty...")
            let _listChilds = _.cloneDeep(listChilds);
            const key = invalidObj[0];
            _listChilds[key]['isValidName'] = false;
            setListChilds(_listChilds);
        }

    }

    return (
        <div className='group-container'>
            <div className='container'>
                <div className='adding-groups mt-3'>
                    <div className='group-title'><h4>Add a new group</h4></div>
                    <div className='group-parent'>
                        {
                            Object.entries(listChilds).map(([key, child], index) => {
                                return (
                                    <div className='row group-child' key={`child-${key}`}>
                                        <div className={`col-12 col-sm-5 form-group ${key}`}>
                                            <label>Name:</label>
                                            <input
                                                type='text'
                                                className={child.isValidName ? 'form-control' : 'form-control is-invalid'}
                                                value={child.name}
                                                onChange={(event) => handleOnChangeInput('name', event.target.value, key)}
                                            />
                                        </div>
                                        <div className='col-12 col-sm-5 form-group'>
                                            <label>Description:</label>
                                            <input
                                                type='text'
                                                className='form-control'
                                                value={child.description}
                                                onChange={(event) => handleOnChangeInput('description', event.target.value, key)}
                                            />
                                        </div>
                                        <div className='col-12 col-sm-2 mt-4 actions'>
                                            <i className="fa fa-plus-circle add"
                                                onClick={() => handleAddNewInput()}
                                            ></i>
                                            {index >= 1 && <i className="fa fa-trash-can delete"
                                                onClick={() => handleDeleteInput(key)}
                                            ></i>}
                                        </div>
                                    </div>
                                )
                            })
                        }

                        <div>
                            <button className='btn btn-warning mt-3'
                                onClick={() => handleSave()}
                            >Save</button>
                        </div>

                    </div>
                </div>
                <hr></hr>
                <div className=' table-groups mt-3'>
                    <TableGroup ref={childRef} />
                </div>
            </div>

        </div>
    )
}
export default Group