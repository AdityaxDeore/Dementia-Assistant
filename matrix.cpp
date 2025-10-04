/******************************************************************************

Name - Aditya Deore
PRN - 124B1F116
Division - B
Topic - Sparse Matrix Implementation for Academic Score Analysis

******************************************************************************/

#include <iostream>
using namespace std;

// Configuration for academic data analysis
const int MAX_STUDENTS = 4;
const int MAX_COURSES = 4;

float courseAverages[MAX_COURSES] = {0, 0, 0, 0};

float academicMatrix[MAX_STUDENTS][MAX_COURSES] = {{0, 0, 0, 90}, {85, 0, 0, 0}, {0, 0, 0, 98}, {0, 0, 0, 0}};

int elementCount = 0;

struct AcademicRecord
{
    int studentIndex, courseIndex;
    float score;
} records[MAX_STUDENTS];

void convertToSparseMatrix()
{
    int student, course;
    for(student = 0; student < MAX_STUDENTS; student++)
    {
        for(course = 0; course < MAX_COURSES; course++)
        {
            if(academicMatrix[student][course] != 0)
            {
                records[elementCount].studentIndex = student;
                records[elementCount].courseIndex = course;
                records[elementCount].score = academicMatrix[student][course];
                elementCount++;
            }
        }
    }
}

void displaySparseMatrix()
{
    int student, course;
    cout << "\n========== Academic Score Matrix ==========\n";
    for(student = 0; student < MAX_STUDENTS; student++)
    {
        cout << "\n";
        for(course = 0; course < MAX_COURSES; course++)
        {
            cout << "\t" << academicMatrix[student][course];
        }
    }
    cout << "\n\nStudent Index\tCourse Index\tScore\n";
    cout << "-------------------------------------------\n";
    for(int i = 0; i < elementCount; i++)
    {
        cout << "\t" << records[i].studentIndex << "\t\t" << records[i].courseIndex << "\t\t" << records[i].score << "\n";
    }
}

void calculateCourseAverages()
{
    float totalScore;
    int course, record;
    int studentCount;
    
    for(course = 0; course < MAX_COURSES; course++)
    {
        studentCount = 0;
        totalScore = 0;
        for(record = 0; record < elementCount; record++)
        {
            if(records[record].courseIndex == course)
            {
                totalScore += records[record].score;
                studentCount++;
            }
        }
        if(studentCount > 0)
            courseAverages[course] = totalScore / studentCount;
        else
            courseAverages[course] = 0;
    }
    
    cout << "\n\n========== Course Averages ==========\n";
    for(course = 0; course < MAX_COURSES; course++)
    {
        cout << "Course " << course + 1 << " Average: " << courseAverages[course] << "\n";
    }
}

void findTopPerformingCourse()
{
    int bestCourse = 0;
    float highestAverage = courseAverages[0];
    
    for(int course = 1; course < MAX_COURSES; course++)
    {
        if(courseAverages[course] > highestAverage)
        {
            highestAverage = courseAverages[course];
            bestCourse = course;
        }
    }
    
    cout << "\n========== Top Performing Course ==========\n";
    cout << "Course " << bestCourse + 1 << " has the highest average: " << highestAverage << "\n";
}

void findTopStudent()
{
    int topStudentIndex = 0;
    float highestScore = 0;
    
    for(int record = 0; record < elementCount; record++)
    {
        if(records[record].score > highestScore)
        {
            highestScore = records[record].score;
            topStudentIndex = records[record].studentIndex;
        }
    }
    
    cout << "\n========== Top Student Performance ==========\n";
    cout << "Student " << topStudentIndex + 1 << " achieved the highest score: " << highestScore << "\n";
}

int main() 
{
    cout << "Academic Score Analysis System - Aditya Deore\n";
    cout << "=============================================\n";
    
    convertToSparseMatrix();
    displaySparseMatrix();
    calculateCourseAverages();
    findTopPerformingCourse();
    findTopStudent();
    
    cout << "\n\nAnalysis completed successfully!\n";
    return 0;
}
/*
Sample Output - Aditya Deore's Academic Score Analysis System

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
*/