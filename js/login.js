function handleLogin(event) {
    event.preventDefault();
    const loginEmail = document.getElementById('loginEmail').value;
    const loginPassword = document.getElementById('loginPassword').value;

    fetch('http://localhost:3000/signup')
        .then(response => response.json())
        .then(users => {
            const user = users.find(user => user.regmail === loginEmail && user.regpass === loginPassword);
            
            if (user) {
                // Successful login
                localStorage.setItem('username', user.regname); // Store username in localStorage
                alert('Login successful!');
                window.location.href = 'home.html'; // Redirect to home.html
            } else {
                alert('Login failed. Please check your email and password.');
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            alert('Login failed. Please try again.');
        });
}

document.getElementById('loginForm').addEventListener('submit', handleLogin);
