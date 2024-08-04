import './Compile.css';
import React, { useEffect, useState } from 'react';
import AceEditor from 'react-ace';
import 'brace/mode/java';
import 'brace/mode/python';
import 'brace/mode/c_cpp';
import 'brace/theme/monokai';
import Select from 'react-select';
import axios from 'axios';
import { useNavigate } from 'react-router';
import { decrypt, encrypt } from './encryption';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer ,toast } from 'react-toastify';
import Popup from './Popup';

const options = [
    {value: '1', label: 'C'},
    {value: '2', label: 'C++'},
    {value: '3', label: 'Java'},
    {value: '4', label: 'Python3'}
];

function Compile() {
    const [lang, setLang] = useState('python');
    const [language, setLanguage] = useState('py');
    const [code, setCode] = useState('');
    const [output, setOutput] = useState('');
    const [fileId, setFileId] = useState('test');
    const [userInput, setUserInput] = useState('');
    const userId = JSON.parse(localStorage.getItem('user')).toString();
    const questionId = JSON.parse(localStorage.getItem('currentQuestion')).questionId;
    const competitionId = JSON.parse(localStorage.getItem('currentCompetition'));
    const currentQuestion = JSON.parse(localStorage.getItem('currentQuestion'));
    const [checked, setChecked] = useState(false);
    const [visibility, setVisibility] = useState(true);
    const [score, setScore] = useState(0);
    const [first, setFirst] = useState(true);
    const [defaultLang, setDefaultLang] = useState('4');
    const [loading, setLoading] = useState(true);
    const [end, setEnd] = useState(JSON.parse(localStorage.getItem('end')));
    const [curTime, setCurTime] = useState(new Date().getTime());
    const [showQuestion, setShowQuestion] = useState(false);
    const [showInfo, setShowInfo] = useState(false);
    const navigate = useNavigate();

    document.oncontextmenu = new Function("return false");
    document.oncut = new Function("return false");
    document.oncopy = new Function("return false");
    document.onpaste = new Function("return false");
    document.onselectstart = new Function("return false");

    const fetchEnd = () => {
        const d = new Date();
        setEnd(JSON.parse(localStorage.getItem('end')));
        setCurTime(d.getTime());
        if(curTime < end) {
            console.log(d.getTime())
            setTimeout(() => fetchEnd(), 1000);
        } else {
            backHandler();
        }
    }

    useEffect(() => {  // fetch code and scores on initial load
        async function getData() {
            const payload = {
                userId: encrypt(userId),
                questionId: questionId
            };
            try {
                const { data } = await axios.post("http://localhost:5000/get-submission", payload);
                if(data.success === "true") {
                    setCode(data.code);
                    setLanguage(data.language);
                    if(data.language === 'py') {
                        setFileId('test');
                        setLang('python');
                        setDefaultLang('4');
                    } else if(data.language === 'c') {
                        setFileId('test');
                        setLang('c_cpp');
                        setDefaultLang('1');
                    } else if(data.language === 'cpp') {
                        setFileId('test');
                        setLang('c_cpp');
                        setDefaultLang('2');
                    } else if(data.language === 'java') {
                        setFileId('MyClass');
                        setLang('java');
                        setDefaultLang('3');
                    }
                }
            } catch(err) {
                setOutput("");
                setVisibility(true);
            }
        }

        async function getScore() {
            try {
                const payload = {
                    userId: encrypt(userId),
                    questionId: questionId
                };
                const { data } = await axios.post('http://localhost:5000/get-scores-question', payload);
                    if(data) {
                        setScore(data.score[0].score);
                    }
            } catch(err) {
                setOutput("");
                setVisibility(true);
            }
        }
        if(first) {
            fetchEnd();
            setLoading(true);
            setFirst(false);
            getData();
            getScore();
            setLoading(false);
        }
    }, [])

    const fetch = async() => { // fetch score and output after submit
        const payload = {
            userId: encrypt(userId),
            questionId: questionId
        };
        try {
            const { data } = await axios.post("http://localhost:5000/get-submission", payload);
            if(data.success === "true") {
                let out = decrypt(data.output);
                console.log(out);
                if(out === "Compilation error\n") {
                    toast.error("Compilation error", {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                } else if(out === "Runtime error\n") {
                    toast.error("Runtime error", {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                } else if(out === "TLE\n") {
                    toast.warn("Time Limit exceeded", {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                }else if(out.indexOf("Illegal import") > -1) {
                    toast.error("Illegal imports", {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                } else {
                    toast.success("Excecuted successfully", {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                    const { data } = await axios.post('http://localhost:5000/get-scores-question', payload);
                    if(data) {
                        setScore(data.score[0].score);
                    } else {
                        toast.error("Something went wrong", {
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
                if(checked) {
                    setOutput(out);
                } else {
                    setOutput('');
                }
                setVisibility(true);
            } else if(data.success === "Code in execution") {
                setTimeout(() => fetch(), 5000);
                toast.warn("Code in execution", {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            } else if(data.success === "Error occured") {
                toast.error("Something went wrong", {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                setVisibility(true);
            }
        } catch (err) {
            toast.error("Something went wrong", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            setOutput("");
            setVisibility(false);
        }
    }

    const backHandler = () => {
        localStorage.removeItem('currentQuestion');
        navigate('/questions');
    }

    const langHandler = e => {
        if(e.label === 'C') {
            setLang('c_cpp');
            setLanguage('c');
            setFileId('test');
        }
        else if(e.label === 'C++') {
            setLang('c_cpp');
            setLanguage('cpp');
            setFileId('test');
        }
        else if(e.label === 'Java') {
            setLang('java');
            setLanguage('java');
            setFileId('MyClass');
            toast.warn("Use class name as MyClass or your code will not compile", {
                position: "top-right",
                autoClose: false,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
        else if(e.label === 'Python3') {
            setLang('python');
            setLanguage('py');
            setFileId('test');
        }
    }

    const handleChange = () => {
        setChecked(!checked);
        setUserInput('');
    };

    const compileHandler = async() => {
        setOutput('');
        setVisibility(false);
        const time = new Date().getTime();
        const payload = {
            time: time,
            language: language,
            code: code,
            id: fileId,
            userInput: userInput,
            userId: encrypt(userId),
            questionId: questionId,
            userInputFlag: true,
            competitionId: competitionId
        }; 
        try {
            const { data } = await axios.post("http://localhost:5000/run", payload);
            if(data.success === true) {
                fetch();
            }
        } catch (data) {
            if(data) {
                fetch();
            }
            else {
                toast.error("Something went wrong", {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });;
                setVisibility(true);
            }
        }
    }

    const submitHandler = async() => {
        setOutput('');
        setVisibility(false);
        const time = new Date().getTime();
        const payload = {
            time: time,
            language: language,
            code: code,
            id: fileId,
            userInput: '',
            userId: encrypt(userId),
            questionId: questionId,
            userInputFlag: false,
            competitionId: competitionId
        }; 
        try {
            const { data } = await axios.post("http://localhost:5000/run", payload);
            if(data.success === true) {
                fetch();
            }
            
        } catch (data) {
            if(data) {
                fetch();
            }
            else {
                toast.error("Something went wrong", {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                setVisibility(true);
            }
        }
    }

    const resetHandler = () => {
        setCode('');
        setOutput('');
        setUserInput('');
    }

    const closeQuestion = () => {
        setShowQuestion(false);
    }

    const closeInfo = () => {
        setShowInfo(false);
    }

    return !loading && (
        <div className='Home'>
            <button className='button-10' onClick={backHandler}>Back</button>
            <div className='code' >     
                <AceEditor className='codearea'
                    style={{
                        height: '80vh',
                        width: '49%'
                    }}
                    mode={lang}
                    theme="monokai"
                    name="blah2"
                    value={code}
                    onChange={code => setCode(code)}
                    fontSize={14}
                    showPrintMargin={false}
                    showGutter={true}
                    highlightActiveLine={true}
                    editorProps={{ $blockScrolling: Infinity }}
                    
                    commands={[
                        {   // commands is array of key bindings.
                            name: 'pasteline', //name for the key binding.
                            bindKey: { win: 'Ctrl-V', mac: 'Command-V' }, //key combination used for the command.
                            exec: function (editor) {
                                console.log(editor)
                                const editorEvents = ['dragenter', 'dragover', 'dragend', 'dragstart', 'dragleave', 'drop'];
                                for (const events of editorEvents) {
                                    console.log(events)
                                    editor.container.addEventListener(events, function (e) { e.stopPropagation(); }, true);
                                }
                            }
                        },
                        {   // commands is array of key bindings.
                            name: 'copyline', //name for the key binding.
                            bindKey: { win: 'Ctrl-C', mac: 'Command-C' }, //key combination used for the command.
                            exec: function (editor) {
                                console.log(editor)
                                const editorEvents = ['dragenter', 'dragover', 'dragend', 'dragstart', 'dragleave', 'drop'];
                                for (const events of editorEvents) {
                                    console.log(events)
                                    editor.container.addEventListener(events, function (e) { e.stopPropagation(); }, true);
                                }
                            }
                        },
                        {   // commands is array of key bindings.
                            name: 'cutline', //name for the key binding.
                            bindKey: { win: 'Ctrl-X', mac: 'Command-X' }, //key combination used for the command.
                            exec: function (editor) {
                                console.log(editor)
                                const editorEvents = ['dragenter', 'dragover', 'dragend', 'dragstart', 'dragleave', 'drop'];
                                for (const events of editorEvents) {
                                    console.log(events)
                                    editor.container.addEventListener(events, function (e) { e.stopPropagation(); }, true);
                                }
                            }
                        }
                    ]}
                    setOptions={{
                        enableBasicAutocompletion: false,
                        enableLiveAutocompletion: false,
                        enableSnippets: false,
                        showLineNumbers: true,
                        tabSize: 4,
                        wrap: true}}/>
                <div className='codeoutput'>
                    <Select className='selectlang'
                        name='Language' 
                        value={options.find(obj => obj.value === lang)} 
                        options={options} 
                        defaultValue={options.find(obj => obj.value === defaultLang)} 
                        onChange={langHandler}
                        menuPlacement='auto'
                        width='100dp'/>
                    {visibility === true ? 
                        curTime < end ? (
                            <div className='buttons'> 
                                <div className='button1'>
                                    <button className='desbutt' onClick={compileHandler}>Run</button>
                                </div>
                                <div className='button1'>
                                    <button className='desbutt' onClick={resetHandler}>Reset</button>
                                </div>
                                {!checked && (
                                    <div className='button1'>
                                        <button className='desbutt' onClick={submitHandler}>Submit</button>
                                    </div>
                                )}
                            </div>
                        ) : (
                        <div className='score'>
                            <text className='score-text'>This competition has ended</text>
                        </div>)
                    : <></>}
                    <div className='button-container'>
                        <button className='button-10' onClick={() => setShowInfo(true)}>Info</button>
                        <button className='button-10' onClick={() => setShowQuestion(true)}>Question</button>
                    </div>
                    {curTime < end && (
                        <div>
                            <input className='check'
                                type="checkbox"
                                checked={checked}
                                onChange={handleChange}/>
                            <label className="switch switch-default">Take user Input</label>
                        </div>)}
                    
                    {checked ? (
                        <div className='inout'>
                            <div className='userCode'>
                                <h1>Output</h1>
                                <div className='outputblock'>{output}</div>
                            </div>
                            
                            <div className='userCode'>
                                <h1 className='h1in'>Input</h1>
                                <div className='inputblock'>
                                    <textarea id="input" onChange={e => setUserInput(e.target.value)}></textarea>
                                </div>
                            </div>
                        </div>
                        ) : (
                        <div className='score'>
                            <text className='score-text'>Max Score: {score}%</text>
                        </div>
                        )
                    }
                </div>
            </div>
            {showInfo && (
                <Popup 
                    content={
                        <div>
                            <div>
                                <text>Info:</text>
                            </div>
                            <div>
                                <ul>
                                    <li>
                                        <text>To run your code with your own test cases, select the check box and enter your inputs in the input box. </text>
                                        <text>If your input takes multiple inputs in different lines, write them all in the same line seperated by '\n'.</text>
                                        <text>Ex: 3\n1 2 3\n4 5 6\n7 8 9</text>
                                        <text>To run n test cases, write n such inputs</text>  
                                    </li>
                                    <li>
                                        <text>To submit your answer for grading click submit and it will run your code against the selected set of testcases.</text>
                                    </li>
                                    <li>
                                        <text>Note: We do not have autosave, however to save your current progress you can either 'Run' or 'Submit' your code to save it and return back to continue your prograss.</text>
                                    </li>
                                    <li>
                                        <text>While grading we only save your maximum score and time at which that score was attained. So you can do multiple submissions without worring about getting a lower score.</text>
                                    </li>
                                    <li>
                                        <text>The 'Reset' option only clears your current workspace without deleting your previous submission or score.</text>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    }
                    handleClose={closeInfo}></Popup>
            )}
            {showQuestion && (
                <Popup 
                    content={
                        <div>
                            <div>Question</div>
                            <div>
                                <div className='question-code'>{/*question code*/}        
                                    <text className='code-text'>{currentQuestion.questionId}</text>
                                </div>
                                <div className='question-desc'>{/*question description*/}        
                                    <text>{currentQuestion.description}</text>
                                </div>
                                <text>Example:</text>   
                                <div className='question-ex'>                         
                                    <div className='question-exinout'>{/*example inputs*/}
                                        <text className='inout-text'>{"Inputs:\n" + currentQuestion.testinputs}</text>
                                    </div>        
                                    <div className='question-exinout'>{/*example outputs*/}    
                                        <text className='inout-text'>{"Outputs:\n" + currentQuestion.testoutputs}</text>
                                    </div>
                                </div>
                            </div>
                        </div>
                    }
                    handleClose={closeQuestion}></Popup>
            )}
            <ToastContainer/>
            <footer className="footer">
                <p className='pfoot'>Made by Debjit, Shresth, and Shayantani</p>
            </footer>
        </div>
    );
}

export default Compile;