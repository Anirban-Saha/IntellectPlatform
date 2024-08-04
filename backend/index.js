const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');

const url = "mongodb+srv://intellect:admin@cluster0.26gqg.mongodb.net/Project_IntellecT?retryWrites=true&w=majority";
const client = new MongoClient(url);

const app = express();
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cors());

const { encrypt, hashPass, decrypt, hash } = require('./encryption');
const { generateTestCase, removeTestCase } = require('./generateFile');
const { enqueue } = require('./runQueue');

app.get('/', (req, res) => {
    return res.json({hello: "world"});
})

app.post('/run', async(req, res) => {
    try {
        const { language, code, id, userInput, userId, questionId, userInputFlag, competitionId, time } = req.body;
        if(code === ''){
            return res.status(400).json({success: false, err: "Empty Code body"});
        }
        await client.connect();
        const db = client.db('Project_IntellecT');
        const submissions = db.collection("Submissions");
        const scoreList = db.collection("Scores");
        const user_id = decrypt(userId)
        const _id = user_id + questionId;
        var result = await scoreList.findOne({_id: _id});
        var curScore = 0;
        var curTime = time;
        if(result) {
            curScore = result.score;
            curTime = result.time;
            result = await scoreList.deleteOne({_id: _id});     
        }
        result = await scoreList.insertOne({_id: _id, userId: user_id, score: curScore, questionId: questionId, competitionId: competitionId, time: curTime});
        result = await submissions.findOneAndDelete({_id: _id});
        result = await submissions.insertOne({questionId: questionId, code: code, status: "pending", success: "false", output: "", _id: _id, time: time, language: language, competitionId: competitionId});
        enqueue(language, code, id, userInput, user_id, userInputFlag, questionId);
        return res.status(200).json({success: true});
    } catch (error) {
        return res.status(500).json({success: false, err: "Please check your code"});
    }
})

app.post('/login', async(req, res) => {
    try { 
        const { roll, password } = req.body;
        const decryptRoll = decrypt(roll);
        const decryptPass = decrypt(password);
        await client.connect();
        const db = client.db("Project_IntellecT");
        const cred = db.collection("User_Credentials");
        const user = await cred.findOne({_id: decryptRoll});
        if(user.password === hashPass(decryptPass, user.salt)) {
            return res.status(200).json({success: true, roll: roll, access: user.access, name: user.name});
        }
        else {
            return res.status(200).json({success: false, err: "Incorrect password"});
        }
    } catch (err) {
        return res.status(400).json({success: false, err: "Invalid roll"});
    }
})

app.post('/register', async(req, res) => {
    try { 
        await client.connect();
        const { password, roll, name, access, batch } = req.body;
        const db = client.db("Project_IntellecT");
        const cred = db.collection("User_Credentials");
        const encryptPass = hash(password)
        const result = await cred.insertOne({_id: roll, password: encryptPass.hash, name: name, access: access, salt: encryptPass.salt, batch: batch});
        return res.status(200).json({result});
    } catch (err) {
        return res.status(400).json({err: "Invalid ID"});
    }
})

app.delete('/remove-user', async(req, res) => {
    try {
        const userId = req.body.userId;
        await client.connect();
        const db = client.db("Project_IntellecT");
        const cred = db.collection("User_Credentials");
        const result = await cred.findOneAndDelete({_id: userId});
        return res.status(200).json({result});
    } catch(err) {
        return res.status(400).json({err});
    }
})

app.get('/get-competitions', async(req, res) => {
    try {
        await client.connect();
        const db = client.db("Project_IntellecT");
        const comp = db.collection("Competitions");
        const list = await comp.find({}).toArray();
        list.forEach(element => {
            element.competitionId = encrypt(element.competitionId);
            delete element.questions;
        })
        return res.status(200).json(list);
    } catch (err) {
        return res.status(400).json({err: err});
    }
})

app.post('/add-competition', async(req, res) => {
    try {
        const { competitionId, questions, start, end } = req.body;
        await client.connect();
        const db = client.db("Project_IntellecT");
        const comp = db.collection("Competitions");
        const startTime = new Date(start).getTime();
        const endTime = new Date(end).getTime();
        questions.forEach(question => {
            generateTestCase(question.inputs, question.outputs, question.questionId);
        })
        const result = comp.insertOne({competitionId: competitionId, questions: questions, start: startTime, end: endTime});
        return res.status(200).send(result);
    } catch (err) {
        return res.status(500).json({err: err});
    }
})

app.post('/get-submission', async(req, res) => {
    try {
        const { userId, questionId } = req.body;
        const user_id = decrypt(userId);
        const _id = user_id + questionId;
        await client.connect();
        const db = client.db("Project_IntellecT");
        const submissions = db.collection("Submissions");
        const sub = await submissions.findOne({_id: _id});
        const { code, status, output, success, language } = sub;
        var data = null;
        if(status === 'done') {
            data = {success: success, output: encrypt(output), code: code, language: language};
        }
        else if(status === 'pending'){
            data = {success: "Code in execution", output: ""}
        }
        return res.status(200).json(data);
    } catch (err) {
        const data = {success: "Error occured", output: ""}
        return res.status(200).json(data);
    }
})

