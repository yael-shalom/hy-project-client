const baseURL = 'http://localhost:5000'

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
    for (const category of categories) {
        let li = document.createElement("li");
        li.textContent = category.name;
        ul.append(li);
    }
    categoryCon.append(ul);
};