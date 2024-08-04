import React, { useState, useEffect} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer ,toast } from 'react-toastify';
import './Questions.css';

import Footer from './footer/footer';

function Questions() {
    const [questionList, setQuestions] = useState([]);
    const [visible, setVisible] = useState(false);
    const [end, setEnd] = useState(JSON.parse(localStorage.getItem('end')));
    const [curTime, setCurTime] = useState(new Date().getTime());
    const [selected, setSelected] = useState('');
    const navigate = useNavigate();

    const fetchEnd = () => {
        const d = new Date();
        setEnd(JSON.parse(localStorage.getItem('end')));
        setCurTime(d.getTime());
        if(curTime < end) {
            console.log(d.getTime())
            setTimeout(() => fetchEnd(), 1000);
        }
    }

    useEffect(() => {
        async function fetch() {
            try {
                const competitionId = JSON.parse(localStorage.getItem('currentCompetition'));
                const { data } = await axios.get('http://localhost:5000/get-questions?competitionId=' + competitionId);
                if(data.questions) {
                    setVisible(true);
                    setQuestions(data.questions);   
                    setSelected(data.questions[0]);
                }
                localStorage.setItem('questions', JSON.stringify(data.questions));
            } catch(err) {
                toast.error('No questions available', {
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
        fetch();
        fetchEnd();
    }, [])

    const questions = (e) => {
        localStorage.setItem('currentQuestion', JSON.stringify(e));
        navigate('/compile');
    }

    const backHandler = () => {
        localStorage.removeItem('currentCompetition');
        localStorage.removeItem('questions');
        localStorage.removeItem('start');
        navigate('/competitions');
    }


    return (
        <>
        <div className='Home-ques'>
            <button className='button-10' onClick={backHandler}>Back</button> 
            <div className='lander'>
                <h1>QUESTIONS</h1>    
            </div>
            <button className='button-5' id='butt1' onClick={() => navigate('/leaderboard')}>Leaderboard</button>     
                {visible ? (
                    <div className='quesblock'>
                        <div className='quesblock-child-button'> {/*buttons*/}
                            {questionList.map(e => (<button className='buttques button-3' onClick={() => setSelected(e)}>{e.questionId}</button>))}
                        </div>
                        <div className='quesblock-child'>{/*questions*/}
                            <div className='question-code'>{/*question code*/}        
                                <text className='code-text'>{selected.questionId}</text>
                            </div>
                            <div className='question-desc'>{/*question description*/}        
                                <text>{selected.description}</text>
                            </div>
                            <text>Example:</text>   
                            <div className='question-ex'>                         
                                <div className='question-exinout'>{/*example inputs*/}
                                    <text className='inout-text'>{"Inputs:\n" + selected.testinputs}</text>
                                </div>        
                                <div className='question-exinout'>{/*example outputs*/}    
                                    <text className='inout-text'>{"Outputs:\n" + selected.testoutputs}</text>
                                </div>
                            </div>
                            <div className='solve'>    
                                {selected && (curTime < end) ? 
                                    (<button className='buttques button-3' onClick={() => questions(selected)}>SOLVE {selected.questionId}</button>) 
                                    : (<text>This competition has ended</text>)}
                            </div>
                        </div>
                    </div>) : <div></div>}
            <ToastContainer/>
        </div>
        <Footer/>
        </>
    );
}

export default Questions;