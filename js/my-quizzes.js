const baseURL = "http://localhost:5000";

const getMyQuizzes = async () => {
    try {
        const res = await myFetch(`${baseURL}/quizzes/owner`);
        const quizzes = res.data;
        console.log(quizzes);
        const quizzesCon = document.querySelector("#quizzes");
        for (const quiz of quizzes) {
            let div = document.createElement("div");
            div.classList.add("quiz");
            if(quiz.isPrivate)
                div.classList.add("private");
            div.dataset.id = quiz._id;
            div.textContent = quiz.name;
            div.addEventListener("click", (event) => {
                window.open(`./quiz.html?id=${quiz._id}`, '_self');
            });
            quizzesCon.append(div);
        }
    } catch (error) {
        console.log(error);
    }
};

getMyQuizzes();