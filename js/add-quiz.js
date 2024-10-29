document.getElementById('quiz-form').addEventListener('submit', function(event) {
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
    // Here you would send the quiz object to the server via fetch or another method.
    // Example:
    // fetch('/api/quizzes', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(quiz)
    // }).then(response => response.json()).then(data => {
    //     console.log('Quiz created:', data);
    // }).catch(error => {
    //     console.error('Error:', error);
    // });
});
 
function addQuestion() {
    const questionsContainer = document.getElementById('questions-container');
    const questionCount = document.querySelectorAll('.question').length + 1;

    const questionDiv = document.createElement('div');
    questionDiv.classList.add('question');
    questionDiv.innerHTML = `
        <h4>Question ${questionCount}</h4>
        <label>Q
        uestion Content:</label>
        <input type="text" class="question-content" required><br><br>
        <div class="answers-container">
            <h5>Answers</h5>
            <!-- Answers will be dynamically added here -->
        </div>
        <button type="button" onclick="addAnswer(this)">Add Answer</button><br><br>
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
document.getElementById('quiz-form').addEventListener('submit', function(event) {
    event.preventDefault();

    // קבלת הנתונים מהטופס
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

    // בניית אובייקט השאלון
    const quiz = {
        name: quizName,
        owner: { name: creatorName },
        categories: category,
        questions: questions
    };

    // שליחת הנתונים לשרת
    fetch('/api/quizzes', {
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
