const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(express.json());
app.use(express.static('public')); // Serve static files (e.g., images)

app.post('/signup', upload.single('profileImage'), (req, res) => {
    const { regmail, regname, regpass } = req.body;
    const profileImage = req.file ? `/uploads/${req.file.filename}` : null;

    // Save user data to your database
    const newUser = { regmail, regname, regpass, profilePictureUrl: profileImage };

    // Example of saving to a file (you should use a real database)
    fs.readFile('db.json', (err, data) => {
        if (err) throw err;
        const db = JSON.parse(data);
        db.users.push(newUser);
        fs.writeFile('db.json', JSON.stringify(db, null, 2), err => {
            if (err) throw err;
            res.json(newUser);
        });
    });
});

app.listen(3000, () => console.log('Server running on port 3000'));
