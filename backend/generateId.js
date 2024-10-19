// const fs = require('fs');
// const path = require('path');

// const dbPath = path.join(__dirname, 'db.json');

// // Function to get the next ID
// function getNextId() {
//     const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
//     const nextId = db.nextId || 1;
//     return nextId;
// }

// // Function to increment and save the next ID
// function incrementNextId() {
//     const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
//     db.nextId = (db.nextId || 1) + 1;
//     fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
// }

// // Export the functions
// module.exports = {
//     getNextId,
//     incrementNextId
// };
