const baseURL = "http://localhost:5000";

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
            window.open('../pages/quizzes.html', '_self');
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

onload = () => {
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
        btn.onclick = () => { window.open('../pages/login.html', '_self') };
    }
}
//#endregion