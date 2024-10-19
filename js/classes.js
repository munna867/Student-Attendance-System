
// Function to handle form submission
function addClass(event) {
    // Prevent the default form submission
    event.preventDefault();

    // Get form data
    const className = document.getElementById('className').value.trim();
    const teacherName = document.getElementById('teacherName').value;
    const studentLimit = document.getElementById('studentLimit').value;

    // Fetch current list of classes to check for duplicates
    fetch('http://localhost:3000/classes')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(classes => {
            // Check if the class name already exists
            const isDuplicate = classes.some(cls => cls.className.toLowerCase() === className.toLowerCase());

            if (isDuplicate) {
                alert("Class Already Created");
            } else {
                // If no duplicate, proceed with adding the new class
                const newClass = {
                    className: className,
                    teacherName: teacherName,
                    studentLimit: studentLimit
                };

                // Send POST request to JSON Server
                fetch('http://localhost:3000/classes', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(newClass)
                })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error(`HTTP error! Status: ${response.status}`);
                        }
                        return response.json();
                    })
                    .then(() => {
                        console.log('Data posted successfully');
                        document.getElementById('classForm').reset(); // Clear the form
                        loadClass(); // Reload the classes to include the new entry
                    })
                    .catch(error => {
                        console.error('Error posting data:', error);
                    });

                // Update the total count of classes in localStorage
                updateClassCount();
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}


// Function to fetch teachers and display them in the table
function loadClass() {
    fetch('http://localhost:3000/classes')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const tableBody = document.querySelector('#classesTable tbody');
            if (!tableBody) {
                console.error('Table body element not found');
                return;
            }

            tableBody.innerHTML = ''; // Clear existing rows

            data.forEach(classItem => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${classItem.id}</td>
                    <td>${classItem.className}</td>
                    <td>${classItem.teacherName}</td>
                     <td>${classItem.studentLimit}</td>
                    <td><button style="cursor:pointer; background:red" onclick="deleteClass(${classItem.id})">Delete</button></td>
                `;
                tableBody.appendChild(row);
            });

            // Update localStorage and display teacher count after loading teachers
            updateClassCount();
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}

// Function to delete a teacher
function deleteClass(id) {
    fetch(`http://localhost:3000/classes/${id}`, {
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
            loadClass(); // Reload the teachers after deletion
        })
        .catch(error => {
            console.error('Error deleting data:', error);
        });
}

// Function to update teacher count in localStorage
function updateClassCount() {
    fetch('http://localhost:3000/classes')
        .then(response => response.json())
        .then(data => {
            // Update localStorage with the new teacher count
            const classCount1 = data.length;
            localStorage.setItem('classCount1', classCount1);

            // Ensure the count is zero if there are no teachers
            if (classCount1 === 0) {
                localStorage.setItem('classCount1', 0);
            }

            displayClassCount(); // Update the displayed count
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}

// Function to display the teacher count on the homepage
function displayClassCount() {
    let classCount1 = localStorage.getItem('classCount1');
    if (!classCount1) {
        classCount1 = 0;
    }
    document.getElementById('classCount1').textContent = classCount1;
}

window.addEventListener('load', () => {
    loadClass();
    displayClassCount();
});




// class.js

// function addClass(event) {
//     event.preventDefault();

//     const className = document.getElementById('className').value;
//     const teacherName = document.getElementById('teacherName').value;
//     const studentLimit = document.getElementById('studentLimit').value;

//     const data = { className, teacherName, studentLimit };

//     fetch('http://localhost:3000/classes', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(data)
//     })
//     .then(() => {
//         document.getElementById('classForm').reset();
//         loadClass();
//         updateClassCount();
//     })
//     .catch(console.error);
// }

// function loadClass() {
//     fetch('http://localhost:3000/classes')
//     .then(response => response.json())
//     .then(data => {
//         const tableBody = document.querySelector('#classesTable tbody');
//         tableBody.innerHTML = '';
//         data.forEach(classItem => {
//             const row = `<tr>
//                 <td>${classItem.id}</td>
//                 <td>${classItem.className}</td>
//                 <td>${classItem.teacherName}</td>
//                 <td>${classItem.studentLimit}</td>
//                 <td><button style="cursor:pointer; background:red" onclick="deleteClass(${classItem.id})">Delete</button></td>
//             </tr>`;
//             tableBody.insertAdjacentHTML('beforeend', row);
//         });
//         updateClassCount();
//     })
//     .catch(console.error);
// }

// function deleteClass(id) {
//     fetch(`http://localhost:3000/classes/${id}`, { method: 'DELETE' })
//     .then(() => {
//         loadClass();
//         updateClassCount();
//     })
//     .catch(console.error);
// }

// function updateClassCount() {
//     fetch('http://localhost:3000/classes')
//     .then(response => response.json())
//     .then(data => {
//         const classCount1 = data.length;
//         localStorage.setItem('classCount1', classCount1);
//         displayClassCount();
//     })
//     .catch(console.error);
// }

// function displayClassCount() {
//     const classCount1 = localStorage.getItem('classCount1') || 0;
//     document.getElementById('classCount1').textContent = classCount1;
// }

// window.addEventListener('load', () => {
//     loadClass();
//     displayClassCount();
// });
