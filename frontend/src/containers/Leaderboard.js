import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Leaderboard.css';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer ,toast } from 'react-toastify';

import Footer from './footer/footer';

function Leaderboard() {
    const [scoreList, setScoreList] = useState([]);
    const [selected, setSelected] = useState('total');
    const [questions, setQuestions] = useState(['total']);
    const [users, setUsers] = useState([]);
    const currentUser = localStorage.getItem('user');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        let userList = [];
        let list = [];
        async function fetch() {
            try {
                let competitionId = JSON.parse(localStorage.getItem('currentCompetition'));
                let start = JSON.parse(localStorage.getItem('start'));
                try {
                    const ques = JSON.parse(localStorage.getItem('questions'));
                    if(ques) {
                        ques.forEach(e => {
                            setQuestions(prev => [...prev, e.questionId]);
                        })
                    }
                } catch(err) {
                    toast.error("No questiosn available", {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        });
                }
                const { data } = await axios.get('http://localhost:5000/get-scores?competitionId=' + competitionId)
                data.scores.forEach(element => {
                    const id = element.userId;
                    if(userList.includes(id)) {
                        let total = list[id].total;
                        total.score = total.score + element.score;
                        list[id][element.questionId] = {
                            score: element.score,
                            time: 0
                        };
                        list[id][element.questionId].time = element.time - start;
                        total.time = total.time + list[id][element.questionId].time;
                        list[id].total = total;
                    } else {
                        userList.push(id);
                        list[id] = {};
                        questions.forEach(e => {
                            list[id][e] = {
                                score: 0,
                                time: 0
                            };
                        });     
                        list[id].total.score = element.score;
                        list[id][element.questionId] = {
                            score: element.score,
                            time: 0
                        };
                        list[id][element.questionId].time = element.time - start;
                        list[id].total.time = list[id][element.questionId].time;
                    }
                });
                setUsers(userList);
                setScoreList(list); 
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
                alert(err);
            }
            sort(userList, list, 'total');
        }
        setLoading(true);
        fetch();
    }, []);

    const sort = (data, list, value) => {
        setLoading(true);
        let flag = false;
        while(!flag) {
            flag = true;
            for(var i = 0; i < data.length-1 ; i++) {
                let left = {
                    score: 0,
                    time: 0
                };
                let right = {
                    score: 0,
                    time: 0
                };
                if(list[data[i]][value]) {
                    left = list[data[i]][value];
                }
                if(list[data[i+1]][value]) {
                    right = list[data[i+1]][value];
                }
                if(left.score < right.score ) {
                    let temp = data[i];
                    data[i] = data[i+1];
                    data[i+1] = temp;
                    flag = false;
                }
                if(left.score === right.score && left.time > right.time) {
                    let temp = data[i];
                    data[i] = data[i+1];
                    data[i+1] = temp;
                    flag = false;
                }
            }
        }
        setUsers(data);
        setLoading(false);
    }

    const backHandler = () => {
        navigate('/questions');
    }

    const millisToMinutesAndSeconds = (millis) => {
        var minutes = Math.floor(millis / 60000);
        var hr = Math.floor(minutes / 60);
        minutes = minutes - hr*60;
        var seconds = ((millis % 60000) / 1000).toFixed(0);
        return hr + ":" + minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
    };

    return(
        <>
        <div className='Home-leader'>
            <button className='button-10' onClick={backHandler}>Back</button>
            <div className='lander'>
                <h1>LEADERBOARD</h1>
            </div>
            {!loading && (<div>
                {selected === 'total' ? currentUser !== 'admin' && (
                    <div className='alignm'>
                        <text><h2>Overall results</h2></text>
                        <text><h3>Score: {scoreList[currentUser] && scoreList[currentUser].total ? scoreList[currentUser].total.score : 'NA'}</h3></text>
                        <text><h3>Time: {scoreList[currentUser] && scoreList[currentUser].total ? millisToMinutesAndSeconds(scoreList[currentUser].total.time) : 'NA'}</h3></text>
                    </div>) : currentUser !== 'admin' && (
                    <div className='alignm'>
                        <text><h2>Question: {selected}</h2></text>
                        <text><h3>Score: {scoreList[currentUser] && scoreList[currentUser][selected] ? scoreList[currentUser][selected].score : 'Not Attempted'}</h3></text>
                        <text><h3>Time: {scoreList[currentUser] && scoreList[currentUser][selected] ? millisToMinutesAndSeconds(scoreList[currentUser][selected].time) : 'Not Attempted'}</h3></text>
                    </div>
                )}
                <div className='buttons'>
                    {questions.map(e => (
                        <div className='button1' key={e}>
                            <button  className='desbutt1' onClick={() => {
                                setSelected(e);
                                sort(users, scoreList, e);
                            }}>
                                {e.toUpperCase()}
                            </button>
                        </div>))}
                </div>
                <div>
                    <table>
                        <tr>
                            <th>Rank</th>
                            <th>Roll</th>
                            <th>Score</th>
                            <th>Time</th>
                        </tr>
                        {users.map((e,index) => {
                            return ( scoreList[e][selected] && 
                                (<tr key={e}>
                                    <td>{index+1}</td>
                                    <td>{e}</td>
                                    {scoreList[e][selected].score && (<td>{scoreList[e][selected].score}</td>)}
                                    {scoreList[e][selected].time && (<td>{millisToMinutesAndSeconds(scoreList[e][selected].time)}</td>)}
                                </tr>)
                            )
                        })}
                    </table>
                </div>
            </div>)}
            <ToastContainer/>
        </div>
        <Footer/>
        </>
    );
}

export default Leaderboard;