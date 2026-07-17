import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Teacher, Classroom, Student } from '../types';

interface AuthContextType {
  teacher: Teacher | null;
  isAuthenticated: boolean;
  classrooms: Classroom[];
  login: (email: string, password: string) => { success: boolean; isCoordinator: boolean };
  register: (name: string, email: string, password: string, school?: string) => boolean;
  logout: () => void;
  createClassroom: (name: string, subject: string, grade: string) => Classroom;
  deleteClassroom: (id: string) => void;
  joinClassroom: (code: string, studentName: string) => { success: boolean; classroom?: Classroom; message: string };
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const CLASSROOMS_KEY = 'ss_classrooms';

function generateJoinCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) code += chars.charAt(Math.floor(Math.random() * chars.length));
  return code;
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}

const classroomColors = [
  'from-violet-500 to-purple-600',
  'from-blue-500 to-indigo-600',
  'from-emerald-500 to-teal-600',
  'from-orange-500 to-amber-600',
  'from-pink-500 to-rose-600',
  'from-cyan-500 to-blue-600',
];

// ── Load/Save classrooms from localStorage ──
function loadClassrooms(): Classroom[] {
  try {
    const raw = localStorage.getItem(CLASSROOMS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return parsed.map((c: any) => ({
      ...c,
      createdAt: new Date(c.createdAt),
      students: (c.students || []).map((s: any) => ({ ...s, joinedAt: new Date(s.joinedAt) })),
    }));
  } catch { return []; }
}

function saveClassrooms(classrooms: Classroom[]) {
  localStorage.setItem(CLASSROOMS_KEY, JSON.stringify(classrooms));
}

// ── Default sample classrooms ──
function createSampleClassrooms(): Classroom[] {
  const samples: Classroom[] = [
    {
      id: generateId(),
      name: 'Matematikë 7A',
      subject: 'Matematikë',
      grade: 'Klasa 7',
      joinCode: generateJoinCode(),
      teacherId: 'demo',
      students: [
        { id: '1', name: 'Arbi Gashi', joinedAt: new Date() },
        { id: '2', name: 'Ema Berisha', joinedAt: new Date() },
        { id: '3', name: 'Luan Krasniqi', joinedAt: new Date() },
      ],
      createdAt: new Date(),
      color: classroomColors[0]
    },
    {
      id: generateId(),
      name: 'Shkencë 7A',
      subject: 'Shkencë',
      grade: 'Klasa 7',
      joinCode: generateJoinCode(),
      teacherId: 'demo',
      students: [
        { id: '4', name: 'Drita Hoxha', joinedAt: new Date() },
        { id: '5', name: 'Alban Murati', joinedAt: new Date() },
      ],
      createdAt: new Date(),
      color: classroomColors[1]
    }
  ];
  saveClassrooms(samples);
  return samples;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [classrooms, setClassrooms] = useState<Classroom[]>(() => {
    const stored = loadClassrooms();
    return stored.length > 0 ? stored : createSampleClassrooms();
  });

  // Persist classrooms to localStorage whenever they change
  useEffect(() => {
    saveClassrooms(classrooms);
  }, [classrooms]);

  const login = (idOrEmail: string, password: string): { success: boolean; isCoordinator: boolean } => {
    if (idOrEmail === 'Shkolla2026' || (idOrEmail.includes('@') && password.length >= 6)) {
      const isCoordinator = idOrEmail === 'Shkolla2026';
      const name = isCoordinator ? 'Koordinatori' : idOrEmail.split('@')[0];

      setTeacher({
        id: isCoordinator ? 'COORD-2026' : generateId(),
        name: isCoordinator ? 'Koordinatori i Shkollës' : name.charAt(0).toUpperCase() + name.slice(1),
        email: isCoordinator ? 'koordinatori@smartschool.al' : idOrEmail,
        avatar: isCoordinator ? '🛡️' : '👩‍🏫',
        isCoordinator,
      });

      // If no classrooms exist yet, create samples
      if (classrooms.length === 0) {
        setClassrooms(createSampleClassrooms());
      }

      return { success: true, isCoordinator };
    }
    return { success: false, isCoordinator: false };
  };

  const register = (name: string, email: string, password: string, school?: string): boolean => {
    if (name && email && password.length >= 6) {
      setTeacher({ id: generateId(), name, email, school, avatar: '👩‍🏫' });
      return true;
    }
    return false;
  };

  const logout = () => {
    setTeacher(null);
    // Don't clear classrooms — they persist for students to join
  };

  const createClassroom = (name: string, subject: string, grade: string): Classroom => {
    const newClassroom: Classroom = {
      id: generateId(),
      name,
      subject,
      grade,
      joinCode: generateJoinCode(),
      teacherId: teacher?.id || '',
      students: [],
      createdAt: new Date(),
      color: classroomColors[classrooms.length % classroomColors.length]
    };
    setClassrooms(prev => [...prev, newClassroom]);
    return newClassroom;
  };

  const deleteClassroom = (id: string) => {
    setClassrooms(prev => prev.filter(c => c.id !== id));
  };

  const joinClassroom = (code: string, studentName: string): { success: boolean; classroom?: Classroom; message: string } => {
    // Search in ALL classrooms (persisted in localStorage)
    const allClassrooms = loadClassrooms();
    const merged = [...allClassrooms];
    
    // Also check current state classrooms (in case just created)
    classrooms.forEach(c => {
      if (!merged.find(m => m.id === c.id)) merged.push(c);
    });

    const classroom = merged.find(c => c.joinCode.toUpperCase() === code.toUpperCase());

    if (!classroom) {
      return { success: false, message: 'Kodi i klasës nuk u gjet. Kontrollo kodin dhe provo përsëri.' };
    }

    const existingStudent = classroom.students.find(s => s.name.toLowerCase() === studentName.toLowerCase());
    if (existingStudent) {
      return { success: true, classroom, message: `Mirë se u ktheve, ${studentName}!` };
    }

    const newStudent: Student = {
      id: generateId(),
      name: studentName,
      joinedAt: new Date()
    };

    // Update both state and localStorage
    const updatedClassrooms = merged.map(c =>
      c.id === classroom.id
        ? { ...c, students: [...c.students, newStudent] }
        : c
    );
    setClassrooms(updatedClassrooms);
    saveClassrooms(updatedClassrooms);

    const updatedClassroom = updatedClassrooms.find(c => c.id === classroom.id)!;
    return { success: true, classroom: updatedClassroom, message: `U bashkove me sukses në klasën "${classroom.name}"!` };
  };

  return (
    <AuthContext.Provider value={{
      teacher,
      isAuthenticated: !!teacher,
      classrooms,
      login,
      register,
      logout,
      createClassroom,
      deleteClassroom,
      joinClassroom
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
