const baseURL = "http://localhost:5000";

function openAddQuiz() {
    window.open(`./pages/frame.html?page=add-quiz`, '_self');
}
function openQuizzes() {
    window.open(`./pages/frame.html?page=quizzes`, '_self');
}
if (!localStorage.getItem('isLogin')) {
    localStorage.setItem('isLogin', false);
}

async function hotQuizzes() {
    const res = await myFetch(`${baseURL}/quizzes`, 'GET');
    const quizzes = res.data;
    let sortedQuizzes = sortQuizzesByDate(quizzes);
    if(sortedQuizzes[4]){
        sortedQuizzes = sortedQuizzes.slice(0, 4);
    }
    const quizzesCon = document.querySelector("#hot-quizzes");
    for (const quiz of sortedQuizzes) {
        let div = document.createElement("div");
        div.classList.add("quiz");
        div.dataset.id = quiz._id;
        div.textContent = quiz.name;
        div.addEventListener("click", (event) => {
            window.open(`./pages/quiz.html?id=${quiz._id}`, '_self');
        });
        quizzesCon.append(div);
    }
}

const sortQuizzesByDate = (quizzes) => {
    quizzes.sort((a, b) => new Date(b.date) - new Date(a.date));
    return quizzes;
};


// הגדרת זמן ההמתנה למחיקה במילישניות (3 שעות)
const timeToWaitInMilliseconds = 3 * 60 * 60 * 1000;

// המחיקה שתתבצע לאחר זמן ההמתנה
setTimeout(() => {
    localStorage.setItem('isLogin', false);
    localStorage.removeItem('token');
    localStorage.removeItem('userImage');
    localStorage.removeItem('username');
}, timeToWaitInMilliseconds);

hotQuizzes()