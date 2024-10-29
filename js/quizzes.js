const baseURL = "http://localhost:5000";

const getAllQuizzes = async () => {
    try {
        const res = await fetch(`${baseURL}/quizzes`);
        const quizzes = await res.json();
        console.log(quizzes);
        const quizzesCon = document.querySelector("#quizzes");
        for (const quiz of quizzes) {
            let div = document.createElement("div");
            div.classList.add("quiz");
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

const getAllCategories = async () => {
    const res = await fetch(`${baseURL}/categories`);
    const categories = await res.json();
    console.log(categories);
    const categoryCon = document.querySelector("#categories");
    let ul = document.createElement("ul");
    console.log(categories);

    for (const category of categories) {
        let li = document.createElement("li");
        li.textContent = category.name;
        li.id = category._id;
        li.addEventListener("click", getQuizzesByCategory, event);
        ul.append(li);
    }
    categoryCon.append(ul);
};

const getQuizzesByCategory = async (event) => {
    try {
        console.log(event.target.id);

        const res = await fetch(`${baseURL}/categories/${event.target.id}`);
        const category = await res.json();
        console.log(category);
        const quizzesIds = category.quizzes;
        const quizzes = [];
        for (const id of quizzesIds) {
            const res = await fetch(`${baseURL}/quizzes/${id}`);
            const quiz = await res.json();
            quizzes.push(quiz);
        }

        const quizzesCon = document.querySelector("#quizzes");
        quizzesCon.innerHTML = "";
        for (const quiz of quizzes) {
            if (quiz.isPrivate === false) {
                let div = document.createElement("div");
                div.classList.add("quiz");
                div.dataset.id = quiz._id;
                div.textContent = quiz.name;
                div.addEventListener("click", (event) => {
                    window.open(`./quiz.html?id=${quiz._id}`, '_self');
                });
                quizzesCon.append(div);
            }
        }
    } catch (error) {
        console.log(error);
    }
};