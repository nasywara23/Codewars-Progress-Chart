document.getElementById('update-chart').addEventListener('click', updateChart);

let myChart = null; // Deklarasikan di luar fungsi untuk akses global

// Fungsi untuk menyimpan data ke localStorage
function saveToLocalStorage() {
    const tableRows = document.querySelectorAll('#data-table tbody tr');
    const tableData = [];

    tableRows.forEach(row => {
        const date = row.cells[0].innerText;
        const score = row.cells[1].innerText;
        tableData.push({ date, score });
    });

    localStorage.setItem('tableData', JSON.stringify(tableData)); // Simpan dalam bentuk JSON
}

// Fungsi untuk memuat data dari localStorage
function loadFromLocalStorage() {
    const storedData = localStorage.getItem('tableData');
    const table = document.getElementById('data-table').getElementsByTagName('tbody')[0];
    
    // Menghapus data default saat halaman dimuat
    table.innerHTML = '';

    if (storedData) {
        const tableData = JSON.parse(storedData);
        tableData.forEach(row => {
            const newRow = table.insertRow();
            const dateCell = newRow.insertCell(0);
            const scoreCell = newRow.insertCell(1);
            const deleteCell = newRow.insertCell(2); // Cell untuk tombol delete

            // Tambahkan nilai ke cell
            dateCell.textContent = row.date;
            scoreCell.textContent = row.score;

            // Tambahkan tombol delete
            const deleteBtn = document.createElement('button');
            deleteBtn.innerHTML = '<i class="fa-solid fa-delete-left"></i>';
            deleteBtn.classList.add('delete-btn');
            deleteBtn.addEventListener('click', () => {
                deleteRow(newRow);
            });

            deleteCell.appendChild(deleteBtn);
        });
    }

    updateChart(); // Update chart after loading data
}

function deleteRow(row) {
    // Menghapus baris dari tabel
    row.remove();

    // Simpan perubahan ke localStorage setelah baris dihapus
    saveToLocalStorage();

    // Update chart setelah baris dihapus
    updateChart();
}

function updateChart() {
    const tableRows = document.querySelectorAll('#data-table tbody tr');
    const labels = [];
    const data = [];

    tableRows.forEach(row => {
        const date = row.cells[0].innerText;
        const score = row.cells[1].innerText;

        console.log('Tanggal:', date, 'Poin:', score); // Debugging

        labels.push(date);
        data.push(parseFloat(score));
    });

    renderChart(labels, data);
}

function renderChart(labels, data) {
    const ctx = document.getElementById('myChart').getContext('2d');

    // Jika `myChart` sudah ada dan valid, destroy chart sebelumnya
    if (myChart instanceof Chart) {
        myChart.destroy();
    }

    // Buat chart baru dan simpan di variabel global `myChart`
    myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Poin',
                data: data,
                borderColor: 'rgba(75, 192, 192, 1)',
                fill: false,
                tension: 0.4 // Smooth curves
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Tanggal'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Poin'
                    }
                }
            }
        }
    });
}

function addRow() {
    // Ambil nilai dari input
    const dateInput = document.getElementById('newDate').value;
    const scoreInput = document.getElementById('newScore').value;

    // Cek jika input kosong
    if (!dateInput || !scoreInput) {
        alert('Harap isi semua field.');
        return;
    }

    // Referensi ke tabel yang benar
    const table = document.getElementById('data-table').getElementsByTagName('tbody')[0];

    // Buat row baru
    const newRow = table.insertRow();

    // Buat cell untuk tanggal dan Poin
    const dateCell = newRow.insertCell(0);
    const scoreCell = newRow.insertCell(1);
    const deleteCell = newRow.insertCell(2); // Cell untuk tombol delete

    // Tambahkan nilai ke cell
    dateCell.textContent = dateInput;
    scoreCell.textContent = scoreInput;

    // Tambahkan tombol delete
    const deleteBtn = document.createElement('button');
    deleteBtn.innerHTML = '<i class="fa-solid fa-delete-left"></i>';  // Ganti teks 'Hapus' dengan icon
    deleteBtn.classList.add('delete-btn');
    deleteBtn.addEventListener('click', () => {
    deleteRow(newRow);
});


    deleteCell.appendChild(deleteBtn);

    // Simpan data ke localStorage
    saveToLocalStorage();

    // Update chart setelah menambah row
    updateChart();

    // Reset form setelah submit
    document.getElementById('addRowForm').reset();
}

// Inisialisasi chart pertama kali
loadFromLocalStorage(); // Muat data dari localStorage
updateChart();
