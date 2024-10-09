
const searchParams = new URLSearchParams(location.search);
console.log(searchParams.get("id"));
const id = searchParams.get("id");

const baseURL = "http://localhost:5000";

const container = document.createElement("div");//מכיל את כל השאלות/תשובות
container.classList.add("flex-col");
const scoreCon = document.createElement("h1");
let score = 0;

const getQuizById = async (id) => {
    try {
        const res = await fetch(`${baseURL}/quizzes/${id}`);//חיבור לדטה בייס
        const quiz = await res.json();//המרת הנתונים לאובייקט
        console.log(quiz);
        const quizData = document.querySelector("#quizData");//מכיל את כל פרטי השאלון
        let h1 = document.createElement("h1");
        h1.textContent = quiz.name;//כותרת השאלון
        quizData.append(h1);
        const questions = quiz.questions;//קבלת כל השאלות
        console.log(questions);
        for (const q of questions) {
            const h4 = document.createElement("h4");
            h4.textContent = q.content;//תוכן השאלה
            container.appendChild(h4);
            for (const answer of q.answers) {//מעבר על כל התשובות ויצירת כפתורי רדיו
                const quizCon = document.createElement("div");
                quizCon.classList.add("flex-row");
                const label = document.createElement("label");
                label.htmlFor = answer._id;
                label.textContent = answer.content;
                const input = document.createElement("input");
                input.id = answer._id;
                input.type = "radio";
                input.name = q._id;
                quizCon.appendChild(input);
                quizCon.appendChild(label);
                container.appendChild(quizCon);
            }
        }
        quizData.appendChild(container);

        const inputs = document.querySelectorAll("input");
        console.log(inputs);


        const button = document.createElement("button");
        button.textContent = "חשב";
        button.addEventListener("click", () => { calculate(quiz) });
        container.appendChild(scoreCon);
        container.appendChild(button);
    } catch (error) {
        console.log(error);
    }
};


function calculate(quiz) {
    const questions = quiz.questions;
    console.log(quiz);
    
    const inputs = document.querySelectorAll("input");
    for (const input of inputs) {
        const answerId = input.id;
        const checked = input.checked;
        const questionId = input.name;
        const question = questions.find(q => q._id === questionId);
        const answer = question.answers.find(a => a._id === answerId);
        const isRight = answer.isRight;
        if (isRight === true && checked === true){
            score += quiz.score;
            input.classList.add("right");
        }
        else{
            input.classList.add("wrong");
        }
        if(isRight === true)
            input.parentElement.classList.add("correct");
    }
    console.log(score);
    showScore();
    // container.appendChild(scoreCon);
}

let count = 0;
function showScore() {
    scoreCon.textContent = `${count}%`;
    count++;
    if (count <= score) {
        setTimeout(showScore, 40); // Adjust the delay (in milliseconds) for the counting speed
    }
}