import {useEffect, useState, useContext} from 'react';
import './Login.scss';
import {useHistory, Link} from 'react-router-dom';
import {toast} from 'react-toastify';
import {loginUser} from "../services/userServices"
import {handleLoginRedux, handleRefresh} from "../redux/actions/userAction";
import {useDispatch, useSelector} from "react-redux";

const Login = (props) => {
    const isLoading = useSelector(state => state.user.isLoading);
    const account = useSelector(state => state.user.dataRedux.account);
    const token = useSelector(state => state.user.dataRedux.token);
    const isAuthenticated = useSelector(state => state.user.dataRedux.isAuthenticated);

    const dispatch = useDispatch();

    let history = useHistory();

    const [valueLogin, setValueLogin] = useState("");
    const [password, setPassword] = useState("");

    const defaultObjValidInput = {
        isVaLidValueLogin: true,
        isVaLidPassword: true
    }

    const [objVaLidInput, setObjValidInput] = useState(defaultObjValidInput);

    const handleCreateNewAccount = () => {
        history.push("/register");
    }
    const handleLogin = async () => {
        setObjValidInput(defaultObjValidInput);

        if (!valueLogin) {
            toast.error("Please enter your email or phone number!");
            setObjValidInput({...defaultObjValidInput, isVaLidValueLogin: false})
            return;
        }
        if (!password) {
            toast.error("Please enter your password!")
            setObjValidInput({...defaultObjValidInput, isVaLidPassword: false})
            return;
        }
        await dispatch(handleLoginRedux(valueLogin, password));

        window.location.reload();

    }
    const handlePressEnter = (event) => {
        if (event.charCode === 13 && event.code === 'Enter') {
            handleLogin();
        }
    }

    useEffect(() => {
        if (account && token && isAuthenticated) {
            history.push("/");
        }
    }, [account])

    return (
        <div className="login-container">
            <div className="container">
                <div className="row px-3 px-sm-0">
                    <div className="content-left col-12 d-none col-sm-7 d-sm-block">
                        <div className='brand'>
                            <Link to="/"> <span title='Return to HomePage'>Hi-school</span></Link></div>
                        <div className='detail'>Learn world</div>
                    </div>
                    <div className="content-right col-12 col-sm-5 d-flex flex-column gap-3 py-3">
                        <div className='brand d-sm-none'> Hi-school</div>
                        <input
                            type='text'
                            className={objVaLidInput.isVaLidValueLogin ? 'form-control' : 'is-invalid form-control'}
                            placeholder='Email address or phone number'
                            value={valueLogin}
                            onChange={((event) => {
                                setValueLogin(event.target.value)
                            })}
                        ></input>
                        <input
                            type='password'
                            className={objVaLidInput.isVaLidPassword ? 'form-control' : 'is-invalid form-control'}
                            placeholder='Password'
                            value={password}
                            onChange={(event) => {
                                setPassword(event.target.value)
                            }}
                            onKeyPress={(event) => {
                                handlePressEnter(event)
                            }}
                        ></input>
                        <button className='btn btn-primary'
                                onClick={() => handleLogin()}
                        >Login
                        </button>

                        <span className='text-center'>
                            <a className='forgot-password'
                               href='#'>Forgot your password?</a></span>
                        <hr/>
                        <div className='text-center'>
                            <button className='btn btn-success' onClick={() => handleCreateNewAccount()}>
                                Create New Account
                            </button>
                            <div className='mt-3 return'>
                                <Link to="/">
                                    <i className='fa fa-arrow-circle-left'></i>
                                    <span title='Return to HomePage'>Return to HomePage</span>

                                </Link>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}
export default Login;