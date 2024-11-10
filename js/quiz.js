const searchParams = new URLSearchParams(location.search);
console.log(searchParams.get("id"));
const id = searchParams.get("id");

const baseURL = "http://localhost:5000";

const container = document.createElement("div");//מכיל את כל השאלות/תשובות
container.classList.add("flex-col");
const scoreCon = document.createElement("h1");
scoreCon.classList.add("score");
let score = 0;
const header = document.createElement("header");
header.classList.add("flex-row");

const getQuizById = async (id) => {
    try {
        const res = await fetch(`${baseURL}/quizzes/${id}`, {             
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        const quiz = await res.json();//המרת הנתונים לאובייקט
        console.log(quiz);
        const quizData = document.querySelector("#quizData");//מכיל את כל פרטי השאלון
        let h1 = document.createElement("h1");
        h1.textContent = quiz.name;//כותרת השאלון
        header.appendChild(h1);
        quizData.append(header);
        const questions = quiz.questions;//קבלת כל השאלות
        shuffleArray(questions);
        for (const q of questions) {
            const questionContainer = document.createElement("div");
            questionContainer.classList.add("question-container");
            const h4 = document.createElement("h4");
            h4.textContent = q.content;//תוכן השאלה
            questionContainer.appendChild(h4);
            shuffleArray(q.answers);
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
                questionContainer.appendChild(quizCon);
            }
            container.appendChild(questionContainer);
        }
        quizData.appendChild(container);
        const button = document.createElement("button");
        button.textContent = "חשב";
        button.addEventListener("click", () => { calculate(quiz) });
        button.classList.add("Button--Light");
        container.appendChild(button);
    } catch (error) {
        console.log(error);
    }
};

const calculate = (quiz) => {
    score = 0;
    scrollToTop()
    header.appendChild(scoreCon);
    const questions = quiz.questions;
    const inputs = document.querySelectorAll("input");

    for (const input of inputs) {
        input.onclick = () => { return false; };//חסימת כפתורי הרדיו שלא יהיו ניתנים לשינוי
        const answerId = input.id;
        const checked = input.checked;
        const questionId = input.name;
        const question = questions.find(q => q._id === questionId);
        const answer = question.answers.find(a => a._id === answerId);
        const isRight = answer.isRight;
        if (isRight === true && checked === true) {
            score += quiz.score;
            input.classList.add("right");
        }
        else {
            input.classList.add("wrong");
        }
        if (isRight === true)
            input.parentElement.classList.add("correct");
    }
    showScore(0);
    // updateUserAfterQuiz(score, quiz.owner._id);
};

const showScore = (count) => {
    scoreCon.textContent = `${count}%`;
    count++;
    if (count <= score) {
        setTimeout(showScore, 40, count);
    }
};

const shuffleArray = (array) => {
    for (let i = array?.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};

const scrollToTop = () => {
    const c = document.documentElement.scrollTop || document.body.scrollTop;
    if (c > 0) {
        window.requestAnimationFrame(scrollToTop);
        window.scrollTo(0, c - c / 8);
    }
};

const updateQuiz = async () => {
    const res = await fetch(`${baseURL}/quizzes/${id}`);//חיבור לדטה בייס
    const quiz = await res.json();//המרת הנתונים לאובייקט
    console.log(quiz);
    // if (quiz.isOwner) {
    let button = document.createElement("button");
    button.classList.add("quiz");
    button.dataset.id = quiz._id;
    button.textContent = "עדכן שאלון";
    button.onclick = (event) => {
        window.open(`../pages/add-quiz.html?id=${quiz._id}`, '_self');
    };
    const body = document.querySelector("body");
    body.appendChild(button)
    // }
};

const addDeleteBtn = async () => {
    const res = await fetch(`${baseURL}/quizzes/${id}`);//חיבור לדטה בייס
    const quiz = await res.json();//המרת הנתונים לאובייקט
    // if (quiz.isOwner) {
    let button = document.createElement("button");
    button.classList.add("quiz");
    button.textContent = "מחק שאלון";
    button.onclick = deleteQuiz;
    const body = document.querySelector("body");
    body.appendChild(button)
    // }
}

async function deleteQuiz() {
    try {
        const res = await fetch(`${baseURL}/quizzes/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (res.ok) {
            console.log('Quiz deleted successfully');
            window.open('../pages/quizzes.html', '_self');
        } else {
            const data = await res.json();
            console.error('Error deleting quiz:', data);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to delete quiz.');
    }
}

// async function updateUserAfterQuiz(score, userId) {
//     const user = {
//         _id: userId,
//         score
//     };

//     try {
//         const response = await myFetch(`${baseURL}/users/${userId}`);
        
//         // שליחת הנתונים לשרת
//         const res = await myFetch(`${baseURL}/users/${userId}`, 'PATCH',
//             {
//                 headers: { 'Content-Type': 'application/json', },
//                 body: JSON.stringify(user)
//             });
//         const data = res.data;

//         console.log('user updated:', data);
//         alert('user updated successfully!');
//     } catch (error) {
//         console.error('Error:', error);
//         alert('Failed to update user.');
//     }
// }

onload = () => {
    getQuizById(searchParams.get('id'));
    updateQuiz();
    addDeleteBtn();
}