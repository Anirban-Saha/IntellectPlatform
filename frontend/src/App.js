import React, { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

import Home from './containers/Home';
import Compile from './containers/Compile';
import LoginPage from './containers/LoginPage';
import Competitions from './containers/Competitions';
import Questions from './containers/Questions';
import Leaderboard from './containers/Leaderboard';
import Admin from './containers/Admin';
import Users from './containers/Users';
import AddCompetition from './containers/AddCompetition';
import EditCompetition from './containers/EditCompetition';

function App() {
    const [isAuthenticated, userHasAuthenticated] = useState(false);
    const [access, setAccess] = useState('');
    const [name, setName] = useState('');

    useEffect(async() => {
        setInterval(() => {
            const loggedInUser = localStorage.getItem("user");
            const acc = localStorage.getItem('access');
            setAccess(acc);
            if (loggedInUser) {
                userHasAuthenticated(true);
                setName(localStorage.getItem('name'));
            }
        }, 1000);   
    }, [])

    async function logoutHandler() {
        localStorage.clear();
        userHasAuthenticated(false);
    }

    const nav1 = (
        <>
            <div className='header'>
                <Link className='navbut' to='/'>Home</Link>
                <Link className='navbut' to='/competitions'>Competitions</Link>
                <Link className='navbut right' to='/login'>
                    <span onClick={logoutHandler}>Logout</span>
                </Link>
                <text style={{color: 'white', fontSize: 20}}>Loggen in as {name}</text>
            </div>
        </>
    );

    const nav2 = (
        <>
            <div className='header'>
                <Link className='navbut' to='/'>Home</Link>
                <Link className='navbut' to='/login'>Login</Link>
            </div>
        </>
    );

    const admin = (
        <>
            <div className='header'>
                <Link className='navbut' to='/'>Home</Link>
                <Link className='navbut' to='/admin'>Admin</Link>
                <Link className='navbut right' to='/login'>
                    <span onClick={logoutHandler}>Logout</span>
                </Link>
                <text style={{color: 'white', fontSize: 20}}>Welcome, {name}</text>
            </div>
        </>
    )

    return (
        <Router>
            <div>
                {isAuthenticated ? (access === 'admin' ? admin : nav1) : nav2}
            </div>
            <Routes>
                <Route path='/' element={<Home/>}/>
                <Route path='/compile' element={<Compile/>}/>
                <Route path='/competitions' element={<Competitions/>}/>
                <Route path='/login' element={<LoginPage/>}/>
                <Route path='/questions' element={<Questions/>}/>
                <Route path='/leaderboard' element={<Leaderboard/>}/>
                <Route path='/admin' element={<Admin/>}/>
                <Route path='/users' element={<Users/>}/>
                <Route path='/add' element={<AddCompetition/>}/>
                <Route path='/edit' element={<EditCompetition/>}/>
            </Routes>
        </Router>
    );
}

export default App;