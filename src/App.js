import './App.scss';
import {Container} from "react-bootstrap";
import AppRoutes from "./components/routers/AppRoutes";
import {ToastContainer} from 'react-toastify'
import {useSelector} from "react-redux";
import React, {useEffect, useState} from "react";
import Scrollbars from "react-custom-scrollbars-2";
import {BrowserRouter as Router} from "react-router-dom";
import {Triangle} from "react-loader-spinner";
import NavHeader from "./components/Navigation/NavHeader";

const App = () => {

    const account = useSelector(state => state.user.dataRedux.account);
    const isLoading = useSelector(state => state.user.isLoading);

    const [scrollHeight, setScrollHeight] = useState(0);

    useEffect(() => {
        let windowHeight = window.innerHeight;
        setScrollHeight(windowHeight);
    }, [account])


    return (
        <Scrollbars autoHide style={{height: scrollHeight}}>
            <Router>
                {account && isLoading ?
                    <div className='loading-container'>

                        <Triangle
                            height="100"
                            width="100"
                            color="#0866FF"
                            ariaLabel="triangle-loading"
                            visible={true}
                        />
                        <div>Loading data...</div>
                    </div>

                    :
                    <>
                        <div className='app-header'>
                            <NavHeader/>
                        </div>
                        <div className='app-container'>
                            <AppRoutes/>
                        </div>
                    </>
                }
            </Router>


            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
        </Scrollbars>

    );
}

export default App;
