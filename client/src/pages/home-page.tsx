import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Link } from "wouter";
import { motion } from "framer-motion";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-cyberdark text-white">
      <Navbar />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-8 sm:py-16">
          <div className="absolute inset-0 z-0 opacity-40" style={{backgroundImage: 'url("https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80")', backgroundSize: 'cover', backgroundPosition: 'center'}}></div>
          <div className="absolute inset-0 bg-gradient-to-r from-cyberdark to-transparent z-10"></div>
          
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
            <div className="max-w-3xl">
              <motion.h1 
                className="text-3xl sm:text-5xl md:text-6xl font-cyber font-bold mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <span className="block text-white">Domina el Cálculo</span>
                <span className="block text-cyberaccent">como un <span className="neon-text">Pro</span></span>
              </motion.h1>
              
              <motion.p 
                className="text-xl text-gray-300 mb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                Aprende las reglas de derivación de forma interactiva, divertida y desafiante. Asciende en el ranking y demuestra tu maestría en el cálculo.
              </motion.p>
              
              <motion.div 
                className="flex flex-wrap gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Link href="/teoria">
                  <a className="cyber-btn px-6 py-3 bg-cyberprimary hover:bg-purple-700 text-white font-medium rounded-md transition duration-300 shadow-neon-purple transform hover:-translate-y-1">
                    Comenzar a Aprender
                  </a>
                </Link>
                <Link href="/quiz">
                  <a className="cyber-btn px-6 py-3 bg-cybersecondary hover:bg-blue-700 text-white font-medium rounded-md transition duration-300 shadow-neon-blue transform hover:-translate-y-1">
                    Pon a Prueba tus Habilidades
                  </a>
                </Link>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-12 bg-cyberbg">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-cyber font-bold text-center mb-12">
              <span className="text-cyberaccent">Características</span> Principales
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <motion.div 
                className="bg-cyberdark p-6 rounded-lg cyber-border transform transition duration-300 hover:scale-105"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
              >
                <div className="w-12 h-12 mb-4 rounded-full bg-cyberprimary bg-opacity-20 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-cyberprimary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-xl font-cyber font-semibold mb-2 text-white">Teoría Interactiva</h3>
                <p className="text-gray-300">Aprende las reglas de derivación con explicaciones paso a paso y ejemplos visuales. Todas las fórmulas en LaTeX para mayor claridad.</p>
              </motion.div>
              
              {/* Feature 2 */}
              <motion.div 
                className="bg-cyberdark p-6 rounded-lg cyber-border transform transition duration-300 hover:scale-105"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
              >
                <div className="w-12 h-12 mb-4 rounded-full bg-cybersecondary bg-opacity-20 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-cybersecondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-xl font-cyber font-semibold mb-2 text-white">Quiz con 3 Niveles</h3>
                <p className="text-gray-300">Desafíate con nuestro sistema de quiz en tres niveles de dificultad. Gana puntos y compite por los primeros lugares del ranking.</p>
              </motion.div>
              
              {/* Feature 3 */}
              <motion.div 
                className="bg-cyberdark p-6 rounded-lg cyber-border transform transition duration-300 hover:scale-105"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
              >
                <div className="w-12 h-12 mb-4 rounded-full bg-cyberaccent bg-opacity-20 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-cyberaccent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-cyber font-semibold mb-2 text-white">Retos Aleatorios</h3>
                <p className="text-gray-300">Enfrenta retos sorpresa con ejercicios de derivación. Cada respuesta correcta te da puntos y cada error te quita una vida.</p>
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
