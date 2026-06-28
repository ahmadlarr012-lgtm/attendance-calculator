class AttendanceCalculator {
    constructor() {
        this.subjects = [];
        this.timetable = null;
        this.currentEditingSubject = null;
        this.loadData();
        this.initializeEventListeners();
        this.renderDashboard();
    }

    loadData() {
        const savedSubjects = localStorage.getItem('subjects');
        const savedTimetable = localStorage.getItem('timetable');
        
        if (savedSubjects) {
            this.subjects = JSON.parse(savedSubjects);
        }
        if (savedTimetable) {
            this.timetable = savedTimetable;
        }
    }

    saveData() {
        localStorage.setItem('subjects', JSON.stringify(this.subjects));
        if (this.timetable) {
            localStorage.setItem('timetable', this.timetable);
        }
    }

    initializeEventListeners() {
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.switchTab(e.target.dataset.tab));
        });

        const uploadArea = document.getElementById('uploadArea');
        const timetableFile = document.getElementById('timetableFile');

        uploadArea.addEventListener('click', () => timetableFile.click());
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.style.borderColor = '#3b82f6';
            uploadArea.style.background = 'rgba(59, 130, 246, 0.1)';
        });
        uploadArea.addEventListener('dragleave', () => {
            uploadArea.style.borderColor = '#e5e7eb';
            uploadArea.style.background = '#f9fafb';
        });
        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.style.borderColor = '#e5e7eb';
            uploadArea.style.background = '#f9fafb';
            this.handleTimetableUpload(e.dataTransfer.files);
        });

        timetableFile.addEventListener('change', (e) => {
            this.handleTimetableUpload(e.target.files);
        });

        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.remove('active');
                }
            });
        });
    }

    switchTab(tabName) {
        document.querySelectorAll('.tab-content').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });

        document.getElementById(tabName).classList.add('active');
        event.target.classList.add('active');

        if (tabName === 'dashboard') {
            this.renderDashboard();
        } else if (tabName === 'subjects') {
            this.renderSubjects();
        } else if (tabName === 'attendance') {
            this.renderAttendance();
        } else if (tabName === 'analytics') {
            this.renderAnalytics();
        } else if (tabName === 'timetable') {
            this.renderTimetable();
        }
    }

    addSubject(event) {
        event.preventDefault();

        const subject = {
            id: Date.now(),
            name: document.getElementById('subjectName').value,
            minAttendance: parseInt(document.getElementById('minAttendance').value),
            totalLectures: parseInt(document.getElementById('totalLectures').value),
            attendedLectures: parseInt(document.getElementById('attendedLectures').value),
            history: []
        };

        this.subjects.push(subject);
        this.saveData();
        this.closeAddSubjectModal();
        this.renderSubjects();
        this.renderDashboard();
        this.showNotification('Subject added successfully!', 'success');
    }

    editSubject(id) {
        this.currentEditingSubject = this.subjects.find(s => s.id === id);
        if (!this.currentEditingSubject) return;

        document.getElementById('editSubjectName').value = this.currentEditingSubject.name;
        document.getElementById('editMinAttendance').value = this.currentEditingSubject.minAttendance;
        document.getElementById('editTotalLectures').value = this.currentEditingSubject.totalLectures;
        document.getElementById('editAttendedLectures').value = this.currentEditingSubject.attendedLectures;

        document.getElementById('editSubjectModal').classList.add('active');
    }

    saveEditSubject(event) {
        event.preventDefault();

        if (!this.currentEditingSubject) return;

        this.currentEditingSubject.name = document.getElementById('editSubjectName').value;
        this.currentEditingSubject.minAttendance = parseInt(document.getElementById('editMinAttendance').value);
        this.currentEditingSubject.totalLectures = parseInt(document.getElementById('editTotalLectures').value);
        this.currentEditingSubject.attendedLectures = parseInt(document.getElementById('editAttendedLectures').value);

        this.saveData();
        this.closeEditSubjectModal();
        this.renderSubjects();
        this.renderDashboard();
        this.showNotification('Subject updated successfully!', 'success');
    }

    deleteSubject(id) {
        if (confirm('Are you sure you want to delete this subject?')) {
            this.subjects = this.subjects.filter(s => s.id !== id);
            this.saveData();
            this.renderSubjects();
            this.renderDashboard();
            this.showNotification('Subject deleted successfully!', 'success');
        }
    }

    markAttendance(subjectId, attended) {
        const subject = this.subjects.find(s => s.id === subjectId);
        if (!subject) return;

        if (attended) {
            subject.attendedLectures++;
        }

        subject.totalLectures++;
        subject.history.push({
            date: new Date().toISOString(),
            attended: attended
        });

        this.saveData();
        this.closeQuickAttendanceModal();
        this.renderDashboard();
        this.renderAttendance();

        const message = attended 
            ? `✓ Marked as attended for ${subject.name}!` 
            : `✗ Marked as missed for ${subject.name}!`;
        this.showNotification(message, attended ? 'success' : 'warning');
    }

    calculateAttendancePercentage(subject) {
        if (subject.totalLectures === 0) return 0;
        return Math.round((subject.attendedLectures / subject.totalLectures) * 100);
    }

    calculateCanMiss(subject) {
        const requiredAttendance = (subject.minAttendance / 100) * subject.totalLectures;
        const canMiss = Math.floor(subject.attendedLectures - requiredAttendance);
        return Math.max(0, canMiss);
    }

    calculateStatus(subject) {
        const percentage = this.calculateAttendancePercentage(subject);
        if (percentage >= subject.minAttendance + 10) {
            return 'safe';
        } else if (percentage >= subject.minAttendance) {
            return 'warning';
        } else {
            return 'danger';
        }
    }

    renderDashboard() {
        const container = document.getElementById('dashboard-container');

        if (this.subjects.length === 0) {
            container.innerHTML = '<div class="empty-state"><p>👋 Welcome! Start by adding subjects to track your attendance.</p></div>';
            return;
        }

        container.innerHTML = this.subjects.map(subject => {
            const percentage = this.calculateAttendancePercentage(subject);
            const canMiss = this.calculateCanMiss(subject);
            const status = this.calculateStatus(subject);

            return `
                <div class="subject-card">
                    <h3>${subject.name}</h3>
                    <div class="card-stat">
                        <label>Attendance:</label>
                        <value>${percentage}%</value>
                    </div>
                    <div class="attendance-bar">
                        <div class="attendance-fill" style="width: ${percentage}%"></div>
                    </div>
                    <div class="card-stat">
                        <label>Lectures:</label>
                        <value>${subject.attendedLectures}/${subject.totalLectures}</value>
                    </div>
                    <div class="card-stat">
                        <label>Min Required:</label>
                        <value>${subject.minAttendance}%</value>
                    </div>
                    <div class="can-miss">
                        <p>🚫 Can miss: <strong>${canMiss}</strong> more lectures</p>
                    </div>
                    <span class="status-badge ${status}">
                        ${status === 'safe' ? '✓ Safe' : status === 'warning' ? '⚠ Warning' : '✗ At Risk'}
                    </span>
                </div>
            `;
        }).join('');
    }

    renderSubjects() {
        const container = document.getElementById('subjects-list');

        if (this.subjects.length === 0) {
            container.innerHTML = '<div class="empty-state">No subjects added yet. Click \'Add Subject\' to get started!</div>';
            return;
        }

        container.innerHTML = this.subjects.map(subject => {
            const percentage = this.calculateAttendancePercentage(subject);

            return `
                <div class="subject-item">
                    <h3>${subject.name}</h3>
                    <div class="subject-info">
                        <p>📊 Attendance: <strong>${percentage}%</strong></p>
                        <p>📚 Min Required: <strong>${subject.minAttendance}%</strong></p>
                        <p>📝 Lectures: <strong>${subject.attendedLectures}/${subject.totalLectures}</strong></p>
                    </div>
                    <div class="subject-item-actions">
                        <button class="btn btn-primary" onclick="app.editSubject(${subject.id})">Edit</button>
                        <button class="btn btn-danger" onclick="app.deleteSubject(${subject.id})">Delete</button>
                    </div>
                </div>
            `;
        }).join('');
    }

    renderTimetable() {
        const preview = document.getElementById('timetablePreview');
        const uploadArea = document.getElementById('uploadArea');

        if (this.timetable) {
            uploadArea.style.display = 'none';
            preview.style.display = 'block';
            document.getElementById('timetableImage').src = this.timetable;
        } else {
            uploadArea.style.display = 'block';
            preview.style.display = 'none';
        }
    }

    renderAttendance() {
        const container = document.getElementById('attendance-container');

        if (this.subjects.length === 0) {
            container.innerHTML = '<div class="empty-state">No subjects to log attendance. Add subjects first!</div>';
            return;
        }

        container.innerHTML = `
            <div class="attendance-list">
                ${this.subjects.map(subject => `
                    <div class="attendance-item">
                        <h3>${subject.name}</h3>
                        <p style="color: #6b7280; margin: 10px 0;">Current: ${this.calculateAttendancePercentage(subject)}%</p>
                        <div class="attendance-buttons">
                            <button class="btn btn-success" onclick="app.markAttendanceModal(${subject.id})">📍 Log Attendance</button>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    renderAnalytics() {
        const container = document.getElementById('analytics-container');

        if (this.subjects.length === 0) {
            container.innerHTML = '<div class="empty-state">Analytics will appear here once you start logging attendance.</div>';
            return;
        }

        const stats = this.calculateStats();

        container.innerHTML = `
            <div class="analytics-grid">
                <div class="analytics-card">
                    <h3>Total Subjects</h3>
                    <div class="analytics-value">${this.subjects.length}</div>
                </div>
                <div class="analytics-card">
                    <h3>Average Attendance</h3>
                    <div class="analytics-value">${stats.averageAttendance}%</div>
                </div>
                <div class="analytics-card">
                    <h3>Total Lectures</h3>
                    <div class="analytics-value">${stats.totalLectures}</div>
                </div>
                <div class="analytics-card">
                    <h3>Subjects At Risk</h3>
                    <div class="analytics-value" style="color: #ef4444;">${stats.atRisk}</div>
                </div>
                <div class="analytics-card">
                    <h3>Subjects Safe</h3>
                    <div class="analytics-value" style="color: #10b981;">${stats.safe}</div>
                </div>
                <div class="analytics-card">
                    <h3>Total Lectures Attended</h3>
                    <div class="analytics-value">${stats.totalAttended}</div>
                </div>
            </div>
            <div style="margin-top: 30px;">
                <h3 style="margin-bottom: 20px;">Subject Breakdown</h3>
                <div class="analytics-grid">
                    ${this.subjects.map(subject => {
                        const percentage = this.calculateAttendancePercentage(subject);
                        const status = this.calculateStatus(subject);
                        return `
                            <div class="analytics-card">
                                <h3>${subject.name}</h3>
                                <div class="analytics-value">${percentage}%</div>
                                <span class="status-badge ${status}">
                                    ${status === 'safe' ? '✓ Safe' : status === 'warning' ? '⚠ Warning' : '✗ At Risk'}
                                </span>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
    }

    calculateStats() {
        let totalAttendance = 0;
        let totalLectures = 0;
        let totalAttended = 0;
        let atRisk = 0;
        let safe = 0;

        this.subjects.forEach(subject => {
            const percentage = this.calculateAttendancePercentage(subject);
            totalAttendance += percentage;
            totalLectures += subject.totalLectures;
            totalAttended += subject.attendedLectures;

            const status = this.calculateStatus(subject);
            if (status === 'danger') {
                atRisk++;
            } else if (status === 'safe') {
                safe++;
            }
        });

        return {
            averageAttendance: this.subjects.length > 0 ? Math.round(totalAttendance / this.subjects.length) : 0,
            totalLectures,
            totalAttended,
            atRisk,
            safe
        };
    }

    handleTimetableUpload(files) {
        if (files.length === 0) return;

        const file = files[0];
        const validTypes = ['image/png', 'image/jpeg', 'application/pdf', 'image/jpg'];

        if (!validTypes.includes(file.type)) {
            this.showNotification('Please upload a PDF or PNG/JPG image', 'danger');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            this.timetable = e.target.result;
            this.saveData();
            this.renderTimetable();
            this.showNotification('Timetable uploaded successfully!', 'success');
        };
        reader.readAsDataURL(file);
    }

    removeTimetable() {
        if (confirm('Are you sure you want to remove the timetable?')) {
            this.timetable = null;
            localStorage.removeItem('timetable');
            this.renderTimetable();
            this.showNotification('Timetable removed!', 'success');
        }
    }

    markAttendanceModal(subjectId) {
        const subject = this.subjects.find(s => s.id === subjectId);
        if (!subject) return;

        document.getElementById('quickAttendanceTitle').textContent = 'Did you attend this lecture?';
        document.getElementById('quickAttendanceSubject').textContent = subject.name;
        document.getElementById('quickAttendanceModal').dataset.subjectId = subjectId;
        document.getElementById('quickAttendanceModal').classList.add('active');
    }

    closeAddSubjectModal() {
        document.getElementById('addSubjectModal').classList.remove('active');
        document.getElementById('addSubjectForm').reset();
    }

    closeEditSubjectModal() {
        document.getElementById('editSubjectModal').classList.remove('active');
        document.getElementById('editSubjectForm').reset();
    }

    closeQuickAttendanceModal() {
        document.getElementById('quickAttendanceModal').classList.remove('active');
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            background: ${type === 'success' ? '#10b981' : type === 'danger' ? '#ef4444' : type === 'warning' ? '#f59e0b' : '#3b82f6'};
            color: white;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            z-index: 2000;
            animation: slideIn 0.3s ease;
            font-weight: 500;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

function openAddSubjectModal() {
    document.getElementById('addSubjectModal').classList.add('active');
}

function closeAddSubjectModal() {
    app.closeAddSubjectModal();
}

function closeEditSubjectModal() {
    app.closeEditSubjectModal();
}

function closeQuickAttendanceModal() {
    app.closeQuickAttendanceModal();
}

function addSubject(event) {
    app.addSubject(event);
}

function saveEditSubject(event) {
    app.saveEditSubject(event);
}

function markAttendance(attended) {
    const subjectId = parseInt(document.getElementById('quickAttendanceModal').dataset.subjectId);
    app.markAttendance(subjectId, attended);
}

function removeTimetable() {
    app.removeTimetable();
}

const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

const app = new AttendanceCalculator();