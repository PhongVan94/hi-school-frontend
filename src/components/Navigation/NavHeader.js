import React, { useEffect, useState } from 'react';
import ".//Nav.scss";
import { NavLink, useHistory } from 'react-router-dom';
import { useLocation } from 'react-router-dom/cjs/react-router-dom.min';

import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import logo from '../../logo.svg'
import { logoutUser } from '../services/userServices';
import { toast } from 'react-toastify';
import {useDispatch, useSelector} from "react-redux";
import {handleLogoutRedux} from "../redux/actions/userAction";



const NavHeader = (props) => {

    const dispatch = useDispatch();

    const isLoading = useSelector(state => state.user.isLoading);
    const account = useSelector(state => state.user.dataRedux.account);
    const token = useSelector(state => state.user.dataRedux.token);
    const isAuthenticated =  useSelector(state => state.user.dataRedux.isAuthenticated);

    const location = useLocation();
    const history = useHistory();

    const handleLogout = async () => {
        let data = await logoutUser(); // clear cookies
        localStorage.removeItem('jwt'); // clear local storage
        dispatch(handleLogoutRedux());

        if (data && +data.ec === 0) {
            toast.success('Logout success')
            history.push('/login')
        } else {
            toast.error(data.em)
        }
    }
    if (account && isAuthenticated === true || location.pathname === '/' || location.pathname === '/about') {
        return (
            <>
                <div className='nav-header'>
                    <Navbar expand="lg" bg="header">
                        <Container>
                            <Navbar.Brand >
                                <img
                                    alt="React Logo"
                                    src={logo}
                                    width="50"
                                    height="30"
                                    className="d-inline-block align-top"
                                />
                                <span className='brand-name'>Hi-school</span>
                            </Navbar.Brand>
                            <Navbar.Toggle aria-controls="basic-navbar-nav" />
                            <Navbar.Collapse id="basic-navbar-nav">
                                <Nav className="me-auto">

                                    <NavLink to="/" exact className='nav-link'>Home</NavLink>
                                    <NavLink to="/users" className='nav-link'>Users</NavLink>
                                    <NavLink to="/groups" className='nav-link'>Groups</NavLink>
                                    <NavLink to="/roles" className='nav-link'>Roles</NavLink>
                                    <NavLink to="/group-role" className='nav-link'>Group-Role</NavLink>
                                    <NavLink to="/projects" className='nav-link'>Projects</NavLink>
                                    <NavLink to="/about" className='nav-link'>About</NavLink>

                                </Nav>
                                <Nav>
                                    {account && isAuthenticated === true ?
                                        <>
                                            <Nav.Item className='nav-link'>
                                                Welcome {account.firstname} !
                                            </Nav.Item>
                                            <NavDropdown title="Settings" id="basic-nav-dropdown">
                                                <NavDropdown.Item >Change Password</NavDropdown.Item>

                                                <NavDropdown.Divider />
                                                <NavDropdown.Item >
                                                    <span onClick={() => handleLogout()}>
                                                        Logout

                                                    </span>
                                                </NavDropdown.Item>
                                            </NavDropdown>
                                        </>
                                        :
                                        <NavLink to="/login" className='nav-link'>Login</NavLink>
                                    }

                                </Nav>
                            </Navbar.Collapse>
                        </Container>
                    </Navbar>
                </div >

            </>
        )
    } else {
        return <></>
    }


}

export default NavHeader;