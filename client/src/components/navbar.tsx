import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { Heart, Star, Menu, X } from 'lucide-react';
import { UserProgress } from '@shared/schema';
import { queryClient } from '@/lib/queryClient';
import { BackgroundMusic } from './ui/background-music';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [_, setLocation] = useLocation();
  const { user, logoutMutation } = useAuth();

  // Query to get user progress
  const { data: userProgress } = useQuery<UserProgress>({
    queryKey: ["/api/user/progress"],
    enabled: !!user,
  });

  // Effect para actualizar la caché del usuario cuando cambia el progreso
  useEffect(() => {
    if (user && userProgress) {
      queryClient.setQueryData(["/api/user"], {
        ...user,
        points: userProgress.points,
        lives: userProgress.lives
      });
    }
  }, [userProgress, user]);

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-cyberbg border-b border-cyberprimary shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/">
              <a className="flex-shrink-0 flex items-center">
                <span className="font-cyber text-2xl font-bold text-white">Cyber<span className="text-cyberaccent">Calc</span></span>
              </a>
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-6">
              <Link href="/">
                <a className="border-transparent hover:border-cyberaccent text-white hover:text-cyberaccent px-3 py-2 font-medium hover:bg-opacity-10 hover:bg-cyberaccent rounded-md transition duration-150">Inicio</a>
              </Link>
              <Link href="/teoria">
                <a className="border-transparent hover:border-cyberaccent text-white hover:text-cyberaccent px-3 py-2 font-medium hover:bg-opacity-10 hover:bg-cyberaccent rounded-md transition duration-150">Teoría</a>
              </Link>
              <Link href="/quiz">
                <a className="border-transparent hover:border-cyberaccent text-white hover:text-cyberaccent px-3 py-2 font-medium hover:bg-opacity-10 hover:bg-cyberaccent rounded-md transition duration-150">Quiz</a>
              </Link>
              <Link href="/retos">
                <a className="border-transparent hover:border-cyberaccent text-white hover:text-cyberaccent px-3 py-2 font-medium hover:bg-opacity-10 hover:bg-cyberaccent rounded-md transition duration-150">Retos</a>
              </Link>
              <Link href="/ranking">
                <a className="border-transparent hover:border-cyberaccent text-white hover:text-cyberaccent px-3 py-2 font-medium hover:bg-opacity-10 hover:bg-cyberaccent rounded-md transition duration-150">Ranking</a>
              </Link>
              <Link href="/juegos-historia">
                <a className="border-2 border-blue-500 text-blue-400 hover:text-white px-4 py-2 font-bold bg-gradient-to-r from-blue-900 to-purple-900 hover:from-blue-700 hover:to-purple-700 rounded-md transition-all duration-300 shadow-lg shadow-blue-700/50 hover:shadow-blue-600/80 transform hover:scale-105 animate-pulse">JUEGOS DE HISTORIA</a>
              </Link>
            </div>
          </div>

          <div className="hidden sm:ml-6 sm:flex sm:items-center gap-2">
            {/* Controles de sonido */}
            <div className="flex items-center gap-2 mr-2">
            </div>

            {user && (
              <>
                <div id="user-stats" className="flex items-center mr-4 px-3 py-2 bg-cyberdark border border-cyberprimary rounded-lg shadow-neon-blue">
                  <div className="flex items-center mr-4 px-2 py-1 bg-cyberbg rounded-md">
                    <Heart className="h-5 w-5 text-red-500 mr-1" fill="#ef4444" />
                    <span id="lives-count" className="font-medium text-white">{user?.lives !== undefined ? user.lives : 3}</span>
                  </div>
                  <div className="flex items-center px-2 py-1 bg-cyberbg rounded-md">
                    <Star className="h-5 w-5 text-yellow-500 mr-1" fill="#eab308" />
                    <span id="points-count" className="font-medium text-white">{user?.points !== undefined ? user.points : 0}</span>
                  </div>
                </div>
                <Button 
                  onClick={handleLogout} 
                  className="cyber-btn bg-cyberprimary hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-md transition duration-300"
                >
                  Cerrar Sesión
                </Button>
              </>
            )}
          </div>

          <div className="flex items-center sm:hidden">
            <button 
              type="button" 
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-cyberaccent focus:outline-none"
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`sm:hidden ${isMenuOpen ? 'block' : 'hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1">
          <Link href="/">
            <a onClick={closeMenu} className="block px-3 py-2 rounded-md text-white font-medium hover:bg-cyberprimary hover:bg-opacity-20">Inicio</a>
          </Link>
          <Link href="/teoria">
            <a onClick={closeMenu} className="block px-3 py-2 rounded-md text-white font-medium hover:bg-cyberprimary hover:bg-opacity-20">Teoría</a>
          </Link>
          <Link href="/quiz">
            <a onClick={closeMenu} className="block px-3 py-2 rounded-md text-white font-medium hover:bg-cyberprimary hover:bg-opacity-20">Quiz</a>
          </Link>
          <Link href="/retos">
            <a onClick={closeMenu} className="block px-3 py-2 rounded-md text-white font-medium hover:bg-cyberprimary hover:bg-opacity-20">Retos</a>
          </Link>
          <Link href="/ranking">
            <a onClick={closeMenu} className="block px-3 py-2 rounded-md text-white font-medium hover:bg-cyberprimary hover:bg-opacity-20">Ranking</a>
          </Link>
          <Link href="/juegos-historia">
            <a onClick={closeMenu} className="block px-4 py-3 rounded-md text-blue-400 font-bold bg-gradient-to-r from-blue-900 to-purple-900 hover:from-blue-700 hover:to-purple-700 border-2 border-blue-500 hover:text-white shadow-lg shadow-blue-700/50 hover:shadow-blue-600/80 transform hover:scale-105 animate-pulse">JUEGOS DE HISTORIA</a>
          </Link>

          {/* Controles de tema en móvil */}
          <div className="mt-3 flex items-center justify-start gap-2 px-3 py-2">
            <span className="text-white text-sm ml-2">Cambiar tema</span>
          </div>
        </div>

        {user && (
          <div className="pt-4 pb-3 border-t border-cyberprimary">
            <div className="flex items-center px-5">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-cyberprimary flex items-center justify-center">
                  <span className="text-xl font-bold">{user.username.charAt(0).toUpperCase()}</span>
                </div>
              </div>
              <div className="ml-3">
                <div className="text-base font-medium leading-none text-white">{user.username}</div>
                <div className="flex space-x-2 mt-2">
                  <div className="flex items-center px-2 py-1 bg-cyberbg rounded-md">
                    <Heart className="h-4 w-4 text-red-500 mr-1" fill="#ef4444" />
                    <span className="text-xs font-medium text-white">{user?.lives !== undefined ? user.lives : 3}</span>
                  </div>
                  <div className="flex items-center px-2 py-1 bg-cyberbg rounded-md">
                    <Star className="h-4 w-4 text-yellow-500 mr-1" fill="#eab308" />
                    <span className="text-xs font-medium text-white">{user?.points !== undefined ? user.points : 0}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-3 px-2">
              <Button 
                onClick={() => {
                  handleLogout();
                  closeMenu();
                }} 
                className="block w-full text-center px-3 py-2 rounded-md text-white font-medium bg-cyberprimary hover:bg-purple-700"
              >
                Cerrar Sesión
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}