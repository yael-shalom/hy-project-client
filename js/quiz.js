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
        const res = await myFetch(`${baseURL}/quizzes/${id}`, 'GET');
        const quiz = res.data;//המרת הנתונים לאובייקט
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
                input.classList.add('radio');
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
    let flag = false;
    scrollToTop()
    header.appendChild(scoreCon);
    const questions = quiz.questions;
    const inputs = document.querySelectorAll("input");

    for (const input of inputs) {
        if (flag) {
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
        flag = true;
    }
    showScore(0);
    // updateUserAfterQuiz(quiz.owner._id);
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
    const res = await myFetch(`${baseURL}/quizzes/${id}`, 'GET');//חיבור לדטה בייס
    const quiz = res.data;//המרת הנתונים לאובייקט
    console.log(quiz);
    if (quiz.isOwner) {
    let button = document.createElement("button");
    button.classList.add("quiz");
    button.dataset.id = quiz._id;
    button.textContent = "עדכן שאלון";
    button.onclick = (event) => {
        window.open(`../pages/add-quiz.html?id=${quiz._id}`, '_self');
    };
    const body = document.querySelector("body");
    body.appendChild(button)
    }
};

const addDeleteBtn = async () => {
    const res = await myFetch(`${baseURL}/quizzes/${id}`, 'GET');
    const quiz = res.data;//המרת הנתונים לאובייקט
    console.log(quiz);
    
    if (quiz.isOwner) {
        let button = document.createElement("button");
        button.classList.add("quiz");
        button.textContent = "מחק שאלון";
        button.onclick = deleteQuiz;
        const body = document.querySelector("body");
        body.appendChild(button)
    }
}

async function deleteQuiz() {
    try {
        const res = await myFetch(`${baseURL}/quizzes/${id}`, 'DELETE');

        if (res.ok) {
            console.log('Quiz deleted successfully');
            window.open('../pages/quizzes.html?isMy=false', '_self');
        } else {
            console.error('Error deleting quiz');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to delete quiz.');
    }
}

// async function updateUserAfterQuiz(score, userId) {
//     const res = await fetch(`${baseURL}/users/${userId}`);
//     const currentUser = await res.json();

//     const user = {
//         _id: userId
//     };

//     try {        
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

//#region add profile
const profileWindow = document.getElementById('profileWindow');

function openProfileWindow() {
    profileWindow.style.display = 'block';
}

async function handleRemove() {
    // קוד להסרת משתמש
    const userId = "6732ad87b6562d5e3932f894";
    try {
        const res = await myFetch(`${baseURL}/users/${userId}`, 'DELETE');

        if (res.ok) {
            localStorage.removeItem('isLogin');
            localStorage.removeItem('token');
            localStorage.removeItem('userImage');
            localStorage.removeItem('username');
            console.log('user deleted successfully');
            window.open('../pages/quizzes.html?isMy=false', '_self');
        } else {
            console.error('Error deleting user');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to delete user.');
    }
    profileWindow.style.display = 'none'; // לסגור את החלונית לאחר הפעולה
}

function handleLogout() {
    // קוד להתנתקות
    localStorage.setItem('isLogin', false);
    localStorage.removeItem('token');
    localStorage.removeItem('userImage');
    localStorage.removeItem('username');
    profileWindow.style.display = 'none'; // לסגור את החלונית לאחר הפעולה
}

function cancel() {
    profileWindow.style.display = 'none';
}

onload = () => {
    getQuizById(searchParams.get('id'));
    updateQuiz();
    addDeleteBtn();
    if (JSON.parse(localStorage.getItem('isLogin')) == true) {
        const btn = document.querySelector('#enter');
        btn.textContent = "";
        btn.classList.add('profile');
        if (localStorage.getItem('userImage') !== 'undefined') {
            const img = document.createElement("img");
            img.src = localStorage.getItem('userImage');
            img.classList.add('profile')
            btn.appendChild(img)
        }
        else {
            btn.style.backgroundColor = "#b4292e";
            btn.style.color = "white";
            btn.textContent = localStorage.getItem('username').slice(0, 1);
        }
        btn.onclick = openProfileWindow;
    }
}
//#endregion
