// Function to handle form submission
function addStudent(event) {
    // Prevent form from submitting the traditional way
    event.preventDefault();

    // Get form data
    const firstName = document.getElementById('firstName').value.trim();
    const fatherName = document.getElementById('fatherName').value.trim();
    const className = document.getElementById('className').value.trim();

    // Fetch current list of students to check for duplicates
    fetch('http://localhost:3000/students')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(students => {
            // Check if the student name already exists (by firstName and fatherName)
            const isDuplicate = students.some(student => 
                student.firstName.toLowerCase() === firstName.toLowerCase() &&
                student.fatherName.toLowerCase() === fatherName.toLowerCase()
            );

            if (isDuplicate) {
                alert("Student with this name already exists. Please use a different name.");
                document.getElementById('studentForm').reset(); // Clear the form
            } else {
                // If no duplicate, proceed with adding the new student
                const newStudent = {
                    firstName: firstName,
                    fatherName: fatherName,
                    className: className
                };

                // Send POST request to JSON Server
                fetch('http://localhost:3000/students', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(newStudent)
                })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error(`HTTP error! Status: ${response.status}`);
                        }
                        return response.json();
                    })
                    .then(() => {
                        console.log('Student added successfully');
                        document.getElementById('studentForm').reset(); // Clear the form
                        loadStudents(); // Reload the students list
                    })
                    .catch(error => {
                        console.error('Error posting data:', error);
                    });

                // Update student count in localStorage
                updateStudentCount();
            }
        })
        .catch(error => {
            console.error('Error fetching students:', error);
        });
}


// Function to fetch classes and display them in the table
function loadStudents() {
    fetch('http://localhost:3000/students')
        .then(response => response.json())
        .then(data => {
            const tableBody = document.querySelector('#studentTable tbody');
            tableBody.innerHTML = ''; // Clear existing rows

            data.forEach(studentItem => {
                // Create a new row
                const row = document.createElement('tr');

                // Create and append cells
                row.innerHTML = `
                    <td>${studentItem.id}</td>
                    <td>${studentItem.firstName}</td>
                    <td>${studentItem.fatherName}</td>
                   <td>${studentItem.className}</td>
                    <td><button style="cursor:pointer; background:red" onclick="deleteStudent('${studentItem.id}')">Delete</button></td>
                    
                `;
             // Append row to the table body
                tableBody.appendChild(row);
            });

            updateStudentCount();
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}

// Function to delete a class
function deleteStudent(id) {
    fetch(`http://localhost:3000/students/${id}`, {
        method: 'DELETE'
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(() => {
            console.log('Class deleted:', id);
            loadStudents(); // Reload the classes after deletion
        })
        .catch(error => {
            console.error('Error deleting data:', error);
        });

   
}

// Function to update teacher count in localStorage
function updateStudentCount() {
    fetch('http://localhost:3000/students')
        .then(response => response.json())
        .then(data => {
            // Update localStorage with the new teacher count
            const studentCount1 = data.length;
            localStorage.setItem('studentCount1', studentCount1);

            // Ensure the count is zero if there are no teachers
            if (studentCount1 === 0) {
                localStorage.setItem('studentCount1', 0);
            }

            displayStudentCount(); // Update the displayed count
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}
// Function to display the teacher count on the homepage
function displayStudentCount() {
    let studentCount1 = localStorage.getItem('studentCount1');
    if (!studentCount1) {
        studentCount1 = 0;
    }
    document.getElementById('studentCount1').textContent = studentCount1;
}

window.addEventListener('load', () => {
    loadStudents();
    displayStudentCount();
});






// // student.js

// function addStudent(event) {
//     event.preventDefault();

//     const firstName = document.getElementById('firstName').value;
//     const fatherName = document.getElementById('fatherName').value;
//     const className = document.getElementById('className').value;

//     const data = { firstName, fatherName, className };

//     fetch('http://localhost:3000/students', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(data)
//     })
//     .then(() => {
//         document.getElementById('studentForm').reset();
//         loadStudents();
//         updateStudentCount();
//     })
//     .catch(console.error);
// }

// function loadStudents() {
//     fetch('http://localhost:3000/students')
//     .then(response => response.json())
//     .then(data => {
//         const tableBody = document.querySelector('#studentTable tbody');
//         tableBody.innerHTML = '';
//         data.forEach(studentItem => {
//             const row = `<tr>
//                 <td>${studentItem.id}</td>
//                 <td>${studentItem.firstName}</td>
//                 <td>${studentItem.fatherName}</td>
//                 <td>${studentItem.className}</td>
//                 <td><button style="cursor:pointer; background:red" onclick="deleteStudent(${studentItem.id})">Delete</button></td>
//             </tr>`;
//             tableBody.insertAdjacentHTML('beforeend', row);
//         });
//         updateStudentCount();
//     })
//     .catch(console.error);
// }

// function deleteStudent(id) {
//     fetch(`http://localhost:3000/students/${id}`, { method: 'DELETE' })
//     .then(() => {
//         loadStudents();
//         updateStudentCount();
//     })
//     .catch(console.error);
// }

// function updateStudentCount() {
//     fetch('http://localhost:3000/students')
//     .then(response => response.json())
//     .then(data => {
//         const studentCount1 = data.length;
//         localStorage.setItem('studentCount1', studentCount1);
//         displayStudentCount();
//     })
//     .catch(console.error);
// }

// function displayStudentCount() {
//     const studentCount1 = localStorage.getItem('studentCount1') || 0;
//     document.getElementById('studentCount1').textContent = studentCount1;
// }

// window.addEventListener('load', () => {
//     loadStudents();
//     displayStudentCount();
// });
