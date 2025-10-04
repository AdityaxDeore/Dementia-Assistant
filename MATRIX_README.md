# Academic Score Analysis System - Sparse Matrix Implementation

A C++ program that demonstrates sparse matrix operations for analyzing student academic performance data.

## 📋 Project Information

- **Author**: Aditya Deore
- **PRN**: 124B1F116
- **Division**: B
- **Topic**: Sparse Matrix Implementation for Academic Score Analysis

## 🎯 Overview

This program implements a sparse matrix data structure to efficiently store and analyze academic scores for students across multiple courses. It converts a traditional 2D matrix containing mostly zero values into a compact sparse representation, making it memory-efficient for large datasets with sparse data.

## ✨ Features

- **Sparse Matrix Conversion**: Converts a 2D academic score matrix to sparse format
- **Academic Data Analysis**: 
  - Calculate course averages
  - Identify top-performing courses
  - Find highest-scoring students
- **Memory Efficient**: Only stores non-zero values
- **Detailed Reporting**: Comprehensive output with formatted results

## 🏗️ Data Structure

### Matrix Configuration
- **Students**: 4 students (indexed 0-3)
- **Courses**: 4 courses (indexed 0-3)
- **Storage**: Only non-zero scores are stored

### Sparse Matrix Structure
```cpp
struct AcademicRecord {
    int studentIndex;    // Row index (student)
    int courseIndex;     // Column index (course)
    float score;         // Non-zero score value
}
```

## 📊 Sample Data

The program uses the following academic score matrix:
```
Student\Course   Course1  Course2  Course3  Course4
Student 1           0        0        0       90
Student 2          85        0        0        0
Student 3           0        0        0       98
Student 4           0        0        0        0
```

## 🚀 How to Run

### Prerequisites
- C++ compiler (GCC, Clang, or Visual Studio)
- Basic understanding of C++ and data structures

### Compilation and Execution

1. **Compile the program**:
   ```bash
   g++ -o matrix_analysis matrix.cpp
   ```

2. **Run the executable**:
   ```bash
   ./matrix_analysis
   ```

### For Windows:
```cmd
g++ matrix.cpp -o matrix_analysis.exe
matrix_analysis.exe
```

## 📈 Program Flow

1. **Matrix Initialization**: Pre-defined academic score matrix
2. **Sparse Conversion**: Convert 2D matrix to sparse format
3. **Data Display**: Show both original and sparse representations
4. **Analysis Operations**:
   - Calculate average scores per course
   - Identify top-performing course
   - Find highest-scoring student
5. **Results Output**: Formatted analysis results

## 🔍 Key Functions

| Function | Description |
|----------|-------------|
| `convertToSparseMatrix()` | Converts 2D matrix to sparse format |
| `displaySparseMatrix()` | Shows original and sparse representations |
| `calculateCourseAverages()` | Computes average score for each course |
| `findTopPerformingCourse()` | Identifies course with highest average |
| `findTopStudent()` | Finds student with highest individual score |

## 📊 Sample Output

```
Academic Score Analysis System - Aditya Deore
=============================================

========== Academic Score Matrix ==========

	0	0	0	90
	85	0	0	0
	0	0	0	98
	0	0	0	0

Student Index	Course Index	Score
-------------------------------------------
	0		3		90
	1		0		85
	2		3		98

========== Course Averages ==========
Course 1 Average: 85
Course 2 Average: 0
Course 3 Average: 0
Course 4 Average: 94

========== Top Performing Course ==========
Course 4 has the highest average: 94

========== Top Student Performance ==========
Student 3 achieved the highest score: 98

Analysis completed successfully!
```

## 🎓 Educational Value

This program demonstrates:
- **Sparse Matrix Concepts**: Efficient storage of sparse data
- **Data Structure Design**: Custom structures for academic data
- **Algorithm Implementation**: Conversion and analysis algorithms
- **Memory Optimization**: Storing only meaningful data
- **Academic Analytics**: Real-world application of data structures

## 🔧 Customization

To modify the program for different datasets:

1. **Change Matrix Size**: Update `MAX_STUDENTS` and `MAX_COURSES` constants
2. **Update Data**: Modify the `academicMatrix` initialization
3. **Add Features**: Extend with additional analysis functions
4. **Input System**: Add dynamic data input capabilities

## 🤝 Contributing

This is an academic project, but suggestions for improvements are welcome:
- Additional statistical analysis features
- Dynamic memory allocation
- File I/O capabilities
- Enhanced reporting formats

## 📚 Learning Outcomes

- Understanding sparse matrix applications
- Implementing efficient data structures
- Academic data analysis techniques
- C++ programming best practices
- Memory-efficient algorithm design

---

**Built with ❤️ for Data Structures and Academic Analytics**