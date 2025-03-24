import { Link } from 'wouter';

export default function Footer() {
  return (
    <footer className="bg-cyberdark border-t border-cyberprimary py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center text-center">
          <span className="font-cyber text-2xl font-bold text-white">Cyber<span className="text-cyberaccent">Calc</span></span>
          <div className="mt-4 text-gray-400">
            <p>Creador: Cesar Puerto</p>
            <p className="mt-2">Correo electrónico: cesarabdiel1623@gmail.com</p>
          </div>
          <div className="mt-8 pt-8 border-t border-cyberprimary border-opacity-20 w-full">
            <p className="text-gray-400 text-center">&copy; {new Date().getFullYear()} CyberCalc. Todos los derechos reservados.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}