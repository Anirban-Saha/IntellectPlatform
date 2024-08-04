import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import Popup from './Popup';
import { useNavigate } from 'react-router-dom';
import { decrypt } from './encryption';
import './EditCompetition.css';

import Footer from './footer/footer';

export default function EditCompetition() {
    const navigate = useNavigate();
    const [_id, setId] = useState('');
    const competitionId = JSON.parse(localStorage.getItem('editComp'));
    const [start, setStart] = useState(new Date());
    const [end, setEnd] = useState(new Date());
    const [questions, setQuestions] = useState([]);
    const [visible, setVisible] = useState(false);
    const [questionId, setQuestionId] = useState('');
    const [description, setDescription] = useState('');
    const [testinputs, setTestInputs] = useState('');
    const [testoutputs, setTestOutputs] = useState('');
    const [inputs, setInputs] = useState('');
    const [outputs, setOutputs] = useState('');
    const [editIndex, setEditIndex] = useState(0);
    const [useMode, setUseMode] = useState('ADD');
    const [showInfo, setShowInfo] = useState(false); 

    useEffect(() => {
        async function fetchComp() {
            try {    
                const { data } = await axios.get('http://localhost:5000/get-competitions');
                if(data) {
                    data.forEach(element => {
                        if(competitionId === decrypt(element.competitionId)) {
                            setId(element._id);
                            setStart(date(element.start));
                            setEnd(date(element.end));
                        }
                    });
                }
            } catch(err) {
                toast.error('Something went wrong', {
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

        async function fetchQues() {
            try {
                const { data } = await axios.get('http://localhost:5000/get-questions-admin?competitionId=' + competitionId);
                if(data.questions) {
                    setQuestions(data.questions);
                }
            } catch(err) {
                toast.error('Something went wrong', {
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
        fetchQues();
        fetchComp();
    }, [])

    const date = (d) => {
        let date = new Date(d);
        let hr = date.getHours();
        if(hr < '10') {
            hr = '0' + hr;
        }
        let min = date.getMinutes();
        if(min < '10') {
            min = '0' + min;
        }
        const yr = date.getFullYear();
        let mon = date.getMonth() + 1;
        if(mon < '10') {
            mon = '0' + mon;
        }
        let day = date.getDate();
        if(day < '10') {
            day = '0' + day;
        }
        return yr + "-" + mon + "-" + day + "T" + hr + ":" + min;
    }

    const editCompetition = async() => {
        if(competitionId !== '') {
            try {
                const payload = {
                    _id: _id,
                    competitionId: competitionId,
                    start: new Date(start).toISOString(),
                    end: new Date(end).toISOString(),
                    questions: questions
                }
                const { data } = await axios.put("http://localhost:5000/update-competition", payload);
                toast.success('Competition updated successfully', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                setTimeout(() => {
                    backHandler();
                }, 1000)
            } catch(err) {
                toast.error('Couldn\'t update competition', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            }
        } else {
            toast.error('Please change comepetition ID', {
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

    const closeInfo = () => {
        setShowInfo(false);
    }

    const check = () => {
        let flag = true;
        if(questionId === '') {
            flag = false;
            toast.error('Question Id cannot be empty', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
        if(description === '') {
            flag = false;
            toast.error('Desctiption cannot be empty', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
        if(testinputs === '') {
            flag = false;
            toast.error('Example cannot be empty', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
        if(testoutputs === '') {
            flag = false;
            toast.error('Example cannot be empty', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
        if(inputs === '') {
            flag = false;
            toast.error('Test case cannot be empty', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }  
        if(outputs === '') {
            flag = false;
            toast.error('Test case cannot be empty', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        } 
        return flag;
    }

    const addQuestion = () => {
        if(check()) {
            setQuestions(prev => [
                ...prev, 
                {
                    questionId: questionId, 
                    description: description, 
                    testinputs: testinputs, 
                    testoutputs: testoutputs, 
                    inputs: inputs, 
                    outputs: outputs
                }
            ]);
            handleClose();    
        }
    }

    const editQuestion = () => {
        if(check()) {
            let temp = questions;
            temp[editIndex].questionId = questionId;
            temp[editIndex].description = description;
            temp[editIndex].testinputs = testinputs;
            temp[editIndex].testoutputs = testoutputs;
            temp[editIndex].inputs = inputs;
            temp[editIndex].outputs = outputs;
            setQuestions(temp);
            handleClose();
        }
    }

    const setSelected = (question, index) => {
        setUseMode('EDIT');
        setQuestionId(question.questionId);
        setDescription(question.description);
        setTestInputs(question.testinputs);
        setTestOutputs(question.testoutputs);
        setInputs(question.inputs);
        setOutputs(question.outputs);
        setEditIndex(index);
        setVisible(true);
    }

    const handleClose = () => {
        setVisible(false);
        setQuestionId('');
        setDescription('');
        setTestInputs('');
        setTestOutputs('');
        setInputs('');
        setOutputs('');
    }

    const deleteQuestion = (i) => {
        let temp = questions.filter(function(value, index, arr) {
            if(index !== i){
                return value;
            }
        });
        setQuestions(temp);
    }

    const backHandler = () => {
        localStorage.removeItem('editComp');
        navigate('/competitions');
    }

    return (
        <>
        <div className='Home-edit'>
            <div className='lander'>
                <h1 className='comph1'>Edit Competition</h1>
            </div>
            <button className='button-10' onClick={backHandler}>Back</button>
            <div className='admindiv'>
                <div>
                    <text><h3>Competition Id: {competitionId}</h3></text>
                </div>
                <div>
                    <text>Start date-time: </text>
                    <input type='datetime-local' value={start} onChange={e => setStart(e.target.value)}/>
                </div>
                <div>
                    <text>End date-time: </text>
                    <input type='datetime-local' value={end} onChange={e => setEnd(e.target.value)}/>
                </div>
                {questions.map((question, index) => {
                    return (
                        <div className='inneredit'>
                            <text>{index + 1}. </text>
                            <text>{question.questionId}</text>
                            <button className='button-11' onClick={() => deleteQuestion(index)}>delete</button>
                            <button className='button-11' onClick={() => setSelected(question, index)}>edit</button>
                        </div>
                    );
                })}
                <button className='button-3' onClick={() => {
                    setVisible(true);
                    setUseMode('ADD');
                }}>Add Question</button>
            </div>
            {visible && (
                <Popup
                    content={
                        <div>
                            <div>
                                {useMode === 'EDIT' ? (<text>Question Id: {questionId}</text>) : (
                                <div>
                                    <text>Question Id: </text>
                                    <textarea className='ta2' type='text' value={questionId} onChange={e => setQuestionId(e.target.value)}/>
                                </div>
                                )}
                            </div>
                            <div>
                                <text>Question Description: </text>
                                <textarea className='ta2' type='text' value={description} onChange={e => setDescription(e.target.value)}/>
                            </div>
                            <div>
                                <text>Example Inputs: </text>
                                <textarea className='ta2' type='text' value={testinputs} onChange={e => setTestInputs(e.target.value)}/>
                            </div>
                            <div>
                                <text>Example Outputs: </text>
                                <textarea className='ta2' type='text' value={testoutputs} onChange={e => setTestOutputs(e.target.value)}/>
                            </div>
                            <div>
                                <text>Test case Inputs: </text>
                                <textarea className='ta2 ta1' type='text' value={inputs} onChange={e => setInputs(e.target.value)}/>
                            </div>
                            <div>
                                <text>Test case Outputs: </text>
                                <textarea className='ta2 ta1' type='text' value={outputs} onChange={e => setOutputs(e.target.value)}/>
                            </div>
                            <button className='button-3' onClick={useMode === 'ADD' ? addQuestion : editQuestion}>{useMode}</button>
                        </div>
                    }
                    handleClose={handleClose}/>
            )}
            {showInfo && (
                <Popup
                    content={
                        <div>
                           <div>
                               Info:
                           </div>
                           <div>
                               <ul>
                                   <li>
                                       <text>In edit, you can edit the start and end time of each competition but we highly advise against it as the change only reflects with the students once they refresh</text>
                                   </li>
                                   <li>
                                       <text>You can also add and edit the questions and also modidy all the testacases.</text>
                                   </li>
                                   <li>
                                       <text>For the example inputs, give one line explaining the format of input and outputs followed by one example input and output to that input</text>
                                   </li>
                                   <li>
                                        <text>If your testcase inputs takes multiple inputs in different lines, write them all in the same line seperated by '\n'. </text>
                                        <text>Ex: 3\n1 2 3\n4 5 6\n7 8 9. </text>
                                        <text>To run n test cases, write n such inputs</text>  
                                   </li>
                               </ul>
                           </div>
                        </div>
                    }
                    handleClose={closeInfo}></Popup>
            )}
            <button className='confirmb' onClick={editCompetition}>Confirm</button>
            <button className='button-10' onClick={() => setShowInfo(true)}>Info</button>
            <ToastContainer/>
        </div>
        <Footer/>
        </>
    );
}