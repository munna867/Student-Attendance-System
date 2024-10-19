// Function to load and display records
function loadRecords() {
    fetch('http://localhost:3000/signup')  // Replace 'signup' with your endpoint if different
        .then(response => response.json())
        .then(data => {
            const tableBody = document.querySelector('#studentTable tbody');
            tableBody.innerHTML = '';  // Clear existing rows

            data.forEach(record => {
                // Create a new row
                const row = document.createElement('tr');

                // Create and append cells
                row.innerHTML = `
                    <td>${record.id}</td>
                    <td>${record.regmail}</td>
                    <td>${record.regname}</td>
                    <td>${record.regpass}</td>
                    <td><button class="delete-btn" onclick="deleteRecord(${record.id})">Delete</button></td>
                `;

                // Append row to the table body
                tableBody.appendChild(row);
            });
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}

// Function to delete a record
function deleteRecord(id) {
    fetch(`http://localhost:3000/signup/${id}`, {  // Replace 'signup' with your endpoint if different
        method: 'DELETE'
    })
    .then(() => {
        alert('Record deleted successfully!');
        loadRecords();  // Reload records after deletion
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Failed to delete record. Please try again.');
    });
}

// Initial load of records
document.addEventListener('DOMContentLoaded', loadRecords);
