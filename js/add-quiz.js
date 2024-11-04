const _baseURL = "http://localhost:5000";
let _id;
let personalityCategory;

const _searchParams = new URLSearchParams(location.search);
if (_searchParams.has("id")) {
    console.log(_searchParams.get("id"));
    _id = _searchParams.get("id");
    fillFieldsForUpdateQuiz();
}

document.getElementById('quiz-form').addEventListener('submit', function (event) {
    event.preventDefault();

    const quizName = document.getElementById('quiz-name').value;
    const creatorName = document.getElementById('creator-name').value;
    const category = document.getElementById('category').value;

    const questions = [];
    document.querySelectorAll('.question').forEach(questionEl => {
        const questionContent = questionEl.querySelector('.question-content').value;
        const answers = [];

        questionEl.querySelectorAll('.answer').forEach(answerEl => {
            const answerContent = answerEl.querySelector('.answer-content').value;
            const isRight = answerEl.querySelector('.is-right').checked;
            answers.push({ content: answerContent, isRight: isRight });
        });

        questions.push({ content: questionContent, answers: answers });
    });

    const quiz = {
        name: quizName,
        owner: { name: creatorName },
        categories: category,
        questions: questions
    };

    console.log(quiz);
});



function addQuestion() {
    const questionsContainer = document.getElementById('questions-container');
    const questionCount = document.querySelectorAll('.question').length + 1;

    const questionDiv = document.createElement('div');
    questionDiv.classList.add('question');
    questionDiv.innerHTML = `
        <h4>Question ${questionCount}</h4>
        <label>Question Content:</label>
        <input type="text" class="question-content" required><br><br>
        <div class="answers-container">
            <h5>Answers</h5>
            <!-- Answers will be dynamically added here -->
        </div>
        <button type="button" onclick="addAnswer(this)" class="addAnswerBtn">Add Answer</button>
    `;
    questionsContainer.appendChild(questionDiv);
}

function addAnswer(button) {
    const answersContainer = button.parentElement.querySelector('.answers-container');
    const answerCount = answersContainer.querySelectorAll('.answer').length + 1;

    const answerDiv = document.createElement('div');
    answerDiv.classList.add('answer');
    answerDiv.innerHTML = `
        <label>Answer ${answerCount}:</label>
        <input type="text" class="answer-content" required>
        <label>Is Correct:</label>
        <input type="checkbox" class="is-right"><br><br>
    `;
    answersContainer.appendChild(answerDiv);
}


