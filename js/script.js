document.addEventListener('DOMContentLoaded', function () {
    const menuButton = document.getElementById('menuButton'); // Adjusted to use ID
    const sidebar = document.querySelector('.sidebar');

    menuButton.addEventListener('click', function () {
        sidebar.classList.toggle('active');
    });

    // Optional: Close the sidebar when clicking outside of it
    document.addEventListener('click', function (event) {
        if (!sidebar.contains(event.target) && !menuButton.contains(event.target)) {
            sidebar.classList.remove('active');
        }
    });
});




//======================== JavaScript to toggle dark mode and Dashboard changing as per requiremnet=====================================

document.addEventListener('DOMContentLoaded', () => {
    // Toggle dark mode and maintain theme state
    const themeCheckbox = document.querySelector('.theme-checkbox');
    const body = document.body;
    const sidebar = document.querySelector('.sidebar');

    // Load theme from local storage
    if (localStorage.getItem('theme') === 'dark') {
        body.classList.add('dark-mode');
        sidebar.classList.add('dark-mode');
        themeCheckbox.checked = true;
    } else {
        body.classList.remove('dark-mode');
        sidebar.classList.remove('dark-mode');
        themeCheckbox.checked = false;
    }

    themeCheckbox.addEventListener('change', () => {
        if (themeCheckbox.checked) {
            body.classList.add('dark-mode');
            sidebar.classList.add('dark-mode');
            localStorage.setItem('theme', 'dark');
        } else {
            body.classList.remove('dark-mode');
            sidebar.classList.remove('dark-mode');
            localStorage.setItem('theme', 'light');
        }
    });

    // Load class data on page load
    loadClasses();
});

// JavaScript for adding classes and synchronizing class count
let classId = parseInt(localStorage.getItem('classId')) || 1;

function addClass() {
    const className = document.getElementById('className').value;
    const teacherName = document.getElementById('teacherName').value;
    const studentLimit = document.getElementById('studentLimit').value;

    if (!className || !teacherName || !studentLimit) {
        alert('Please fill out all fields');
        return;
    }

    // Create class object
    const newClass = {
        id: classId,
        name: className,
        teacher: teacherName,
        limit: studentLimit
    };

    // Add class to local storage
    let classes = JSON.parse(localStorage.getItem('classes')) || [];
    classes.push(newClass);
    localStorage.setItem('classes', JSON.stringify(classes));

    // Update classId in local storage
    localStorage.setItem('classId', ++classId);

    // Reset form and update UI
    document.getElementById('classForm').reset();
    loadClasses();
}

function generateReport(button) {
    const row = button.parentElement.parentElement;
    const classId = row.cells[0].innerHTML;
    const className = row.cells[1].innerHTML;
    const teacherName = row.cells[2].innerHTML;
    const studentLimit = row.cells[3].innerHTML;

    alert(`Class ID: ${ classId }\nClass Name: ${ className }\nTeacher: ${ teacherName }\nStudent Limit: ${ studentLimit }`);
}

function deleteClass(button) {
    const row = button.parentElement.parentElement;
    const classIdToDelete = row.cells[0].innerHTML;

    // Remove class from local storage
    let classes = JSON.parse(localStorage.getItem('classes')) || [];
    classes = classes.filter(cls => cls.id != classIdToDelete);
    localStorage.setItem('classes', JSON.stringify(classes));

    // Update UI
    loadClasses();
}

function loadClasses() {
    const tableBody = document.querySelector('#classesTable tbody');
    tableBody.innerHTML = '';

    let classes = JSON.parse(localStorage.getItem('classes')) || [];
    classes.forEach(cls => {

        const newRow = tableBody.insertRow();
        newRow.insertCell(0).innerHTML = cls.id;
        newRow.insertCell(1).innerHTML = cls.name;
        newRow.insertCell(2).innerHTML = cls.teacher;
        newRow.insertCell(3).innerHTML = cls.limit;
        newRow.insertCell(4).innerHTML = `
            <button class="report"  style="background-color: #21c0ce; color: white; onclick="generateReport(this)">Report</button>
            <button class="delete-report" onclick="deleteClass(this)" style="background-color: red; color: white;">Delete</button>
            ;`
    });

    // Update class count on dashboard
    updateClassCount();
}




function updateClassCount() {
    const classCount = (JSON.parse(localStorage.getItem('classes')) || []).length;
    localStorage.setItem('classCount', classCount);

    const dashboardClassCount = document.querySelector('#class-count');
    if (dashboardClassCount) {
        dashboardClassCount.textContent = localStorage.getItem('classCount') || 0;
    }
}

// Set class count on page load
document.addEventListener('DOMContentLoaded', () => {
    const classCount = localStorage.getItem('classCount') || 0;
    const dashboardClassCount = document.querySelector('#class-count');
    if (dashboardClassCount) {
        dashboardClassCount.textContent = classCount;
    }
});



// // js code for making input into upper case
// const teacherNameInput = document.getElementById('className');

// // Add an event listener to convert the input to uppercase as the user types
// teacherNameInput.addEventListener('input', function () {
//     this.value = this.value.toUpperCase();
// });









// js code for profile changing 

async function fetchUserProfile() {
    try {
        const username = localStorage.getItem('username'); // Get username from localStorage
        if (!username) {
            throw new Error('No user logged in');
        }

        const response = await fetch('http://localhost:3000/signup');
        if (!response.ok) {
            throw new Error('Failed to fetch user data');
        }

        const users = await response.json();
        const user = users.find(user => user.regname === username);

        if (user) {
            const profilePictureUrl = user.profilePictureUrl || '/images/profile.png';
            updateProfilePicture(profilePictureUrl);
        } else {
            console.error('User not found');
        }
    } catch (error) {
        console.error('Error fetching user profile:', error);
    }
}

// Function to update the profile picture in the navbar
function updateProfilePicture(url) {
    const profileImage = document.getElementById('profileImage');
    profileImage.src = url;
}

// Fetch and update profile picture on page load
document.addEventListener('DOMContentLoaded', fetchUserProfile);



    
document.getElementById('logoutButton').addEventListener('click', function() {
    alert('Log Out successful!');
    window.location.href = 'index.html'; // Redirect to home.html
});


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

// Function to fetch teachers and display only the name and department
function loadTeachers() {
    fetch('http://localhost:3000/teacher')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const tableBody = document.querySelector('#teachers tbody');
            tableBody.innerHTML = ''; // Clear existing rows before adding new ones

            // Filter data to display only teacher name and department
            data.forEach(teacher => {
                const row = document.createElement('tr');
                
                // Append only teacher name and department
                const nameCell = document.createElement('td');
                nameCell.textContent = teacher.tName;

                const deptCell = document.createElement('td');
                deptCell.textContent = teacher.Department;

                // Append cells to row
                row.appendChild(nameCell);
                row.appendChild(deptCell);

                // Append row to the table
                tableBody.appendChild(row);
            });
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}

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

// Call loadTeachers function when the page is loaded
window.addEventListener('load', loadTeachers,loadClass,loadStudents);









