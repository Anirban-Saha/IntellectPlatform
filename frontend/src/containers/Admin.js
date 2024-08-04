import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Admin.css';

import Footer from './footer/footer';

export default function Admin() {
    const navigate = useNavigate();

    return (
        <>
        <div className='Home-admin'>
            <div className='lander'>
                <h1 className='comph1'>ADMIN</h1>
            </div>
            <div>
                <div className='avaicomp'>
                    <div className='compindi'>
                        <h3>Competitions</h3>
                        <div>
                            <button className='buttcomp'  onClick={() => navigate('/competitions')}>View</button>
                        </div>
                    </div>
                </div>
                <div className='avaicomp'>
                    <div className='compindi'>
                        <h3>Users</h3>
                        <div>
                            <button className='buttcomp'  onClick={() => navigate('/users')}>View</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
            <Footer/>
        </>
    )
}