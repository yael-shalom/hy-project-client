// Function to add a new question dynamically
function addQuestion() {
    const questionsContainer = document.getElementById('questionsContainer');
    const questionCount = questionsContainer.children.length;

    const questionDiv = document.createElement('div');
    questionDiv.innerHTML = `
        <h4>Question ${questionCount + 1}</h4>
        <label for="questionContent${questionCount}">Content:</label>
        <input type="text" id="questionContent${questionCount}" name="questionContent" required><br>

        <div class="answersContainer" id="answersContainer${questionCount}">
            <h5>Answers</h5>
        </div>
        <button type="button" onclick="addAnswer(${questionCount})">Add Answer</button><br>
    `;
    questionsContainer.appendChild(questionDiv);
}

// Function to add an answer to a specific question
function addAnswer(questionIndex) {
    const answersContainer = document.getElementById(`answersContainer${questionIndex}`);
    const answerCount = answersContainer.children.length;

    const answerDiv = document.createElement('div');
    answerDiv.innerHTML = `
        <label for="answerContent${questionIndex}_${answerCount}">Answer:</label>
        <input type="text" id="answerContent${questionIndex}_${answerCount}" name="answerContent" required><br>

        <label for="isRight${questionIndex}_${answerCount}">Is Correct:</label>
        <input type="radio" id="isRight${questionIndex}_${answerCount}" name="isRight${questionIndex}" value="${answerCount}" required><br>
    `;
    answersContainer.appendChild(answerDiv);
}

// Function to handle form submission
document.getElementById('quizForm').addEventListener('submit', async function (event) {
    event.preventDefault(); // Prevent the form from reloading the page

    const quizData = {
        name: document.getElementById('name').value,
        owner: document.getElementById('ownerName').value,
        category: document.getElementById('categories').value,
        questions: []
    };

    const questionsContainer = document.getElementById('questionsContainer');
    for (let i = 0; i < questionsContainer.children.length; i++) {
        const questionDiv = questionsContainer.children[i];
        const questionContent = document.getElementById(`questionContent${i}`).value;

        const answers = [];
        const answersContainer = document.getElementById(`answersContainer${i}`);
        for (let j = 0; j < answersContainer.children.length; j++) {
            const answerContent = document.getElementById(`answerContent${i}_${j}`).value;
            const isRight = document.getElementById(`isRight${i}_${j}`).checked;
            answers.push({
                content: answerContent,
                isRight: isRight
            });
        }

        quizData.questions.push({
            content: questionContent,
            answers: answers
        });
    }

    // Send the data to the server
    try {
        const response = await fetch('/api/quizzes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(quizData)
        });

        if (response.ok) {
            alert('Quiz added successfully!');
        } else {
            alert('Error adding quiz.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while adding the quiz.');
    }
});
