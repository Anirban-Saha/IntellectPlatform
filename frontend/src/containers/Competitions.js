import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Competitions.css';
import { decrypt } from './encryption';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer ,toast } from 'react-toastify';

import Footer from './footer/footer';

function Competitions() {
    const [compList, setCompList] = useState([]);
    const [visible, setVisible] = useState(false);
    const access = localStorage.getItem('access');
    const curTime = new Date().getTime();
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchData() {
            try {
                const { data } = await axios.get("http://localhost:5000/get-competitions");
                setVisible(true);
                data.forEach(element => {
                    element.competitionId = decrypt(element.competitionId);
                });
                setCompList(data.sort(function(a,b) {
                    return parseInt(b['start']) - parseInt(a['start']);
                }));
            } catch (err) {
                toast.error('No competitions available', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                setVisible(false);
            }
        }
        fetchData();
    }, []);

    const competition = ({e}) => {
        localStorage.setItem('currentCompetition', JSON.stringify(e.competitionId));
        localStorage.setItem('start', JSON.stringify(e.start));
        localStorage.setItem('end', JSON.stringify(e.end));
        navigate('/questions');
    }

    const editComp = ({e}) => {
        localStorage.setItem('editComp', JSON.stringify(e.competitionId));
        navigate('/edit');
    }

    const date = (d) => {
        let date = new Date(d);
        const hr = date.getHours();
        let min = date.getMinutes();
        if(min < '10') {
            min = '0' + min;
        }
        const yr = date.getFullYear();
        const mon = date.getMonth() + 1;
        const day = date.getDate();
        return hr + ':' + min + ' - ' + day + '/' + mon + '/' + yr;
    }

    return (
        <>
        <div className='Home-compi'>
            <div className='lander'>
                <h1 className='comph1'>COMPETITIONS</h1>
            </div>
            <div className='compi-div'>
            {access === 'admin' && (
                <div>
                    <button className='button-32' onClick={() => navigate('/admin')}>Back</button>
                    <button className='button-32' onClick={() => navigate('/add')}>Add</button>
                </div>
            )}
                {visible ? (
                    <div className='avaicomp-comp'>
                        {compList.map(e => (
                            <div className='compindi-comp'>
                                <h3>Competition: {e.competitionId}</h3>
                                <h4>Start: {date(e.start)}</h4>
                                <h4>End: {date(e.end)}</h4>
                                <div className='butt-container'>
                                    {access === 'admin' && (
                                        <button className='buttcomp' onClick={() => editComp({e})}>Edit</button>
                                    )}
                                    {curTime >= e.start && (<button className='buttcomp'  onClick={() => competition({e})}>Enter</button>)}
                                </div>
                            </div>))}
                    </div>) : <></>}
            </div>

            <ToastContainer/>
            
        </div>
        <Footer/>
        </>
    );
}

export default Competitions;