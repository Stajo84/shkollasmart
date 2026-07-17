export interface TeamMember {
  id: string;
  name: string;
  role: string;
  subject: string;
  avatar: string;
  email: string;
  phone?: string;
  qualification: string;
  certifications: string[];
}

export interface SubjectTeam {
  id: string;
  name: string;
  subject: string;
  emoji: string;
  color: string;
  leader: TeamMember;
  members: TeamMember[];
}

export interface ProfessionalNetwork {
  id: string;
  name: string;
  school: string;
  role: string;
  avatar: string;
  connected: boolean;
}

export interface Training {
  id: string;
  title: string;
  type: 'online' | 'fizik' | 'hibrid';
  date: string;
  duration: string;
  status: 'planifikuar' | 'në-progres' | 'përfunduar';
  participants: number;
  maxParticipants: number;
  description: string;
}

export interface UploadedMaterial {
  id: string;
  name: string;
  type: 'pdf' | 'word' | 'ppt' | 'excel' | 'video' | 'image' | 'other';
  size: string;
  uploadedAt: Date;
  sharedWith: string[];
  isPrivate: boolean;
  aiProcessed: boolean;
  aiQuizGenerated: boolean;
}

export interface Meeting {
  id: string;
  title: string;
  date: string;
  time: string;
  duration: string;
  participants: string[];
  meetLink: string;
  status: 'planifikuar' | 'live' | 'përfunduar';
  type: 'ekip' | 'individual' | 'shkollë';
}

export interface AIActivity {
  id: string;
  materialId: string;
  materialName: string;
  type: 'kuiz' | 'flashcard' | 'prezantim' | 'ushtrime';
  questionsCount: number;
  createdAt: Date;
  sharedWith: string[];
}
