// Teacher Student List Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Sample student data (will be replaced with Django backend data)
    let students = [
        {
            id: 1,
            first_name: 'Emmanuel',
            last_name: 'Okafor',
            full_name: 'Emmanuel Okafor',
            gender: 'Male',
            date_of_birth: '2015-06-15',
            age: 9,
            parent_email: 'mr.okafor@example.com',
            parent_name: 'Mr. Chukwuemeka Okafor',
            parent_linked: true,
            status: 'active'
        },
        {
            id: 2,
            first_name: 'Adebayo',
            last_name: 'Ogunlesi',
            full_name: 'Adebayo Ogunlesi',
            gender: 'Male',
            date_of_birth: '2016-03-22',
            age: 8,
            parent_email: 'ade.ogunlesi@example.com',
            parent_name: 'Mrs. Funke Ogunlesi',
            parent_linked: true,
            status: 'active'
        },
        {
            id: 3,
            first_name: 'Chiamaka',
            last_name: 'Eze',
            full_name: 'Chiamaka Eze',
            gender: 'Female',
            date_of_birth: '2015-11-10',
            age: 9,
            parent_email: null,
            parent_name: null,
            parent_linked: false,
            status: 'pending'
        },
        {
            id: 4,
            first_name: 'Fatima',
            last_name: 'Bello',
            full_name: 'Fatima Bello',
            gender: 'Female',
            date_of_birth: '2016-08-05',
            age: 8,
            parent_email: 'fatima.bello@example.com',
            parent_name: 'Alhaji Ibrahim Bello',
            parent_linked: true,
            status: 'active'
        },
        {
            id: 5,
            first_name: 'David',
            last_name: 'Okonkwo',
            full_name: 'David Okonkwo',
            gender: 'Male',
            date_of_birth: '2015-01-30',
            age: 10,
            parent_email: null,
            parent_name: null,
            parent_linked: false,
            status: 'pending'
        }
    ];
    
    // DOM Elements
    const tableBody = document.getElementById('studentsTableBody');
    const emptyState = document.getElementById('emptyState');
    const searchInput = document.getElementById('searchInput');
    const statusFilter = document.getElementById('statusFilter');
    const classSelect = document.getElementById('classSelect');
    const selectAllCheckbox = document.getElementById('selectAllCheckbox');
    const exportBtn = document.getElementById('exportBtn');
    const totalCountSpan = document.getElementById('totalCount');
    const linkedCountSpan = document.getElementById('linkedCount');
    const unlinkedCountSpan = document.getElementById('unlinkedCount');
    const avgAgeSpan = document.getElementById('avgAge');
    
    // Modal elements
    const deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));
    let studentToDelete = null;
    
    // Toast
    const toast = new bootstrap.Toast(document.getElementById('liveToast'));
    const toastMessage = document.getElementById('toastMessage');
    
    function showToast(message, isSuccess = true) {
        toastMessage.textContent = message;
        const toastHeader = document.querySelector('#liveToast .toast-header i');
        if (isSuccess) {
            toastHeader.className = 'fas fa-check-circle text-success me-2';
            toastHeader.style.color = '';
        } else {
            toastHeader.className = 'fas fa-exclamation-circle text-danger me-2';
        }
        toast.show();
    }
    
    function formatDate(dateString) {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    }
    
    function renderStudents() {
        // Filter based on class (for now, using mock - will connect to backend)
        let filtered = [...students];
        
        // Search filter
        const searchTerm = searchInput.value.toLowerCase();
        if (searchTerm) {
            filtered = filtered.filter(s => 
                s.full_name.toLowerCase().includes(searchTerm) ||
                (s.parent_email && s.parent_email.toLowerCase().includes(searchTerm)) ||
                (s.parent_name && s.parent_name.toLowerCase().includes(searchTerm))
            );
        }
        
        // Status/Gender filter
        const filterValue = statusFilter.value;
        if (filterValue === 'linked') {
            filtered = filtered.filter(s => s.parent_linked === true);
        } else if (filterValue === 'unlinked') {
            filtered = filtered.filter(s => s.parent_linked === false);
        } else if (filterValue === 'male') {
            filtered = filtered.filter(s => s.gender === 'Male');
        } else if (filterValue === 'female') {
            filtered = filtered.filter(s => s.gender === 'Female');
        }
        
        // Update stats
        const total = filtered.length;
        const linkedCount = filtered.filter(s => s.parent_linked).length;
        const unlinkedCount = filtered.filter(s => !s.parent_linked).length;
        const avgAge = total > 0 ? Math.round(filtered.reduce((sum, s) => sum + s.age, 0) / total) : 0;
        
        totalCountSpan.textContent = total;
        linkedCountSpan.textContent = linkedCount;
        unlinkedCountSpan.textContent = unlinkedCount;
        avgAgeSpan.textContent = avgAge;
        
        // Show/hide empty state
        if (filtered.length === 0) {
            document.querySelector('.table-responsive').style.display = 'none';
            emptyState.style.display = 'block';
        } else {
            document.querySelector('.table-responsive').style.display = 'block';
            emptyState.style.display = 'none';
        }
        
        // Render table rows
        // tableBody.innerHTML = filtered.map((student, index) => `
        //     <tr>
        //         <td class="ps-3">
        //             <input type="checkbox" class="student-checkbox" data-id="${student.id}">
        //         </td>
        //         <td>${index + 1}</td>
        //         <td>
        //             <div class="d-flex align-items-center">
        //                 <div class="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center me-2" style="width: 32px; height: 32px; font-size: 12px;">
        //                     ${student.first_name.charAt(0)}${student.last_name.charAt(0)}
        //                 </div>
        //                 <div>
        //                     <strong>${student.full_name}</strong>
        //                 </div>
        //             </div>
        //         </td>
        //         <td>${student.gender}</td>
        //         <td>${formatDate(student.date_of_birth)}</td>
        //         <td>${student.age} yrs</td>
        //         <td>${student.parent_email || '<span class="text-muted">—</span>'}</td>
        //         <td>${student.parent_name || '<span class="text-muted">—</span>'}</td>
        //         <td>
        //             ${student.parent_linked 
        //                 ? '<span class="parent-badge linked"><i class="fas fa-link"></i> Linked</span>'
        //                 : '<span class="parent-badge unlinked"><i class="fas fa-unlink"></i> Not Linked</span>'
        //             }
        //         </td>
        //         <td>
        //             <div class="action-btns">
        //                 <button class="btn btn-sm btn-outline-primary btn-icon" onclick="viewStudent(${student.id})" title="View">
        //                     <i class="fas fa-eye"></i>
        //                 </button>
        //                 <button class="btn btn-sm btn-outline-secondary btn-icon" onclick="editStudent(${student.id})" title="Edit">
        //                     <i class="fas fa-edit"></i>
        //                 </button>
        //                 ${!student.parent_linked 
        //                     ? `<button class="btn btn-sm btn-outline-success btn-icon" onclick="linkParent(${student.id})" title="Link Parent">
        //                         <i class="fas fa-link"></i>
        //                        </button>`
        //                     : ''
        //                 }
        //                 <button class="btn btn-sm btn-outline-danger btn-icon" onclick="deleteStudent(${student.id}, '${student.full_name}')" title="Delete">
        //                     <i class="fas fa-trash"></i>
        //                 </button>
        //             </div>
        //         </td>
        //     </tr>
        // `).join('');
        
        // Update select all checkbox state
        const checkboxes = document.querySelectorAll('.student-checkbox');
        if (selectAllCheckbox) {
            selectAllCheckbox.checked = checkboxes.length > 0 && Array.from(checkboxes).every(cb => cb.checked);
        }
    }
    
    // Global functions for onclick handlers
    window.viewStudent = function(id) {
        const student = students.find(s => s.id === id);
        if (student) {
            alert(`View Student: ${student.full_name}\nParent: ${student.parent_name || 'Not linked'}\nParent Email: ${student.parent_email || 'Not provided'}`);
        }
    };
    
    window.editStudent = function(id) {
        window.location.href = `/students/edit/${id}/`;
    };
    
    window.linkParent = function(id) {
        const student = students.find(s => s.id === id);
        if (student) {
            const parentEmail = prompt(`Enter parent email for ${student.full_name}:`);
            if (parentEmail && parentEmail.includes('@')) {
                alert(`Invitation sent to ${parentEmail} to link as parent of ${student.full_name}`);
                // Update in backend
                student.parent_email = parentEmail;
                student.parent_linked = false;
                renderStudents();
                showToast(`Invitation sent to ${parentEmail}`, true);
            } else if (parentEmail) {
                showToast('Please enter a valid email address', false);
            }
        }
    };
    
    window.deleteStudent = function(id, name) {
        studentToDelete = { id, name };
        document.getElementById('deleteStudentName').textContent = name;
        deleteModal.show();
    };
    
    // Confirm delete
    document.getElementById('confirmDeleteBtn')?.addEventListener('click', function() {
        if (studentToDelete) {
            students = students.filter(s => s.id !== studentToDelete.id);
            renderStudents();
            showToast(`Student "${studentToDelete.name}" deleted successfully`, true);
            deleteModal.hide();
            studentToDelete = null;
        }
    });
    
    // Select all functionality
    selectAllCheckbox?.addEventListener('change', function() {
        const checkboxes = document.querySelectorAll('.student-checkbox');
        checkboxes.forEach(cb => cb.checked = this.checked);
    });
    
    // Export to CSV
    exportBtn?.addEventListener('click', function() {
        const selectedCheckboxes = document.querySelectorAll('.student-checkbox:checked');
        let studentsToExport = [];
        
        if (selectedCheckboxes.length === 0) {
            studentsToExport = students;
        } else {
            selectedCheckboxes.forEach(cb => {
                const student = students.find(s => s.id === parseInt(cb.dataset.id));
                if (student) studentsToExport.push(student);
            });
        }
        
        const csvData = studentsToExport.map(s => ({
            'Full Name': s.full_name,
            'Gender': s.gender,
            'Date of Birth': formatDate(s.date_of_birth),
            'Age': s.age,
            'Parent Email': s.parent_email || '',
            'Parent Name': s.parent_name || '',
            'Status': s.parent_linked ? 'Linked' : 'Not Linked'
        }));
        
        if (csvData.length === 0) {
            showToast('No students to export', false);
            return;
        }
        
        const headers = Object.keys(csvData[0]);
        const csvRows = [headers.join(',')];
        for (const row of csvData) {
            const values = headers.map(header => `"${row[header]}"`);
            csvRows.push(values.join(','));
        }
        
        const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'students_export.csv';
        a.click();
        URL.revokeObjectURL(url);
        
        showToast(`Exported ${csvData.length} students`, true);
    });
    
    // Event listeners
    searchInput?.addEventListener('input', renderStudents);
    statusFilter?.addEventListener('change', renderStudents);
    classSelect?.addEventListener('change', renderStudents);
    
    // Initialize
    renderStudents();
});