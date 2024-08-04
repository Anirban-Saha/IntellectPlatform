import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import Select from 'react-select';
import Popup from './Popup';
import { useNavigate } from 'react-router-dom';
import './Users.css';

import Footer from './footer/footer';

const options = [
    {value: 'all', label: 'All'},
    {value: '1st', label: '1st'},
    {value: '2nd', label: '2nd'},
    {value: '3rd', label: '3rd'},
    {value: '4th', label: '4th'},
    {value: 'others', label: 'Others'}
];

export default function Users() {
    const [users, setUsers] = useState({
        'all': [],
        '1st': [],
        '2nd': [],
        '3rd': [],
        '4th': [],
        'others': []
    });
    const [selectedBatch, setSelectedBatch] = useState('all');
    const [loading, setLoading] = useState(true);
    const [visible, setVisible] = useState(false);
    const [roll, setRoll] = useState('');
    const [name, setName] = useState('');
    const [batch, setBatch] = useState('');
    const navigate = useNavigate();
    
    useEffect(() => {
        let temp = {
            'all': [],
            '1st': [],
            '2nd': [],
            '3rd': [],
            '4th': [],
            'others': []
        };
        async function fetch() {
            try {
                const { data } = await axios.get('http://localhost:5000/get-users');
                    const currentYear = new Date().getFullYear();
                    const currentMonth = new Date().getMonth() + 1;
                    data.userList.sort(function(a,b) {
                        return (parseInt(parseInt(a._id) - parseInt(b._id)));
                    })
                    data.userList.forEach(element => {
                        if(element.access !== 'admin') {
                            temp['all'].push(element);
                            let diff = currentYear - parseInt(element.batch.substring(0,4));
                            if(currentMonth >= 8) {
                                diff = diff + 1;
                            }
                            element.year = diff;
                            if( diff === 1 ) {
                                temp['1st'].push(element);
                            } else if( diff === 2 ) {
                                temp['2nd'].push(element);
                            } else if( diff === 3 ) {
                                temp['3rd'].push(element);
                            } else if( diff === 4 ) {
                                temp['4th'].push(element);
                            } else {
                                element.year = 'Pass out'
                                temp['others'].push(element);
                            }
                        }
                    });
                    console.log(temp);
                    setUsers(temp);
                    setLoading(false);
            } catch(err) {
                toast.error("Something went wrong", {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                setLoading(false);
            }
        }
        setLoading(true);
        fetch();
    }, [visible]);

    const handleClose = () => {
        setVisible(false);
        setName('');
        setRoll('');
        setBatch('');
    }

    const addUser = async() => {
        if(roll !== '' && name !== '' && batch !== ''){
            let defaultPass = roll + '@St'; 
            let currentYear = new Date().getFullYear();
            let currentMonth = new Date().getMonth() + 1;
            if(currentMonth < 8) {
                currentYear = currentYear - 1;
            }
            let year1 = (currentYear - batch.value + 1).toString();
            let year2 = (currentYear - batch.value + 5).toString();
            let temp = year1 + '-' + year2;
            let payload = {
                password: defaultPass, 
                roll: roll, 
                name: name, 
                access: 'student', 
                batch: temp
            };
            try {
                const { data } = await axios.post('http://localhost:5000/register', payload);
                if(data.result.acknowledged) {
                    toast.success("User added successfully", {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                    handleClose();
                }
            } catch(err) {
                toast.error(err, {
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
    }

    const removeUser = async(e) => {
        try {
            const { data } = await axios.delete('http://localhost:5000/remove-user', { data: { userId: e._id }}); 
            if(data.result) {
                toast.success("User removed successfully", {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                setVisible(true);
                setVisible(false);
            }
        } catch(err) {
            toast.error(err, {
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
        <div className='Home-user'>
            <div className='lander'>
                <h1 className='comph1'>USERS</h1>
            </div>
            <button className='button-10' onClick={() => navigate('/admin')}>Back</button>
            <Select className='selectlang seti1'
                name='Batch' 
                value={options.find(obj => obj.value === selectedBatch)} 
                options={options} 
                defaultValue={options[0]} 
                onChange={e => setSelectedBatch(e.value)}
                menuPlacement='auto'
                width='100dp'/>
            <button className='button-3 seti' onClick={() => setVisible(true)}>Add</button>
            <div>
                <table>
                    <tr>
                        <th>Roll</th>
                        <th>Name</th>
                        <th>Year</th>
                    </tr>
                {!loading && users[selectedBatch].map((e,index) => {
                    return (
                        <tr key={e._id}>
                            <td>{e._id}</td>
                            <td>{e.name}</td>
                            <td>{e.year}</td>
                            <td><button className='button-11' onClick={() => removeUser(e)}>Delete</button></td>
                        </tr>
                    )
                })}
                </table>
            </div>
            {visible && (
                <Popup 
                    content={
                        <div>
                            <div className='fieldRow'>
                                <text>Roll</text>
                                <input type='text' placeholder='Enter the roll number' value={roll} onChange={e => setRoll(e.target.value)}/>
                            </div>
                            <div className='fieldRow'>
                                <text>Name</text>
                                <input type='text' placeholder='Enter the name' value={name} onChange={e => setName(e.target.value)}/>
                            </div>
                            <div className='fieldRow'>
                                <text>Batch</text>
                                <Select className='batch'
                                    name='Batch' 
                                    value={batch} 
                                    options={[
                                        {value: 1, label: '1st'},
                                        {value: 2, label: '2nd'},
                                        {value: 3, label: '3rd'},
                                        {value: 4, label: '4th'}
                                    ]} 
                                    defaultValue={{value: 1, label: '1st'}} 
                                    onChange={e => {
                                        setBatch(e);
                                    }}
                                    menuPlacement='auto'
                                    width='100dp'/>
                            </div>
                            <button className='button-3' onClick={addUser}>Add</button>
                        </div>
                    }
                    handleClose={handleClose}></Popup>
            )}
            <ToastContainer/>
        </div>
        <Footer/>
        </>
    )
}