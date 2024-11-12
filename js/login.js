const baseURL = "http://localhost:5000";
let token;
let userName;

document.getElementById('login-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    try {
        let path = event.submitter.id === 'signIn'? 'signin':'signup';
        const fileInput = document.getElementById('fileInput');
        const file = fileInput.files[0];
        const formData = new FormData(event.target);
        formData.append('imgUrl', file);

        // שליחת הנתונים לשרת
        const res = await myFetch(`${baseURL}/users/${path}`, 'POST',{
            body: formData
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
        localStorage.setItem('isLogin', true);
        localStorage.setItem('userImage', data.userImg);
        alert('Login successful!');
        window.open('../pages/quizzes.html?isMy=false', '_self');

    }
    catch (error) {

        console.error('Error:', error);
        alert('An error occurred. Please try again later.');
    }

});

//close the login page by click on the background of the page
document.addEventListener('DOMContentLoaded', function() {
    const body = document.querySelector('body');
    body.addEventListener('click', function(event) {
        if (event.target === body) {
            history.back();
        }
    });
});
