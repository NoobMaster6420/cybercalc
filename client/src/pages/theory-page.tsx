import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Latex } from "@/components/ui/latex";
import { motion } from "framer-motion";
import { Link } from "wouter";

export default function TheoryPage() {
  return (
    <div className="min-h-screen flex flex-col bg-cyberdark text-white">
      <Navbar />
      
      <main className="flex-grow">
        <section className="py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.h1 
              className="text-3xl font-cyber font-bold text-center mb-8"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Teoría de <span className="text-cyberaccent">Derivación</span>
            </motion.h1>
            
            <motion.div 
              className="bg-cyberbg rounded-lg p-6 mb-8 cyber-border"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h2 className="text-xl font-cyber font-semibold mb-4 text-white">Reglas Básicas de Derivación</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-cyberdark p-4 rounded-lg">
                  <h3 className="text-lg font-medium mb-2 text-cyberaccent">Regla de la Constante</h3>
                  <div className="mb-2 bg-black bg-opacity-30 p-3 rounded-md">
                    <Latex formula="\frac{d}{dx}[c] = 0" />
                  </div>
                  <p className="text-gray-300">La derivada de una constante es siempre cero.</p>
                </div>
                
                <div className="bg-cyberdark p-4 rounded-lg">
                  <h3 className="text-lg font-medium mb-2 text-cyberaccent">Regla de la Potencia</h3>
                  <div className="mb-2 bg-black bg-opacity-30 p-3 rounded-md">
                    <Latex formula="\frac{d}{dx}[x^n] = n \cdot x^{n-1}" />
                  </div>
                  <p className="text-gray-300">Multiplica por el exponente y reduce el exponente en 1.</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-cyberdark p-4 rounded-lg">
                  <h3 className="text-lg font-medium mb-2 text-cyberaccent">Regla de la Suma</h3>
                  <div className="mb-2 bg-black bg-opacity-30 p-3 rounded-md">
                    <Latex formula="\frac{d}{dx}[f(x) + g(x)] = \frac{d}{dx}[f(x)] + \frac{d}{dx}[g(x)]" />
                  </div>
                  <p className="text-gray-300">La derivada de una suma es la suma de las derivadas.</p>
                </div>
                
                <div className="bg-cyberdark p-4 rounded-lg">
                  <h3 className="text-lg font-medium mb-2 text-cyberaccent">Regla del Múltiplo Constante</h3>
                  <div className="mb-2 bg-black bg-opacity-30 p-3 rounded-md">
                    <Latex formula="\frac{d}{dx}[c \cdot f(x)] = c \cdot \frac{d}{dx}[f(x)]" />
                  </div>
                  <p className="text-gray-300">Las constantes pueden sacarse fuera de la derivada.</p>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              className="bg-cyberbg rounded-lg p-6 mb-8 cyber-border"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <h2 className="text-xl font-cyber font-semibold mb-4 text-white">Reglas Avanzadas</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-cyberdark p-4 rounded-lg">
                  <h3 className="text-lg font-medium mb-2 text-cyberaccent">Regla del Producto</h3>
                  <div className="mb-2 bg-black bg-opacity-30 p-3 rounded-md">
                    <Latex formula="\frac{d}{dx}[f(x) \cdot g(x)] = f(x) \cdot \frac{d}{dx}[g(x)] + g(x) \cdot \frac{d}{dx}[f(x)]" />
                  </div>
                  <p className="text-gray-300">Primer función por derivada de la segunda más segunda función por derivada de la primera.</p>
                </div>
                
                <div className="bg-cyberdark p-4 rounded-lg">
                  <h3 className="text-lg font-medium mb-2 text-cyberaccent">Regla del Cociente</h3>
                  <div className="mb-2 bg-black bg-opacity-30 p-3 rounded-md">
                    <Latex formula="\frac{d}{dx}\left[\frac{f(x)}{g(x)}\right] = \frac{g(x) \cdot \frac{d}{dx}[f(x)] - f(x) \cdot \frac{d}{dx}[g(x)]}{[g(x)]^2}" />
                  </div>
                  <p className="text-gray-300">Denominador por derivada del numerador menos numerador por derivada del denominador, todo sobre el denominador al cuadrado.</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-cyberdark p-4 rounded-lg">
                  <h3 className="text-lg font-medium mb-2 text-cyberaccent">Regla de la Cadena</h3>
                  <div className="mb-2 bg-black bg-opacity-30 p-3 rounded-md">
                    <Latex formula="\frac{d}{dx}[f(g(x))] = f'(g(x)) \cdot g'(x)" />
                  </div>
                  <p className="text-gray-300">Derivada de la función externa evaluada en la función interna, multiplicada por la derivada de la función interna.</p>
                </div>
                
                <div className="bg-cyberdark p-4 rounded-lg">
                  <h3 className="text-lg font-medium mb-2 text-cyberaccent">Función Logarítmica</h3>
                  <div className="mb-2 bg-black bg-opacity-30 p-3 rounded-md">
                    <Latex formula="\frac{d}{dx}[\ln(x)] = \frac{1}{x}" />
                  </div>
                  <p className="text-gray-300">La derivada del logaritmo natural es 1 sobre x.</p>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              className="bg-cyberbg rounded-lg p-6 cyber-border"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <h2 className="text-xl font-cyber font-semibold mb-4 text-white">Funciones Trigonométricas</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-cyberdark p-4 rounded-lg">
                  <h3 className="text-lg font-medium mb-2 text-cyberaccent">Seno</h3>
                  <div className="mb-2 bg-black bg-opacity-30 p-3 rounded-md">
                    <Latex formula="\frac{d}{dx}[\sin(x)] = \cos(x)" />
                  </div>
                </div>
                
                <div className="bg-cyberdark p-4 rounded-lg">
                  <h3 className="text-lg font-medium mb-2 text-cyberaccent">Coseno</h3>
                  <div className="mb-2 bg-black bg-opacity-30 p-3 rounded-md">
                    <Latex formula="\frac{d}{dx}[\cos(x)] = -\sin(x)" />
                  </div>
                </div>
                
                <div className="bg-cyberdark p-4 rounded-lg">
                  <h3 className="text-lg font-medium mb-2 text-cyberaccent">Tangente</h3>
                  <div className="mb-2 bg-black bg-opacity-30 p-3 rounded-md">
                    <Latex formula="\frac{d}{dx}[\tan(x)] = \sec^2(x)" />
                  </div>
                </div>
              </div>
            </motion.div>
            
            <div className="mt-8 text-center">
              <Link href="/quiz">
                <a className="cyber-btn px-6 py-3 bg-cyberprimary hover:bg-purple-700 text-white font-medium rounded-md transition duration-300 shadow-neon-purple">
                  Practicar con Ejercicios
                </a>
              </Link>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
