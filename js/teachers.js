// Function to handle form submission
function addTeachers(event) {
    event.preventDefault();

    // Get form data
    const tName = document.getElementById('t-Name').value.trim();
    const Department = document.getElementById('Department').value;
    const contact = document.getElementById('contact').value;
    const subject = document.getElementById('subject').value;
    const email = document.getElementById('email').value;
    const Address = document.getElementById('Address').value;

    // Fetch current list of teachers to check for duplicates
    fetch('http://localhost:3000/teacher')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(teachers => {
            // Check if the teacher name already exists
            const isDuplicate = teachers.some(teacher => teacher.tName.toLowerCase() === tName.toLowerCase());

            if (isDuplicate) {
                alert("Teacher name already exists. Please use a different name.");
            } else {
                // If no duplicate, proceed with adding the new teacher
                const newTeacher = {
                    tName: tName,
                    Department: Department,
                    contact: contact,
                    subject: subject,
                    email: email,
                    Address: Address
                };

                // Send POST request to JSON Server
                fetch('http://localhost:3000/teacher', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(newTeacher)
                })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error(`HTTP error! Status: ${response.status}`);
                        }
                        return response.json();
                    })
                    .then(() => {
                        console.log('Data posted successfully');
                        document.getElementById('teacherForm').reset(); // Clear the form
                        loadTeachers(); // Reload the teachers to include the new entry
                    })
                    .catch(error => {
                        console.error('Error posting data:', error);
                    });

                // Update the total count of teachers in localStorage
                updateTeacherCount();
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}


// Function to fetch teachers and display them in the table
function loadTeachers() {
    fetch('http://localhost:3000/teacher')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const tableBody = document.querySelector('#teachersTable tbody');
            if (!tableBody) {
                console.error('Table body element not found');
                return;
            }

            tableBody.innerHTML = ''; // Clear existing rows

            data.forEach(teacher => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${teacher.tName}</td>
                    <td>${teacher.email}</td>
                    <td>${teacher.contact}</td>
                    <td><button style="cursor:pointer; background:red" onclick="deleteTeacher(${teacher.id})">Delete</button></td>
                `;
                tableBody.appendChild(row);
            });

            // Update localStorage and display teacher count after loading teachers
            updateTeacherCount();
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}

// Function to delete a teacher
function deleteTeacher(id) {
    fetch(`http://localhost:3000/teacher/${id}`, {
        method: 'DELETE'
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(() => {
            console.log('Teacher deleted:', id);
            loadTeachers(); // Reload the teachers after deletion
        })
        .catch(error => {
            console.error('Error deleting data:', error);
        });
}

// Function to update teacher count in localStorage
function updateTeacherCount() {
    fetch('http://localhost:3000/teacher')
        .then(response => response.json())
        .then(data => {
            // Update localStorage with the new teacher count
            const teacherCount1 = data.length;
            localStorage.setItem('teacherCount1', teacherCount1);

            // Ensure the count is zero if there are no teachers
            if (teacherCount1 === 0) {
                localStorage.setItem('teacherCount1', 0);
            }

            displayTeachersCount(); // Update the displayed count
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}

// Function to display the teacher count on the homepage
function displayTeachersCount() {
    let teacherCount1 = localStorage.getItem('teacherCount1');
    if (!teacherCount1) {
        teacherCount1 = 0;
    }
    document.getElementById('teacherCount1').textContent = teacherCount1;
}

window.addEventListener('load', () => {
    loadTeachers();
    displayTeachersCount();
});





// teacher.js

// function addTeachers(event) {
//     event.preventDefault();

//     const tName = document.getElementById('t-Name').value;
//     const Department = document.getElementById('Department').value;
//     const contact = document.getElementById('contact').value;
//     const subject = document.getElementById('subject').value;
//     const email = document.getElementById('email').value;
//     const Address = document.getElementById('Address').value;

//     const data = { tName, Department, contact, subject, email, Address };

//     fetch('http://localhost:3000/teacher', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(data)
//     })
//     .then(() => {
//         document.getElementById('teacherForm').reset();
//         loadTeachers();
//         updateTeacherCount();
//     })
//     .catch(console.error);
// }

// function loadTeachers() {
//     fetch('http://localhost:3000/teacher')
//     .then(response => response.json())
//     .then(data => {
//         const tableBody = document.querySelector('#teachersTable tbody');
//         tableBody.innerHTML = '';
//         data.forEach(teacher => {
//             const row = `<tr>
//                 <td>${teacher.tName}</td>
//                 <td>${teacher.email}</td>
//                 <td>${teacher.contact}</td>
//                 <td><button style="cursor:pointer; background:red" onclick="deleteTeacher(${teacher.id})">Delete</button></td>
//             </tr>`;
//             tableBody.insertAdjacentHTML('beforeend', row);
//         });
//         updateTeacherCount();
//     })
//     .catch(console.error);
// }

// function deleteTeacher(id) {
//     fetch(`http://localhost:3000/teacher/${id}`, { method: 'DELETE' })
//     .then(() => {
//         loadTeachers();
//         updateTeacherCount();
//     })
//     .catch(console.error);
// }

// function updateTeacherCount() {
//     fetch('http://localhost:3000/teacher')
//     .then(response => response.json())
//     .then(data => {
//         const teacherCount1 = data.length;
//         localStorage.setItem('teacherCount1', teacherCount1);
//         displayTeachersCount();
//     })
//     .catch(console.error);
// }

// function displayTeachersCount() {
//     const teacherCount1 = localStorage.getItem('teacherCount1') || 0;
//     document.getElementById('teacherCount1').textContent = teacherCount1;
// }

// window.addEventListener('load', () => {
//     loadTeachers();
//     displayTeachersCount();
// });