app.get('/get-scores', async(req, res) => {
    try {
        const competitionId = req.query.competitionId;
        await client.connect();
        const db = client.db("Project_IntellecT");
        const scores = db.collection("Scores");
        const cursor = await scores.find({competitionId: competitionId}); 
        let scoreList = [];
        await cursor.forEach(element => {
            scoreList.push(element);
        });
        return res.status(200).json({scores: scoreList});
    } catch (err) {
        return res.status(400).json({err: err});
    }
})

app.get('/get-scores-user', async(req, res) => {
    try {
        const userId = req.body.userId;
        const user_id = decrypt(userId);
        await client.connect();
        const db = client.db("Project_IntellecT");
        const scores = db.collection("Scores");
        const cursor = await scores.find({ userId: user_id});
        let scoreList = []
        await cursor.forEach(element => {
            scoreList.push(element)
        });
        return res.status(200).json({scores: scoreList});
    } catch (err) {
        return res.status(400).json({err: err});
    }
})

app.post('/get-scores-question', async(req, res) => {
    try {
        const userId = req.body.userId;
        const questionId = req.body.questionId;
        const user_id = decrypt(userId);
        await client.connect();
        const db = client.db("Project_IntellecT");
        const scores = db.collection("Scores");
        const cursor = await scores.find({ _id: user_id + questionId});
        let scoreList = []
        await cursor.forEach(element => {
            scoreList.push(element)
        });
        return res.status(200).json({score: scoreList});
    } catch (err) {
        return res.status(400).json({err: err});
    }
})

app.get('/get-questions', async(req, res) => {
    try {
        const competitionId = req.query.competitionId;
        await client.connect();
        const db = client.db("Project_IntellecT");
        const comp = db.collection("Competitions");
        const competition = await comp.findOne({competitionId: competitionId});
        competition.questions.forEach(question => {
            delete question.inputs;
            delete question.outputs;
        });
        return res.status(200).json({questions: competition.questions});
    } catch (err) {
        return res.status(400).json({err: err});
    }
})

app.get('/get-questions-admin', async(req, res) => {
    try {
        const competitionId = req.query.competitionId;
        await client.connect();
        const db = client.db("Project_IntellecT");
        const comp = db.collection("Competitions");
        const competition = await comp.findOne({competitionId: competitionId});
        return res.status(200).json({questions: competition.questions});
    } catch (err) {
        return res.status(400).json({err: err});
    }
})

app.get('/get-users', async(req, res) => {
    try {
        await client.connect();
        const db = client.db("Project_IntellecT");
        const users = db.collection("User_Credentials");
        const userList = await users.find({}).toArray();
        return res.status(200).json({userList: userList, success: true});
    } catch(err) {
        return res.status(500).json({err: err, success: false});
    }
})

app.get('/get-id-list', async(req, res) => {
    try {
        await client.connect();
        const db = client.db("Project_IntellecT");
        const comp = db.collection("Competitions");
        const competitions = await comp.find({}).toArray();
        let compList = [];
        let questionList = [];
        await competitions.forEach(comp => {
            compList.push(comp.competitionId);
            comp.questions && comp.questions.forEach(question => {
                questionList.push(question.questionId);
            });
        });
        return res.status(200).json({compList: compList, questionList: questionList});
    } catch(err) {
        return res.status(500).json({err: err});
    }
})

app.put('/update-competition', async(req, res) => {
    try {
        await client.connect();
        const db = client.db("Project_IntellecT");
        const comp = db.collection("Competitions");
        const filter = { competitionId: req.body.competitionId };
        const startTime = new Date(req.body.start).getTime();
        const endTime = new Date(req.body.end).getTime();
        const updateDoc = {
            $set: {
              competitionId: req.body.competitionId,
              start: startTime,
              end: endTime,
              questions: req.body.questions
            },
          };
        const result = await comp.updateOne(filter, updateDoc);
        req.body.questions.forEach(question => {
            generateTestCase(question.inputs, question.outputs, question.questionId);
        })
        return res.status(200).json({result: result});
    } catch(err) {
        return res.status(400).json({err: err});
    }
})

app.delete('/remove-competition', async(req, res) => {
    try {
        const competitionId = req.body.competitionId;
        await client.connect();
        const db = client.db("Project_IntellecT");
        const comp = db.collection("Competitions");
        const sub = db.collection("Submissions");
        const competition = await comp.findOne({ competitionId: competitionId });
        competition.questions.forEach(question => {
            removeTestCase(question.questionId);
        });
        const resComp = await comp.deleteOne({ competitionId: competitionId });
        const resSub = await sub.deleteMany({ competitionId: competitionId });
        return res.status(200).json({ comp: resComp, sub: resSub });
    } catch(err) {
        return res.status(500).json({err: err});
    }
})

app.listen(5000, () => {
    console.log('Listening on port 5000!');
})