import './LoginPage.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { encrypt } from './encryption';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer ,toast } from 'react-toastify';

import Footer from './footer/footer';

function Login() {
    const [roll, setRoll] = useState('');
    const [password, setPassword] = useState('');
    const [toggle, setToggle] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const loggedInUser = localStorage.getItem("user");
        if (loggedInUser) {
            navigate('/');
        }
    }, []);

    const loginHandler = async() => {
        const payload = {
            roll: encrypt(roll),
            password: encrypt(password)
        };
        try {
            const { data } = await axios.post("http://localhost:5000/login", payload);
            if(data.roll) {
                toast.success('Login success!', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                localStorage.setItem('user', roll);
                localStorage.setItem('access', data.access);
                localStorage.setItem('name', data.name);
                setRoll('');
                setPassword('');
                navigate('/');
            }
            else {
                toast.error(data.err, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            }
        } catch (err) {
            toast.error("Invalid Roll", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
    }

    return (
        <>
        <div className='Home-login'>
            <div className="background">
                <div className="cube"></div>
                <div className="cube"></div>
                <div className="cube"></div>
                <div className="cube"></div>
                <div className="cube"></div>
            </div>
            <div class="box">
                <div><h1 className='loginhead'>LOGIN</h1></div>
                <input type='text' placeholder='Enter your roll number' value={roll} onChange={e => setRoll(e.target.value)}/>
                <input type={toggle ? 'password' : 'text'} placeholder='Enter your password' value={password} onChange={e => setPassword(e.target.value)}/>
                <button className='show' onClick={() => setToggle(!toggle)}>Show password</button>
                <button className='login' onClick={loginHandler}>Login</button>
            </div>
            <ToastContainer />
        </div>
        <Footer/>
        </>
    );
}

export default Login;