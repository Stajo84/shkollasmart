export interface Teacher {
  id: string;
  name: string;
  email: string;
  school?: string;
  avatar?: string;
  isCoordinator?: boolean;
}

export interface Student {
  id: string;
  name: string;
  joinedAt: Date;
}

export interface Classroom {
  id: string;
  name: string;
  subject: string;
  grade: string;
  joinCode: string;
  teacherId: string;
  students: Student[];
  createdAt: Date;
  color: string;
}

export interface Quiz {
  id: string;
  title: string;
  classroomId: string;
  questions: number;
  createdAt: Date;
}
