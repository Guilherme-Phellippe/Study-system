import { finishExam } from './controllers/examController.js';
import { getAsks } from './Database/router.js'

const params = new URLSearchParams(window.location.search)

const exam = {
    questions: [],
    questionNumber: 1,
    timer: null,
}


async function init() {
    initStopWatch();
    await createExam();
    showRandomQuestions()
}
init();

function initStopWatch() {
    const time = document.querySelector('main .container-exam .info-exam span#time')
    var seconds = 0
    var minutes = 0
    var hour = 0
    exam.timer = setInterval(() => {
        seconds++
        if (seconds == 60) { seconds = 0; minutes++ }
        if (minutes == 60) { minutes = 0; hour++ }
        if (seconds < 10) { seconds = "0" + seconds }
        if (minutes < 10 && seconds == 1) { minutes = "0" + minutes }
        let timeUpdated = minutes + ":" + seconds
        if (hour != 0) { timeUpdated = hour + ":" + minutes + ":" + seconds }
        time.textContent = timeUpdated
    }, 1000);
};

async function createExam() {
    const [{ content: contents }] = await getAsks(params.get("matterid"));
    const maxQuestion = Number(params.get("qntd"));
    contents.sort(() => Math.random() - 0.5)
    for (let n = 0; n < maxQuestion;n++) {
        exam.questions.push(contents[n])
    }
}

// show each random question
async function showRandomQuestions() {
    var buttonNext = document.querySelector('.box-exam button.button');
    var numberQuestion = document.querySelector('.box-exam span#number-question');
    var currentAsk = document.querySelector('.box-exam p#current-ask');

    var { questionNumber, questions} = exam;

    //init first question automaty
    numberQuestion.textContent = `(${questionNumber})`;
    currentAsk.textContent = `${questions[questionNumber - 1].ask}`
    setNameAndNivelMatter("a", questions[questionNumber - 1].nivel)
    saveAnswer(true);

    //set new question with button
    buttonNext.addEventListener('click', () => {
        let isFinish = finalizeExam();
        if (!isFinish) {
            exam.questionNumber += 1
            setQntdQuestion(questionNumber + 1);
            numberQuestion.textContent = `(${exam.questionNumber})`;
            currentAsk.textContent = `${questions[exam.questionNumber - 1].ask}`
            setNameAndNivelMatter("a", questions[exam.questionNumber - 1].nivel)
            saveAnswer(false);
        } else {
            saveAnswer(false);
            clearInterval(exam.timer)
            finishExam(params.get('matterid'), params.get('qntd'), document.querySelector('main .container-exam .info-exam span#time').textContent);
        }
    })
}



//set qntd question
function setQntdQuestion(numberQuestion) {
    var qntd = document.querySelector('span#qntd-ask');
    qntd.textContent = numberQuestion + " / " + params.get('qntd')
}

function setNameAndNivelMatter(nome, nivel) {
    const nameMatter = document.querySelector('main .container-exam .info-exam h2');
    const nivelAsk = document.querySelector('main .container-exam .info-exam span#nivel');
    nameMatter.textContent = nome
    nivelAsk.textContent = 'Nível: ' + nivel
}

//function generate a index about question in db
function createRandomQuestions() {
    var numberMax = Number(params.get('max'));
    var questionExam = [];

    for (let n = 0; n < params.get('qntd'); n++) {
        let questionRandom = generateRandom();
        var find = questionExam.find(e => e == questionRandom);
        if (!find) questionExam.push(questionRandom);
        else {
            questionRandom = generateRandom();
            questionExam.push(questionRandom);
        }
    }
    if (localStorage.getItem('randomquestion') == null) localStorage.setItem('randomquestion', JSON.stringify(questionExam))



    function generateRandom() {
        return Math.floor(Math.random() * numberMax)
    }
}


//save user's answer
function saveAnswer(isFirst) {
    var userAnswer = []
    if (localStorage.getItem('answers') == null) localStorage.setItem('answers', JSON.stringify(userAnswer))
    if (!isFirst) {
        let txtAnswer = document.querySelector('.box-exam textarea#your-answer')
        let storedAnswer = JSON.parse(localStorage.getItem('answers'));
        for (let res of storedAnswer) {
            userAnswer.push(res);
        }
        userAnswer.push(txtAnswer.value)
        localStorage.setItem('answers', JSON.stringify(userAnswer));
        txtAnswer.value = ''
    }
}

//finalize the exam
function finalizeExam() {
    if ((exam.questionNumber) == Number(params.get('qntd'))) return true
    else return false
}