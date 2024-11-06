const baseURL = "http://localhost:5000";
let token;
let userName;

document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // שליחת הנתונים לשרת
    fetch(`${baseURL}/users/signin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    })
    .then(response => response.json())
    .then(data => {
            token = data.token;
            userName = data.username;
            alert('Login successful!');
            window.open('../pages/frame.html?page=quizzes', '_self');
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred. Please try again later.');
    });
});
