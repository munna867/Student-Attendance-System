// attendance.js

// Function to save attendance and calculate progress
function saveAttendance() {
    const students = document.querySelectorAll('.student-row');
    let presentCount = 0;
    let absentCount = 0;

    students.forEach(student => {
        const isPresent = student.querySelector('input[name="attendance"]:checked').value === 'present';
        if (isPresent) {
            presentCount++;
        } else {
            absentCount++;
        }
    });

    const totalStudents = students.length;
    const presentPercentage = Math.round((presentCount / totalStudents) * 100);
    const absentPercentage = Math.round((absentCount / totalStudents) * 100);

    // Get today's date
    const today = new Date().toISOString().split('T')[0];  // Format: YYYY-MM-DD

    // Store the attendance progress data with the date
    const attendanceData = {
        date: today,
        presentPercentage: presentPercentage,
        absentPercentage: absentPercentage
    };

    // Save attendance data in localStorage
    localStorage.setItem(`attendance_${today}`, JSON.stringify(attendanceData));

    alert("Attendance saved successfully!");
}

// Attach the saveAttendance function to the Save button
document.querySelector('#save-button').addEventListener('click', saveAttendance);







