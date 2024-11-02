const baseURL = "http://localhost:5000";

const getMyQuizzes = async (id) => {
    try {
        const res = await fetch(`${baseURL}/quizzes/owner/${id}`);
        const quizzes = await res.json();
        console.log(quizzes);
        const quizzesCon = document.querySelector("#quizzes");
        for (const quiz of quizzes) {
            let div = document.createElement("div");
            div.classList.add("quiz");
            div.dataset.id = quiz._id;
            div.textContent = quiz.name;
            div.addEventListener("click", (event) => {
                window.open(`./quiz.html?id=${quiz._id}`, "_self");
            });
            quizzesCon.append(div);
        }
    } catch (error) {
        console.log(error);
    }
};

onload = () => {
    getMyQuizzes(new URLSearchParams(window.location.search).get('id'));
}