const fs = require('fs');
const path = require('path');
const dirCodes = path.join(__dirname, "codes");

if(!fs.existsSync(dirCodes)) {
    fs.mkdirSync(dirCodes, {recursive: true});
}

const generateCodeFile = async(format, code, id, userInput, userId) => {
    const jobPath = path.join(dirCodes, userId);
    if(!fs.existsSync(jobPath)) {
        fs.mkdirSync(jobPath, {recursive: true});
    }
    const jobId = id;
    const codeFile = jobId+'.'+format;
    const codePath = path.join(jobPath, codeFile);
    await fs.writeFileSync(codePath, code);
    const inputFile = 'userInput.txt';
    const inputPath = path.join(jobPath, inputFile);
    if(userInput === '') {
        await fs.writeFileSync(inputPath, '1');
    }
    else {
        await fs.writeFileSync(inputPath, userInput);
    }
    return codePath;
}

const generateTestCase = async(inputs, outputs, questionId) => {
    const inputDir = path.join(__dirname, "inputs");
    const outputDir = path.join(__dirname, "outputs");
    if(!fs.existsSync(inputDir)) {
        fs.mkdirSync(inputDir, {recursive: true});
    }
    if(!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, {recursive: true});
    }
    const fileId = questionId+'.txt';
    const inputPath = path.join(inputDir, fileId);
    const outputPath = path.join(outputDir, fileId);
    if(inputs !== '') {
        await fs.writeFileSync(inputPath, inputs);
    }
    if(outputs !== '') {
        await fs.writeFileSync(outputPath, outputs);
    }
}

const removeTestCase = async(questionId) => {
    const inputDir = path.join(__dirname, "inputs");
    const outputDir = path.join(__dirname, "outputs");
    const fileId = questionId+'.txt';
    const inputPath = path.join(inputDir, fileId);
    const outputPath = path.join(outputDir, fileId);
    await fs.rmSync(inputPath);
    await fs.rmSync(outputPath);
}

module.exports = {
    generateCodeFile, generateTestCase, removeTestCase
};