import { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';

// Pages
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ForWho from './components/ForWho';
import Features from './components/Features';
import Subjects from './components/Subjects';
import HowItWorks from './components/HowItWorks';
import LiveDemo from './components/LiveDemo';
import AISection from './components/AISection';
import Testimonials from './components/Testimonials';
import Pricing from './components/Pricing';
import CTA from './components/CTA';
import Footer from './components/Footer';
import TeacherAuth from './components/teacher/TeacherAuth';
import TeacherDashboard from './components/teacher/TeacherDashboard';
import CoordinatorDashboard from './components/coordinator/CoordinatorDashboard';
import StudentJoin from './components/student/StudentJoin';
import StudentLiveJoin from './components/live/StudentLiveJoin';
import ParentAuth from './components/parent/ParentAuth';
import ParentDashboard from './components/parent/ParentDashboard';

type Page = 'home' | 'auth' | 'teacher' | 'coordinator' | 'join' | 'live' | 'parent-auth' | 'parent';

function AppRouter() {
  const [page, setPage] = useState<Page>('home');
  const [parentInfo, setParentInfo] = useState<{ name: string; contact: string; method: string } | null>(null);
  const { teacher } = useAuth();

  const goHome = () => setPage('home');

  // ─── Auth page ───
  if (page === 'auth') {
    return (
      <TeacherAuth
        onBack={goHome}
        onSuccess={(isCoord: boolean) => setPage(isCoord ? 'coordinator' : 'teacher')}
      />
    );
  }

  // ─── Teacher dashboard ───
  if (page === 'teacher') {
    // Safety: if coordinator somehow here, redirect
    if (teacher?.isCoordinator) {
      return <CoordinatorDashboard onLogout={goHome} />;
    }
    return <TeacherDashboard onLogout={goHome} />;
  }

  // ─── Coordinator dashboard ───
  if (page === 'coordinator') {
    return <CoordinatorDashboard onLogout={goHome} />;
  }

  // ─── Student join classroom ───
  if (page === 'join') {
    return <StudentJoin onBack={goHome} />;
  }

  // ─── Live presentation join ───
  if (page === 'live') {
    return <StudentLiveJoin onBack={goHome} />;
  }

  // ─── Parent auth ───
  if (page === 'parent-auth') {
    return (
      <ParentAuth
        onBack={goHome}
        onSuccess={(info) => { setParentInfo(info); setPage('parent'); }}
      />
    );
  }

  // ─── Parent dashboard ───
  if (page === 'parent') {
    return (
      <ParentDashboard
        parentName={parentInfo?.name || 'Prind'}
        onLogout={() => { setParentInfo(null); goHome(); }}
      />
    );
  }

  // ─── Home page ───
  return (
    <div className="min-h-screen bg-white">
      <Navbar
        onTeacherLogin={() => setPage('auth')}
        onStudentJoin={() => setPage('join')}
        onLiveJoin={() => setPage('live')}
        onParentLogin={() => setPage('parent-auth')}
      />
      <Hero
        onTeacherClick={() => setPage('auth')}
        onStudentClick={() => setPage('join')}
      />
      <ForWho
        onStudentClick={() => setPage('join')}
        onTeacherClick={() => setPage('auth')}
      />
      <Features />
      <Subjects />
      <HowItWorks />
      <LiveDemo />
      <AISection />
      <Testimonials />
      <Pricing
        onTeacherClick={() => setPage('auth')}
        onStudentClick={() => setPage('join')}
      />
      <CTA
        onStudentClick={() => setPage('join')}
        onTeacherClick={() => setPage('auth')}
      />
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
}
