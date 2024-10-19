// Function to fetch classes and populate the dropdown
function populateClassDropdown() {
    fetch('http://localhost:3000/classes')
        .then(response => response.json())
        .then(data => {
            const selectClassElement = document.getElementById('select-class');
            if (!selectClassElement) {
                console.error('Select element not found');
                return;
            }

            // Clear existing options
            selectClassElement.innerHTML = '';

            // Add a default option
            const defaultOption = document.createElement('option');
            defaultOption.value = '';
            defaultOption.textContent = 'Select Class';
            selectClassElement.appendChild(defaultOption);

            // Populate dropdown with classes
            data.forEach(classItem => {
                const option = document.createElement('option');
                option.value = classItem.className;
                option.textContent = classItem.className;
                selectClassElement.appendChild(option);
            });

            // Restore stored form data (class, attendance type, date)
            restoreFormData();
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}

// Function to update display span with selected values
function updateDisplay() {
    const classSelect = document.getElementById('select-class');
    const attendanceType = document.getElementById('attendance-type');
    const attendanceDate = document.getElementById('attendance-date');
    const displaySpan = document.getElementById('display-span');

    const selectedClass = classSelect.value || 'No class selected';
    const selectedType = attendanceType.value || 'No type selected';
    const selectedDate = attendanceDate.value || 'No date selected';

    displaySpan.textContent = `${selectedClass} / ${selectedType} / ${selectedDate}`;
}

// Function to load students and display them in the table
function loadStudents() {
    fetch('http://localhost:3000/students')
        .then(response => response.json())
        .then(data => {
            const classSelect = document.getElementById('select-class').value;
            const filteredStudents = classSelect ? data.filter(student => student.className === classSelect) : data;

            const tableBody = document.querySelector('#studentTable tbody');
            tableBody.innerHTML = ''; // Clear existing rows

            filteredStudents.forEach(studentItem => {
                // Create a new row
                const row = document.createElement('tr');

                // Create and append cells with radio buttons for Present and Absent
                row.innerHTML = `
                    <td>${studentItem.id}</td>
                    <td>${studentItem.firstName}</td>
                    <td>${studentItem.className}</td>
                    <td><input type="radio" class="attendance-radio present-radio" name="attendance-${studentItem.id}" data-id="${studentItem.id}" value="present"></td>
                    <td><input type="radio" class="attendance-radio absent-radio" name="attendance-${studentItem.id}" data-id="${studentItem.id}" value="absent"></td>
                `;
                tableBody.appendChild(row);

                // Retrieve stored attendance for the student and apply it
                applyStoredAttendance(studentItem.id);
            });

            // Add event listeners for radio buttons
            handleCheckboxChange();
            addSearchFunctionality(); // Add search functionality
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}

// Function to handle the Take Attendance button click
function handleTakeAttendance(event) {
    event.preventDefault(); // Prevent the default form submission behavior

    const classSelect = document.getElementById('select-class');
    const attendanceType = document.getElementById('attendance-type');
    const attendanceDate = document.getElementById('attendance-date');

    if (classSelect.value === '' || attendanceDate.value === '') {
        alert('Please select a class and a valid date.');
        return;
    }

    // Save the selected class, attendance type, and date to localStorage
    const formData = {
        selectedClass: classSelect.value,
        selectedType: attendanceType.value,
        selectedDate: attendanceDate.value
    };
    localStorage.setItem('formData', JSON.stringify(formData));

    // Display attendance table
    loadStudents();
    // Call the function to update the progress bar
    updateAttendanceProgress();
}

// Function to update the progress bar based on attendance
function updateAttendanceProgress() {
    const classSelect = document.getElementById('select-class').value;

    fetch('http://localhost:3000/students')
        .then(response => response.json())
        .then(data => {
            const filteredStudents = classSelect ? data.filter(student => student.className === classSelect) : [];
            const totalStudents = filteredStudents.length;

            const presentCount = filteredStudents.reduce((count, student) => {
                const presentRadio = document.querySelector(`input[name="attendance-${student.id}"][value="present"]`);
                return presentRadio.checked ? count + 1 : count;
            }, 0);

            // Calculate percentage
            const attendancePercentage = totalStudents > 0 ? (presentCount / totalStudents) * 100 : 0;

            // Update the progress bar
            const progressBar = document.querySelector('.attendance-progress-bar');
            progressBar.style.width = `${attendancePercentage}%`;
            progressBar.textContent = `${Math.round(attendancePercentage)}% Attendance`;
        })
        .catch(error => {
            console.error('Error fetching student data:', error);
        });
}

// Function to restore saved form data from localStorage
function restoreFormData() {
    const storedFormData = JSON.parse(localStorage.getItem('formData'));

    if (storedFormData) {
        document.getElementById('select-class').value = storedFormData.selectedClass;
        document.getElementById('attendance-type').value = storedFormData.selectedType;
        document.getElementById('attendance-date').value = storedFormData.selectedDate;

        updateDisplay();
    }
}

// Function to apply stored attendance status to radio buttons
function applyStoredAttendance(studentId) {
    const storedAttendance = JSON.parse(localStorage.getItem('attendanceStatus'));

    if (storedAttendance && storedAttendance[studentId]) {
        const presentRadio = document.querySelector(`input[name="attendance-${studentId}"][value="present"]`);
        const absentRadio = document.querySelector(`input[name="attendance-${studentId}"][value="absent"]`);

        if (presentRadio && absentRadio) {
            presentRadio.checked = storedAttendance[studentId] === 'present';
            absentRadio.checked = storedAttendance[studentId] === 'absent';
        }
    }
}

// Function to handle the radio button changes
function handleCheckboxChange() {
    const radios = document.querySelectorAll('.attendance-radio');

    radios.forEach(radio => {
        radio.addEventListener('change', function () {
            const studentId = this.getAttribute('data-id');
            const status = this.value;

            // Save the attendance status for the student
            let storedAttendance = JSON.parse(localStorage.getItem('attendanceStatus')) || {};
            storedAttendance[studentId] = status;
            localStorage.setItem('attendanceStatus', JSON.stringify(storedAttendance));
        });
    });
}

// Function to select all students as present for the selected class
function selectAllStudents() {
    const classSelect = document.getElementById('select-class').value;
    const radios = document.querySelectorAll('.attendance-radio.present-radio');

    radios.forEach(radio => {
        const studentId = radio.getAttribute('data-id');
        // Only mark students present if they belong to the selected class
        const studentRow = radio.closest('tr');
        const studentClassCell = studentRow.cells[2].textContent;

        if (studentClassCell === classSelect) {
            radio.checked = true; // Set the present radio to checked
            // Save attendance status to localStorage
            let storedAttendance = JSON.parse(localStorage.getItem('attendanceStatus')) || {};
            storedAttendance[studentId] = 'present';
            localStorage.setItem('attendanceStatus', JSON.stringify(storedAttendance));
        }
    });
}

// Function to add searching functionality
function addSearchFunctionality() {
    const searchInput = document.querySelector('.search-att input');

    searchInput.addEventListener('input', function () {
        const searchTerm = this.value.toLowerCase();
        const tableBody = document.querySelector('#studentTable tbody');
        const rows = tableBody.querySelectorAll('tr');

        rows.forEach(row => {
            const studentId = row.cells[0].textContent.toLowerCase(); // Assuming the first cell is the student ID
            const studentName = row.cells[1].textContent.toLowerCase(); // Assuming the second cell is the student's name
            const studentClass = row.cells[2].textContent.toLowerCase(); // Assuming the third cell is the student's class

            if (studentId.includes(searchTerm) || studentName.includes(searchTerm)) {
                row.style.display = ''; // Show matching row
            } else {
                row.style.display = 'none'; // Hide non-matching row
            }
        });
    });
}

// Call necessary functions on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    populateClassDropdown();

    document.getElementById('select-class').addEventListener('change', () => {
        updateDisplay();
        loadStudents(); // Reload students when class changes
    });
    document.getElementById('attendance-type').addEventListener('change', updateDisplay);
    document.getElementById('attendance-date').addEventListener('input', updateDisplay);
    document.querySelector('.sub-btn').addEventListener('click', handleTakeAttendance);
    document.querySelector('.select-btn').addEventListener('click', selectAllStudents); // Add event listener for select all

    updateDisplay();
});









// attendance.js
// Save button event listener
// Save button event listener
document.getElementById('save-button').addEventListener('click', () => {
    const className = document.getElementById('select-class').value;
    const date = document.getElementById('attendance-date').value;

    const attendanceRecords = [];

    // Get all student rows from the table
    const studentRows = document.querySelectorAll('#studentTable tbody tr');

    studentRows.forEach(row => {
        const studentId = row.querySelector('td:nth-child(1)').textContent; // Get student ID
        const studentName = row.querySelector('td:nth-child(2)').textContent; // Get student name
        const presentRadio = row.querySelector(`input[name="attendance-${studentId}"][value="present"]`);
        const absentRadio = row.querySelector(`input[name="attendance-${studentId}"][value="absent"]`);

        // Check attendance and push to records array
        if (presentRadio && presentRadio.checked) {
            attendanceRecords.push({ studentName: studentName, status: 'present' });
        } else if (absentRadio && absentRadio.checked) {
            attendanceRecords.push({ studentName: studentName, status: 'absent' });
        }
    });

    // Prepare the data to be sent to the JSON server
    const attendanceData = {
        className: className,
        date: date,
        attendanceRecords: attendanceRecords // This should now contain the correct data
    };

    // Send the attendance data to the JSON server
    fetch('http://localhost:3000/attendance', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(attendanceData)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Attendance saved:', data);
        alert('Attendance saved successfully!');
        // Optionally, display a success message or update the UI
    })
    .catch(error => {
        console.error('Error saving attendance:', error);
        alert('Failed to save attendance.'); // Alert for any error
    });
});




// cancle button

// Cancel button logic
document.getElementById('cancel-btn').addEventListener('click', function () {
    const radios = document.querySelectorAll('.attendance-radio');
    radios.forEach(radio => {
        radio.checked = false; // Unselect all radio buttons
    });

    // Clear the saved attendance status in localStorage
    localStorage.removeItem('attendanceStatus');
    
    // Optionally, clear the stored form data as well
    localStorage.removeItem('formData');

    // Optionally, you can reset the display span
    const displaySpan = document.getElementById('display-span');
    displaySpan.textContent = 'No class selected / No type selected / No date selected';
});
