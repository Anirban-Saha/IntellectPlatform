import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import Popup from './Popup';
import { useNavigate } from 'react-router-dom';
import './AddCompetition.css';
import Footer from './footer/footer';

export default function AddCompetition() {
    const navigate = useNavigate();
    const [compList, setCompList] = useState([]);
    const [questionList, setQuestionList] = useState([]);
    const [competitionId, setCompetitionId] = useState('');
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
        async function fetch() {
            try {
                const { data } = await axios.get('http://localhost:5000/get-id-list');
                if(data.compList) {
                    setCompList(data.compList);
                }
                if(data.questionList) {
                    setQuestionList(data.questionList);
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
        fetch();
    }, [])

    const addCompetition = async() => {
        if(questions.length > 0){    
            if(competitionId !== '' && !compList.includes(competitionId)) {
                try {
                    const payload = {
                        competitionId: competitionId,
                        start: new Date(start).toISOString(),
                        end: new Date(end).toISOString(),
                        questions: questions
                    }
                    const { data } = await axios.post("http://localhost:5000/add-competition", payload);
                    toast.success('Competition added successfully', {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                    setTimeout(() => navigate('/competitions'), 3000)
                } catch(err) {
                    toast.error('Couldn\'t add competition', {
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
        } else {
            toast.error('Atleast 1 question is required', {
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
        if(questionList.includes(questionId)) {
            flag = false;
            toast.error('Please change id of question', {
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

    return (
        <>
        <div className='Home-add'>
            <div className='lander'>
                <h1 className='comph1'>Add Competition</h1>
            </div>
            <button className='button-10' onClick={() => navigate('/competitions')}>Back</button>
            <div className='admindiv'>
                <div>
                    <text>Competition Id: </text>
                    <input type='text' value={competitionId} onChange={e => setCompetitionId(e.target.value)}/>
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
                                <text>Question Id: </text>
                                <input type='text' value={questionId} onChange={e => setQuestionId(e.target.value)}/>
                            </div>
                            <div>
                                <text>Question Description: </text>
                                <textarea className='ta' type='text' value={description} onChange={e => setDescription(e.target.value)}/>
                            </div>
                            <div>
                                <text>Example Inputs: </text>
                                <textarea className='ta' type='text' value={testinputs} onChange={e => setTestInputs(e.target.value)}/>
                            </div>
                            <div>
                                <text>Example Outputs: </text>
                                <textarea className='ta' type='text' value={testoutputs} onChange={e => setTestOutputs(e.target.value)}/>
                            </div>
                            <div>
                                <text>Test case Inputs: </text>
                                <textarea className='ta ta1' type='text' value={inputs} onChange={e => setInputs(e.target.value)}/>
                            </div>
                            <div>
                                <text>Test case Outputs: </text>
                                <textarea className='ta ta1' type='text' value={outputs} onChange={e => setOutputs(e.target.value)}/>
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
                                       <text>Please give a unique and relevant ID for each competition.</text>
                                   </li>
                                   <li>
                                       <text>You can add n many questions.</text>
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
            <button className='confirmb' onClick={addCompetition}>Confirm</button>
            <button className='button-10' onClick={() => setShowInfo(true)}>info</button>
            <ToastContainer/>
        </div>
        <Footer/>
        </>
    );
}