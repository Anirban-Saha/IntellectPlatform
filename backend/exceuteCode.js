const { exec } = require('child_process');

const executeCode = (filepath, format, userInputFlag, questionId, _id) => {
    var command = 'python runCode.py '+filepath+' '+format+' '+_id;
    if(userInputFlag === false) {
        command = command+' '+questionId;
    }
    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            error && reject({ error, stderr });
            stderr && reject(stderr);
            resolve();
        });  
    });
}

module.exports = {
    executeCode
};