// Function to convert JSON data to Excel and download it
function downloadAttendanceReport(recordId) {
    fetch(`http://localhost:3000/attendance/${recordId}`)
        .then(response => response.json())
        .then(attendance => {
            const attendanceRecords = attendance.attendanceRecords || [];

            // Prepare data for Excel
            const data = attendanceRecords.map(record => ({
                'Student Name': record.studentName,
                'Roll No': record.rollNo,
                'Class Name': attendance.className,
                'Attendance': record.status === 'present' ? 'Present' : 'Absent'
            }));

            // Create a new workbook and add data
            const workbook = XLSX.utils.book_new();
            const worksheet = XLSX.utils.json_to_sheet(data);
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Attendance Report');

            // Generate Excel file and trigger download
            const fileName = `Attendance_Report_${attendance.className}_${attendance.date}.xlsx`;
            XLSX.writeFile(workbook, fileName);
        })
        .catch(error => {
            console.error('Error fetching attendance data:', error);
        });
}

// Function to initialize report buttons
function initReportButtons() {
    const reportButtons = document.querySelectorAll('.report-btn');
    reportButtons.forEach(button => {
        button.addEventListener('click', function() {
            const recordId = this.getAttribute('data-id');
            downloadAttendanceReport(recordId);
        });
    });
}

// Call initReportButtons when the page is fully loaded
document.addEventListener('DOMContentLoaded', initReportButtons);
