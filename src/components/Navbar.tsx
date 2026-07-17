import { useState } from 'react';
import { Menu, X, GraduationCap, ChevronDown } from 'lucide-react';

interface NavbarProps {
  onTeacherLogin?: () => void;
  onStudentJoin?: () => void;
  onLiveJoin?: () => void;
  onParentLogin?: () => void;
}

export default function Navbar({ onTeacherLogin, onStudentJoin, onLiveJoin, onParentLogin }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-200">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
              SmartSchool
            </span>
          </a>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-7">
            {/* Për Kë Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setShowDropdown(true)}
              onMouseLeave={() => setShowDropdown(false)}
            >
              <button className="flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-violet-600 transition-colors">
                Për Kë
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
              {showDropdown && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 w-64">
                  <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-3 space-y-1">
                    <a href="#nxënës" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-violet-50 transition-colors group">
                      <span className="text-2xl">🎓</span>
                      <div>
                        <div className="text-sm font-semibold text-gray-900 group-hover:text-violet-600">Nxënës</div>
                        <div className="text-xs text-gray-500">Mëso duke u argëtuar</div>
                      </div>
                    </a>
                    <a href="#prindër" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-emerald-50 transition-colors group">
                      <span className="text-2xl">👨‍👩‍👧‍👦</span>
                      <div>
                        <div className="text-sm font-semibold text-gray-900 group-hover:text-emerald-600">Prindër</div>
                        <div className="text-xs text-gray-500">Ndiq progresin e fëmijës</div>
                      </div>
                    </a>
                    <a href="#mësues" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-blue-50 transition-colors group">
                      <span className="text-2xl">👩‍🏫</span>
                      <div>
                        <div className="text-sm font-semibold text-gray-900 group-hover:text-blue-600">Mësues</div>
                        <div className="text-xs text-gray-500">Mjete të fuqishme mësimore</div>
                      </div>
                    </a>
                    <a href="#koordinatori" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-amber-50 transition-colors group">
                      <span className="text-2xl">🛡️</span>
                      <div>
                        <div className="text-sm font-semibold text-gray-900 group-hover:text-amber-600">Koordinatori</div>
                        <div className="text-xs text-gray-500">Menaxhim i shkollës</div>
                      </div>
                    </a>
                  </div>
                </div>
              )}
            </div>
            <a href="#veçori" className="text-sm font-medium text-gray-600 hover:text-violet-600 transition-colors">Veçoritë</a>
            <a href="#lëndët" className="text-sm font-medium text-gray-600 hover:text-violet-600 transition-colors">Lëndët</a>
            <a href="#si-funksionon" className="text-sm font-medium text-gray-600 hover:text-violet-600 transition-colors">Si Funksionon</a>
            <a href="#çmimet" className="text-sm font-medium text-gray-600 hover:text-violet-600 transition-colors">Çmimet</a>
            <a href="#dëshmitë" className="text-sm font-medium text-gray-600 hover:text-violet-600 transition-colors">Dëshmitë</a>
          </div>

          {/* Desktop Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            <button 
              onClick={onLiveJoin}
              className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-xl hover:bg-red-100 transition-colors flex items-center gap-1.5"
            >
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              Bashkohu Live
            </button>
            <button 
              onClick={onStudentJoin}
              className="px-4 py-2 text-sm font-medium text-violet-600 bg-violet-50 rounded-xl hover:bg-violet-100 transition-colors"
            >
              🎓 Bashkohu në Klasë
            </button>
            <button 
              onClick={onParentLogin}
              className="px-4 py-2 text-sm font-medium text-emerald-600 bg-emerald-50 rounded-xl hover:bg-emerald-100 transition-colors"
            >
              👨‍👩‍👧‍👦 Prind
            </button>
            <button 
              onClick={onTeacherLogin}
              className="px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg shadow-blue-200 hover:shadow-blue-300"
            >
              👩‍🏫 Hyr si Mësues
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 shadow-xl">
          <div className="px-4 py-4 space-y-1">
            {/* Për Kë Links */}
            <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Për Kë</div>
            <a href="#nxënës" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-violet-50 hover:text-violet-600 rounded-lg transition-colors">
              🎓 Nxënës
            </a>
            <a href="#prindër" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-emerald-50 hover:text-emerald-600 rounded-lg transition-colors">
              👨‍👩‍👧‍👦 Prindër
            </a>
            <a href="#mësues" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors">
              👩‍🏫 Mësues
            </a>
            <div className="py-2"><div className="border-t border-gray-100" /></div>
            <a href="#veçori" onClick={() => setIsOpen(false)} className="block px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-violet-50 hover:text-violet-600 rounded-lg transition-colors">Veçoritë</a>
            <a href="#lëndët" onClick={() => setIsOpen(false)} className="block px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-violet-50 hover:text-violet-600 rounded-lg transition-colors">Lëndët</a>
            <a href="#si-funksionon" onClick={() => setIsOpen(false)} className="block px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-violet-50 hover:text-violet-600 rounded-lg transition-colors">Si Funksionon</a>
            <a href="#çmimet" onClick={() => setIsOpen(false)} className="block px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-violet-50 hover:text-violet-600 rounded-lg transition-colors">Çmimet</a>
            <a href="#dëshmitë" onClick={() => setIsOpen(false)} className="block px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-violet-50 hover:text-violet-600 rounded-lg transition-colors">Dëshmitë</a>
            <div className="pt-3 border-t border-gray-100 space-y-2">
              <button className="w-full px-4 py-2.5 text-sm font-medium text-gray-700 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                Hyr
              </button>
              <button className="w-full px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-violet-600 to-indigo-600 rounded-xl">
                Regjistrohu Falas
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
