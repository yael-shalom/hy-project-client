const baseURL = "http://localhost:5000";

const getAllQuizzes = async () => {
    try {
        const res = await myFetch(`${baseURL}/quizzes`, 'GET');
        const quizzes = res.data;
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
    const res = await myFetch(`${baseURL}/categories`, 'GET');
    const categories = res.data;
    console.log(categories);
    const categoryCon = document.querySelector("#categories");
    let ul = document.createElement("ul");
    console.log(categories);

    for (const category of categories) {
        let li = document.createElement("li");
        li.textContent = category.name;
        li.dataset.id = category._id;
        li.addEventListener("click", getQuizzesByCategory, event);
        ul.append(li);
    }
    categoryCon.append(ul);
};

const getQuizzesByCategory = async (event) => {
    try {
        console.log(event.target.dataset.id);

        const res = await myFetch(`${baseURL}/categories/${event.target.dataset.id}`, 'GET');
        const category = res.data;
        console.log(category);
        const quizzesObj = category.quizzes;
        const quizzes = [];
        for (const q of quizzesObj) {
            const res = await myFetch(`${baseURL}/quizzes/${q._id}`, 'GET');
            const quiz = res.data;
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