// האזנה לאירוע של שליחת הטופס
document.getElementById('quiz-form').addEventListener('submit', function (event) {
    event.preventDefault();

    // קבלת הנתונים מהטופס
    const quizName = document.getElementById('quiz-name').value;
    const isPrivate = document.getElementById('is-private').checked;
    const creatorName = document.getElementById('creator-name').value;
    const category = document.getElementById('category').value;
    // const category = "67040d0ffb079b2b61e34a30";

    const questions = [];
    document.querySelectorAll('.question').forEach(questionEl => {
        const questionContent = questionEl.querySelector('.question-content').value;
        const answers = [];

        questionEl.querySelectorAll('.answer').forEach(answerEl => {
            const answerContent = answerEl.querySelector('.answer-content').value;
            const isRight = answerEl.querySelector('.is-right').checked;
            answers.push({ content: answerContent, isRight: isRight });
        });

        questions.push({ content: questionContent, answers: answers });
    });

    // בניית אובייקט השאלון
    const quiz = {
        name: quizName,
        isPrivate: isPrivate,
        // owner: { _id: "67214cac139ece36cce06f77", name: creatorName },
        categories: category,
        questions: questions
    };

    // שליחת הנתונים לשרת
    fetch(`${_baseURL}/quizzes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(quiz)
    })
        .then(response => response.json())
        .then(data => {
            console.log('Quiz created:', data);
            alert('Quiz created successfully!');
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Failed to create quiz.');
        });
});

const load = async () => {
    try {
        const res = await fetch(`${_baseURL}/categories`);
        let categories = await res.json();
        personalityCategory = categories.find(c => c.name == "אישיות");
        console.log(personalityCategory);
        categories = categories.filter(category => category._id !== personalityCategory._id);
        console.log(categories);
        const categoriesSelect = document.querySelector("#category");
        for (const category of categories) {
            let option = document.createElement("option");
            option.classList.add("category");
            option.value = category._id;
            option.textContent = category.name;
            categoriesSelect.append(option);
        }
    } catch (error) {
        console.log(error);
    }
};

async function fillFieldsForUpdateQuiz() {
    const res = await fetch(`${_baseURL}/quizzes/${_id}`);//חיבור לדטה בייס
    const quiz = await res.json();//המרת הנתונים לאובייקט
    console.log(quiz);

    const quizName = document.querySelector('#quiz-name');
    const isPrivate = document.querySelector('#is-private');
    const creatorName = document.querySelector('#creator-name');
    const category = document.querySelector('#category');

    quizName.value = quiz.name;
    isPrivate.checked = quiz.isPrivate;
    category.value = quiz.categories;
    for (const question of quiz.questions) {
        addQuestion();
        let questionCon = document.querySelector('.question:last-child');
        const questionInput = questionCon.querySelector('.question-content');
        questionInput.value = question.content;
        for (const answer of question.answers) {
            // const answersCon = document.querySelector('.answers-container:last-child')
            const addAnswerBtn = questionCon.querySelector('.addAnswerBtn')
            addAnswer(addAnswerBtn);
            const answerCon = questionCon.querySelector('.answer:last-child');
            const isChecked = answerCon.querySelector('.is-right');
            isChecked.checked = answer.isRight;
            answerInput = answerCon.querySelector('.answer-content');
            answerInput.value = answer.content;
        }
    }

    const addBtn = document.querySelector('#add-quiz');
    addBtn.classList.add('hide')

    const updateBtn = document.createElement('button');
    updateBtn.textContent = "עדכן שאלון";
    updateBtn.classList.add('.quiz');
    updateBtn.onclick = updateQuiz;
    
    const body = document.querySelector('body');
    body.appendChild(updateBtn);
}

async function updateQuiz(event) {
    const quizId = _id;

    // קבלת הנתונים מהטופס
    const quizName = document.getElementById('quiz-name').value;
    const isPrivate = document.getElementById('is-private').checked;
    const creatorName = document.getElementById('creator-name').value;
    const category = document.getElementById('category').value;

    const questions = [];
    document.querySelectorAll('.question').forEach(questionEl => {
        const questionContent = questionEl.querySelector('.question-content').value;
        const answers = [];

        questionEl.querySelectorAll('.answer').forEach(answerEl => {
            const answerContent = answerEl.querySelector('.answer-content').value;
            const isRight = answerEl.querySelector('.is-right').checked;
            answers.push({ content: answerContent, isRight: isRight });
        });

        questions.push({ content: questionContent, answers: answers });
    });

    // בניית אובייקט השאלון
    const quiz = {
        _id: quizId,
        name: quizName,
        // owner: { _id: "67214cac139ece36cce06f77", name: creatorName },
        categories: category,
        questions: questions,
        isPrivate: isPrivate
    };

    console.log(quiz);


    // שליחת הנתונים לשרת
    fetch(`${_baseURL}/quizzes/${quizId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(quiz)
    })
        .then(response => response.json())
        .then(data => {
            console.log('Quiz updated:', data);
            alert('Quiz updated successfully!');
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Failed to update quiz.');
        });
}

function addSpecialCategories(event) {
    const isPrivate = event.target.checked;
    const categoriesSelect = document.querySelector("#category");
    if (isPrivate) {
        let option = document.createElement("option");
        option.classList.add("category");
        option.value = personalityCategory._id;
        option.textContent = personalityCategory.name;
        categoriesSelect.append(option);
    }
    else {
        const lastChild = categoriesSelect.lastChild;
        if(lastChild.value === personalityCategory._id)
            categoriesSelect.removeChild(lastChild);
    }
}