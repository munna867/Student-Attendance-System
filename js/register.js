function handleSignup(event) {
    event.preventDefault();

    const regmail = document.getElementById('regmail').value;
    const regname = document.getElementById('regname').value;
    const regpass = document.getElementById('regpass').value;
    const profilePictureInput = document.getElementById('profilePicture');
    const profilePictureFile = profilePictureInput.files[0];
    
    // Create a new FormData object
    const formData = new FormData();
    formData.append('regmail', regmail);
    formData.append('regname', regname);
    formData.append('regpass', regpass);
    
    if (profilePictureFile) {
        new Compressor(profilePictureFile, {
            quality: 0.7, // Adjust quality as needed (0.6 is 60% quality)
            maxWidth: 800, // Maximum width
            maxHeight: 800, // Maximum height
            success(result) {
                // Convert compressed image to base64 URL
                const reader = new FileReader();
                reader.onloadend = () => {
                    // Get the compressed image URL
                    const imageUrl = reader.result;
                    formData.append('profilePictureUrl', imageUrl);
                    
                    // Post the data
                    postData(formData);
                };
                reader.readAsDataURL(result); // Convert image to base64 URL
            },
            error(err) {
                console.error('Error during image compression:', err);
                alert('Image compression failed. Please try again.');
            }
        });
    } else {
        // Post the data without an image
        formData.append('profilePictureUrl', '/images/profile.png');
        postData(formData);
    }
}

function postData(formData) {
    fetch('http://localhost:3000/signup', {
        method: 'POST',
        body: JSON.stringify({
            regmail: formData.get('regmail'),
            regname: formData.get('regname'),
            regpass: formData.get('regpass'),
            profilePictureUrl: formData.get('profilePictureUrl')
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Signup failed');
        }
        return response.json();
    })
    .then(data => {
        console.log('Success:', data);
        document.getElementById('signupForm').reset();
        alert('Signup successful!');
        window.location.href = 'index.html'; // Redirect to login.html
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Signup failed. Please try again.');
    });
}
