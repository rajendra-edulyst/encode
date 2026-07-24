export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: 'student' | 'teacher' | 'admin';
    profileImage: string;
    enrollmentDate: string;
    status: 'active' | 'inactive';
    studentId?: string;
    department?: string;
    year?: number;
    gpa?: number;
  }
  
  export interface Assignment {
    id: string;
    title: string;
    subject: string;
    dueDate: string;
    status: 'pending' | 'submitted' | 'graded';
    grade?: number;
    maxGrade: number;
    submissionDate?: string;
  }
  
  export interface Quiz {
    id: string;
    title: string;
    subject: string;
    date: string;
    duration: string;
    score?: number;
    maxScore: number;
    status: 'upcoming' | 'completed';
  }
  
  export interface Attendance {
    id: string;
    subject: string;
    date: string;
    status: 'present' | 'absent' | 'late';
  }
  
  export const mockUsers: User[] = [
    {
      id: "1",
      email: "john.doe@example.com",
      firstName: "VGU",
      lastName: "Doe",
      role: "student",
      profileImage: "https://i.pravatar.cc/150?u=johndoe",
      enrollmentDate: "2023-09-01",
      status: "active",
      studentId: "STU10001",
      department: "Computer Science",
      year: 2,
      gpa: 3.7
    },
    {
      id: "2",
      email: "student@vgu.com",
      firstName: "Jane",
      lastName: "Smith",
      role: "student",
      profileImage: "https://i.pravatar.cc/150?u=janesmith",
      enrollmentDate: "2023-09-01",
      status: "active",
      studentId: "STU10002",
      department: "Mathematics",
      year: 3,
      gpa: 3.9
    },
    {
      id: "3",
      email: "prof.brown@example.com",
      firstName: "Robert",
      lastName: "Brown",
      role: "teacher",
      profileImage: "https://i.pravatar.cc/150?u=profbrown",
      enrollmentDate: "2020-01-15",
      status: "active",
      department: "Computer Science"
    }
  ];
  
  export const mockAssignments: Record<string, Assignment[]> = {
    "1": [
      {
        id: "a1",
        title: "Data Structures Project",
        subject: "Computer Science",
        dueDate: "2024-05-20",
        status: "submitted",
        submissionDate: "2024-05-18",
        maxGrade: 100
      },
      {
        id: "a2",
        title: "Algorithm Analysis",
        subject: "Computer Science",
        dueDate: "2024-05-25",
        status: "pending",
        maxGrade: 50
      },
      {
        id: "a3",
        title: "Web Development Portfolio",
        subject: "Web Technologies",
        dueDate: "2024-06-10",
        status: "graded",
        grade: 92,
        maxGrade: 100,
        submissionDate: "2024-06-08"
      }
    ],
    "2": [
      {
        id: "a4",
        title: "Calculus Problem Set",
        subject: "Mathematics",
        dueDate: "2024-05-22",
        status: "graded",
        grade: 88,
        maxGrade: 100,
        submissionDate: "2024-05-20"
      },
      {
        id: "a5",
        title: "Statistical Analysis Project",
        subject: "Statistics",
        dueDate: "2024-05-30",
        status: "submitted",
        submissionDate: "2024-05-29",
        maxGrade: 100
      }
    ]
  };
  
  export const mockQuizzes: Record<string, Quiz[]> = {
    "1": [
      {
        id: "q1",
        title: "Data Structures Quiz 1",
        subject: "Computer Science",
        date: "2024-05-15",
        duration: "45 min",
        score: 87,
        maxScore: 100,
        status: "completed"
      },
      {
        id: "q2",
        title: "Programming Languages Midterm",
        subject: "Computer Science",
        date: "2024-05-25",
        duration: "90 min",
        status: "upcoming",
        maxScore: 100
      }
    ],
    "2": [
      {
        id: "q3",
        title: "Linear Algebra Quiz",
        subject: "Mathematics",
        date: "2024-05-18",
        duration: "60 min",
        score: 93,
        maxScore: 100,
        status: "completed"
      },
      {
        id: "q4",
        title: "Statistics Final Exam",
        subject: "Mathematics",
        date: "2024-06-20",
        duration: "120 min",
        status: "upcoming",
        maxScore: 100
      }
    ]
  };
  
  export const mockAttendance: Record<string, Attendance[]> = {
    "1": [
      {
        id: "att1",
        subject: "Data Structures",
        date: "2024-05-10",
        status: "present"
      },
      {
        id: "att2",
        subject: "Web Technologies",
        date: "2024-05-11",
        status: "present"
      },
      {
        id: "att3",
        subject: "Data Structures",
        date: "2024-05-13",
        status: "late"
      },
      {
        id: "att4",
        subject: "Web Technologies",
        date: "2024-05-14",
        status: "absent"
      }
    ],
    "2": [
      {
        id: "att5",
        subject: "Calculus II",
        date: "2024-05-10",
        status: "present"
      },
      {
        id: "att6",
        subject: "Statistics",
        date: "2024-05-11",
        status: "present"
      },
      {
        id: "att7",
        subject: "Linear Algebra",
        date: "2024-05-13",
        status: "present"
      }
    ]
  };
  