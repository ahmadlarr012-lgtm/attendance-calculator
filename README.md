# 📚 Attendance Calculator

A modern web-based attendance tracking application designed for medical students and other professionals who need to maintain detailed attendance records for multiple subjects.

## ✨ Features

### 1. **Subject Management**
- ➕ Add multiple subjects with custom settings
- 🎯 Set minimum attendance percentage requirement for each subject
- 📊 Track total lectures and lectures attended
- ✏️ Edit subject details anytime
- 🗑️ Delete subjects when no longer needed

### 2. **Attendance Tracking**
- 📍 Quick attendance logging interface
- ⚡ Mark lectures as attended or missed
- 📈 Real-time attendance percentage calculation
- 🔄 Maintain detailed attendance history

### 3. **Smart Calculations**
- **Attendance Percentage**: Automatically calculates current attendance %
- **Can Miss Lectures**: Shows how many lectures you can miss while maintaining minimum attendance
- **Status Indicators**: Visual indicators for safe, warning, and at-risk attendance levels
- **Flexible Requirements**: Each subject can have different minimum attendance requirements

### 4. **Timetable Management**
- 📄 Upload timetable as PDF or image (PNG/JPG)
- 📸 View uploaded timetable directly in the app
- 💾 Timetable saves automatically

### 5. **Analytics Dashboard**
- 📊 Overall statistics and insights
- 🎯 Total subjects and lectures
- 📉 Average attendance across all subjects
- ⚠️ Subjects at risk identification
- ✓ Subjects safe from cancellation
- 🔍 Detailed breakdown by subject

### 6. **Data Persistence**
- 💾 All data saves automatically to browser's local storage
- 🔐 Data persists between sessions
- 🌐 No account required, 100% client-side

## 🚀 Getting Started

### Prerequisites
- Any modern web browser (Chrome, Firefox, Safari, Edge)
- No internet required once loaded

### Installation

1. Clone the repository:
```bash
git clone https://github.com/ahmadlarr012-lgtm/attendance-calculator.git
cd attendance-calculator
```

2. Open `index.html` in your web browser:
   - Simply double-click `index.html`, or
   - Right-click and select "Open with" > your preferred browser, or
   - Use a local server (recommended):
   ```bash
   # If you have Python 3
   python -m http.server 8000
   # Then visit http://localhost:8000
   ```

## 📖 How to Use

### Adding a Subject
1. Click on the **"Subjects"** tab
2. Click **"+ Add Subject"** button
3. Fill in:
   - Subject Name (e.g., Anatomy, Biochemistry)
   - Minimum Attendance % (default: 75%)
   - Total Lectures Conducted
   - Lectures Attended So Far
4. Click **"Add Subject"**

### Logging Attendance
1. Go to the **"Attendance"** tab
2. Click **"📍 Log Attendance"** on any subject
3. Choose **"✓ Yes, Attended"** or **"✗ No, Missed"**
4. Your attendance will update immediately

### Uploading Timetable
1. Go to the **"Timetable"** tab
2. Click the upload area or drag and drop your file
3. Supported formats: PDF, PNG, JPG
4. Your timetable is saved automatically

### Viewing Analytics
1. Click on the **"Analytics"** tab
2. View overall statistics:
   - Total subjects
   - Average attendance
   - Subjects at risk
   - Subject-wise breakdown

### Dashboard Overview
1. The **"Dashboard"** tab shows:
   - Current attendance percentage for each subject
   - Visual attendance bar
   - How many lectures you can miss
   - Subject status (Safe/Warning/At Risk)

## 🎨 Color Scheme & Status Indicators

- **Green (✓ Safe)**: Attendance is 10% above minimum or more
- **Yellow (⚠ Warning)**: Attendance is at or slightly above minimum
- **Red (✗ At Risk)**: Attendance is below minimum

## 💡 Example Workflow

1. **Start of Semester**: Add all your subjects with their requirements
2. **Daily**: After each class, click "Log Attendance" to mark yourself present
3. **Weekly**: Check the dashboard to see your attendance status
4. **Mid-Semester**: Use "Can Miss" info to know your buffer
5. **End**: Analytics show your overall performance

## 📝 Sample Data

The app comes empty. Here's what you might add:

**Subject 1: Anatomy**
- Min Attendance: 75%
- Total Lectures: 60
- Attended: 45

**Subject 2: Biochemistry**
- Min Attendance: 80%
- Total Lectures: 50
- Attended: 42

## 🔒 Data Privacy

- ✅ All data stored locally in your browser
- ✅ No data sent to any server
- ✅ No cloud storage required
- ✅ Works offline
- ⚠️ Data will be cleared if you clear browser cache/cookies

### Backup Your Data
To backup your attendance records:
1. Open browser DevTools (F12)
2. Go to Console tab
3. Type: `localStorage.getItem('subjects')`
4. Copy the JSON output
5. Save it to a text file

## 🐛 Troubleshooting

### Data Not Saving
- Check if localStorage is enabled in browser
- Try a different browser
- Clear cache and reload

### Timetable Not Showing
- Ensure file size is reasonable (< 10MB)
- Try a different image format
- Delete and re-upload

### App Not Loading
- Clear browser cache
- Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
- Try a different browser

## 📱 Responsive Design

- ✅ Mobile-friendly interface
- ✅ Tablets supported
- ✅ Desktop optimized
- ✅ Works on all screen sizes

## 🎯 Future Enhancements

- [ ] Cloud sync with Google/GitHub account
- [ ] Export attendance reports as PDF
- [ ] Email reminders for low attendance
- [ ] Predictive analysis for final attendance
- [ ] Multiple device sync
- [ ] Dark mode
- [ ] Multi-language support
- [ ] Attendance warnings and notifications

## 🤝 Contributing

Feel free to fork, modify, and submit pull requests!

## 📄 License

This project is open-source and available for personal and educational use.

## 💬 Support

For issues or suggestions:
1. Open an issue on GitHub
2. Provide details about the problem
3. Include screenshots if applicable

## 👨‍💼 Author

Created by: [@ahmadlarr012-lgtm](https://github.com/ahmadlarr012-lgtm)

For medical students to keep record of their attendance 📚

---

**Stay on top of your attendance! 🎓**
