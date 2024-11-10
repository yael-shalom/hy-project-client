const baseURL = "http://localhost:5000";
let token;
let userName;

document.getElementById('login-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    try {
        const email = document.getElementById('email').value;
        const name = document.getElementById('name').value;
        const password = document.getElementById('password').value;
        let path = event.submitter.id === 'signIn'? 'signin':'signup';

        // שליחת הנתונים לשרת
        const res = await myFetch(`${baseURL}/users/${path}`, 'POST',{
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, name, password })
        })
        
        console.log(res);

        const data = res.data;
        console.log(data);
        
        if (!res.ok)
            throw new Error(data);

        token = data.token;
        userName = data.username;
        localStorage.setItem('token', token);
        localStorage.setItem('username', userName);
        alert('Login successful!');
        window.open('../pages/frame.html?page=quizzes', '_self');

    }
    catch (error) {

        console.error('Error:', error);
        alert('An error occurred. Please try again later.');
    }

});
