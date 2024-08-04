const Queue = require('bull');
const { generateCodeFile } = require('./generateFile');
const { executeCode } = require('./exceuteCode');

const runQueue = new Queue("job-queue");
const workers = 4;

runQueue.process(workers, async({data}) => {
    const { language, code, id, userInput, user_id, userInputFlag, questionId } = data;
    const _id = user_id + questionId;
    const filepath = await generateCodeFile(language, code, id, userInput, user_id);
    var output = await executeCode(filepath, language, userInputFlag, questionId, _id);
})

const enqueue = async(language, code, id, userInput, user_id, userInputFlag, questionId) => {
    await runQueue.add({ 
        language: language, 
        code: code, 
        id: id, 
        userInput: userInput, 
        user_id: user_id, 
        userInputFlag: userInputFlag, 
        questionId: questionId 
    });
}

module.exports = {
    enqueue
}