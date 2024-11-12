const baseURL = "http://localhost:5000";


const searchParams = new URLSearchParams(location.search);
console.log(searchParams.get("type"));
const id = searchParams.get("type");

  


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
//#endregion

onload = ()=>{
    getAllQuizzes();
    getAllCategories();
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
    else {
        const btn = document.querySelector('#enter');
        btn.onclick = ()=>{window.open('../pages/login.html', '_self')};
    }
}