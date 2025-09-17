import { useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import AquaNetLogo from "../components/svg/AquaNetLogo"
import AquaNetText from "../components/svg/AquaNetText"
import { 
  Droplets, 
  BarChart3, 
  Shield, 
  Zap, 
  Target, 
  ArrowRight,
  CheckCircle,
  Waves,
  Users,
  Globe,
  Star,
  Play,
  Menu,
  X
} from 'lucide-react'
import { useState } from 'react'
import ComplexWaterBackground from '../components/WaterBackground'

const LandingPage = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const benefits = [
    {
      icon: <Target className="w-12 h-12 text-blue-600" />,
      title: "Controla tu huella hídrica",
      description: "Conoce en tiempo real cuánta agua consumes, dónde se desperdicia y cómo puedes optimizar cada litro.",
      image: "🎯",
      position: "left"
    },
    {
      icon: <BarChart3 className="w-12 h-12 text-blue-600" />,
      title: "Decisiones basadas en datos",
      description: "Accede a reportes inteligentes y dashboards intuitivos que facilitan la planeación, cumplimiento regulatorio y la sostenibilidad empresarial.",
      image: "📊",
      position: "right"
    },
    {
      icon: <Shield className="w-12 h-12 text-blue-600" />,
      title: "Tecnología que impulsa confianza",
      description: "Integramos sensores, analítica avanzada e inteligencia artificial para garantizar información precisa y soluciones adaptadas a tu operación.",
      image: "🛡️",
      position: "left"
    }
  ];

  const features = [
    { icon: <Droplets className="w-6 h-6" />, text: "Monitoreo en tiempo real" },
    { icon: <BarChart3 className="w-6 h-6" />, text: "Análisis predictivo con IA" },
    { icon: <Shield className="w-6 h-6" />, text: "Cumplimiento regulatorio" },
    { icon: <Zap className="w-6 h-6" />, text: "Optimización automática" },
  ];

  const handleGetStarted = () => {
    navigate('/dashboard');
  };

  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-gray-100 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <AquaNetLogo className="w-8 h-8" />
              <AquaNetText className="w-32 h-8" />
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-700 hover:text-blue-600 transition-colors">Características</a>
              <a href="#about" className="text-gray-700 hover:text-blue-600 transition-colors">Nosotros</a>
              <a href="#contact" className="text-gray-700 hover:text-blue-600 transition-colors">Contacto</a>
              <Button 
                onClick={handleLogin}
                variant="outline"
                size="sm"
                className="border-blue-600 text-blue-600 hover:bg-blue-50"
              >
                Iniciar Sesión
              </Button>
            </nav>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-gray-100 py-4">
              <nav className="flex flex-col space-y-4">
                <a href="#features" className="text-gray-700 hover:text-blue-600 transition-colors">Características</a>
                <a href="#about" className="text-gray-700 hover:text-blue-600 transition-colors">Nosotros</a>
                <a href="#contact" className="text-gray-700 hover:text-blue-600 transition-colors">Contacto</a>
                <Button 
                  onClick={handleLogin}
                  variant="outline"
                  size="sm"
                  className="border-blue-600 text-blue-600 hover:bg-blue-50 w-fit"
                >
                  Iniciar Sesión
                </Button>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-32  relative overflow-hidden">
        {/* Advanced Water Animation Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50/20 to-white/80">
          <ComplexWaterBackground 
            enableCanvas={true} 
            intensity="high"
          />
        </div>
        <div className="relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-left">
              <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-6">
                <Waves className="w-4 h-4 mr-2" />
                Innovación en gestión hídrica
              </div>
              
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                Mide, analiza y optimiza tu 
                <span className="text-blue-600 block">consumo de agua</span>
                <span className="text-gray-600 text-4xl lg:text-5xl">con precisión digital</span>
              </h1>
              
              <p className="text-xl text-gray-600 mb-8 max-w-lg">
                En BlueMetrics transformamos los datos en decisiones inteligentes. Nuestra plataforma te ayuda a gestionar el agua de forma eficiente, reducir costos y avanzar hacia un futuro sostenible.
              </p>

              {/* Features List */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="text-blue-600">{feature.icon}</div>
                    <span className="text-gray-700 text-sm">{feature.text}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  onClick={handleGetStarted}
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg group"
                >
                  Empieza tu prueba gratis
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button 
                  variant="outline"
                  size="lg"
                  className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-4 text-lg"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Ver demo
                </Button>
              </div>

              <p className="text-sm text-gray-500 mt-4">
                ✨ Cuéntanos de tu proyecto y te generaremos una solución a la medida
              </p>
            </div>

            {/* Hero Visual */}
            <div className="relative">
              <div className="relative bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl p-8 shadow-xl">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent rounded-2xl"></div>
                <div className="relative">
                  {/* Mock Dashboard Preview */}
                  <div className="bg-white rounded-xl shadow-lg p-6 mb-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-gray-900">Consumo en Tiempo Real</h3>
                      <div className="flex items-center text-green-600 text-sm">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                        Activo
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">2.8k</div>
                        <div className="text-xs text-gray-500">m³ Diarios</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">94%</div>
                        <div className="text-xs text-gray-500">Eficiencia</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-600">12</div>
                        <div className="text-xs text-gray-500">Pozos</div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white rounded-lg shadow-md p-4">
                      <div className="flex items-center mb-2">
                        <Target className="w-5 h-5 text-blue-600 mr-2" />
                        <span className="text-sm font-medium">Alertas</span>
                      </div>
                      <div className="text-lg font-bold">2 Activas</div>
                    </div>
                    <div className="bg-white rounded-lg shadow-md p-4">
                      <div className="flex items-center mb-2">
                        <BarChart3 className="w-5 h-5 text-green-600 mr-2" />
                        <span className="text-sm font-medium">Ahorro</span>
                      </div>
                      <div className="text-lg font-bold">$12.5k</div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                IA Activa
              </div>
              <div className="absolute -bottom-4 -left-4 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                24/7 Monitoreo
              </div>
            </div>
          </div>
        </div>
        </div>
      </section>

      {/* Benefits Section - Zigzag Layout */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {benefits.map((benefit, index) => (
            <div key={index} className={`mb-20 ${index === benefits.length - 1 ? 'mb-0' : ''}`}>
              <div className={`grid lg:grid-cols-2 gap-12 items-center ${benefit.position === 'right' ? 'lg:grid-flow-col-dense' : ''}`}>
                {/* Content */}
                <div className={`${benefit.position === 'right' ? 'lg:col-start-2' : ''}`}>
                  <div className="mb-6">
                    {benefit.icon}
                  </div>
                  <h3 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                    {benefit.title}
                  </h3>
                  <p className="text-xl text-gray-600 leading-relaxed mb-8">
                    {benefit.description}
                  </p>
                  <Button 
                    variant="outline" 
                    className="border-blue-600 text-blue-600 hover:bg-blue-50"
                  >
                    Conoce más
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>

                {/* Visual */}
                <div className={`${benefit.position === 'right' ? 'lg:col-start-1' : ''}`}>
                  <div className="relative">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 text-center">
                      <div className="text-8xl mb-4">{benefit.image}</div>
                      <div className="bg-white rounded-xl p-6 shadow-lg">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600">
                              {index === 0 ? '94%' : index === 1 ? '30%' : '99.9%'}
                            </div>
                            <div className="text-sm text-gray-500">
                              {index === 0 ? 'Precisión' : index === 1 ? 'Ahorro' : 'Uptime'}
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-green-600">
                              {index === 0 ? '24/7' : index === 1 ? '5min' : '2.8k'}
                            </div>
                            <div className="text-sm text-gray-500">
                              {index === 0 ? 'Monitoreo' : index === 1 ? 'Reportes' : 'Sensores'}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* About Us Section */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-8">Quiénes somos</h2>
          
          <div className="space-y-6 text-lg text-gray-600 leading-relaxed">
            <p>
              En BlueMetrics creemos que el agua es el recurso más valioso de nuestro planeta. 
              Por eso desarrollamos una plataforma digital que ayuda a empresas, instituciones y 
              comunidades a medir, analizar y optimizar el uso del agua de manera inteligente.
            </p>
            
            <p>
              Nuestra misión es asegurar la sostenibilidad hídrica a través de la innovación 
              tecnológica. Integramos datos en tiempo real, modelos predictivos y herramientas 
              de fácil uso que impulsan la toma de decisiones responsables y eficientes.
            </p>
            
            <p>
              Somos un equipo comprometido en generar impacto positivo: económico, social y 
              ambiental. Con BlueMetrics, transformamos la gestión hídrica en una ventaja 
              competitiva y un paso firme hacia el futuro.
            </p>
          </div>

          {/* Team Values */}
          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Equipo Experto</h3>
              <p className="text-gray-600">Profesionales especializados en tecnología hídrica</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Impacto Global</h3>
              <p className="text-gray-600">Soluciones que trascienden fronteras</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Innovación</h3>
              <p className="text-gray-600">Tecnología de vanguardia para el futuro</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 relative bg-gradient-to-r from-blue-600/90 to-blue-700/90 bg-fixed">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-fixed" 
          style={{
            backgroundImage: 'url(/foto1.png)',
            backgroundAttachment: 'fixed'
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/80 to-blue-700/80"></div>
        <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              Resultados que hablan por sí solos
            </h2>
            <p className="text-blue-100 text-lg">
              Empresas de todo el mundo confían en BlueMetrics
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8 text-center text-white">
            <div>
              <div className="text-4xl font-bold mb-2">150+</div>
              <div className="text-blue-100">Pozos Monitoreados</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">99.9%</div>
              <div className="text-blue-100">Tiempo de Actividad</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">30%</div>
              <div className="text-blue-100">Ahorro en Costos</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">24/7</div>
              <div className="text-blue-100">Monitoreo Continuo</div>
            </div>
          </div>
        </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            ¿Listo para transformar tu gestión hídrica?
          </h2>
          <p className="text-xl text-gray-600 mb-10">
            Únete a las empresas que ya confían en BlueMetrics para optimizar 
            sus recursos hídricos y construir un futuro sostenible.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={handleGetStarted}
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 text-lg"
            >
              Empieza tu prueba gratis
            </Button>
            <Button 
              variant="outline"
              size="lg"
              className="border-blue-600 text-blue-600 hover:bg-blue-50 px-10 py-4 text-lg"
            >
              Contáctanos
            </Button>
          </div>
          <p className="text-sm text-gray-500 mt-6">
            💡 Sin compromiso • Configuración en 24 horas • Soporte especializado
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="col-span-2">
              <div className="flex items-center mb-6">
                <AquaNetLogo className="w-8 h-8 mr-3" />
                <AquaNetText className="w-32 h-6" />
              </div>
              <p className="text-gray-400 max-w-md mb-6">
                Innovación y datos para un futuro con agua. Transformamos la gestión hídrica 
                a través de tecnología inteligente y soluciones sostenibles.
              </p>
              <div className="flex space-x-4">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="border-gray-600 text-gray-300 hover:bg-gray-800 flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 8a6 6 0 01-11.95 1M5 12a6 6 0 0011.95 1M8 16a6 6 0 0011.95 1M12 20a6 6 0 0011.95 1" />
                  </svg>
                  LinkedIn
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="border-gray-600 text-gray-300 hover:bg-gray-800 flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12a6 6 0 0111.95 1M5 12a6 6 0 0011.95 1M8 16a6 6 0 0011.95 1M12 20a6 6 0 0011.95 1" />
                  </svg>
                  Twitter
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="border-gray-600 text-gray-300 hover:bg-gray-800 flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12a6 6 0 0111.95 1M5 12a6 6 0 0011.95 1M8 16a6 6 0 0011.95 1M12 20a6 6 0 0011.95 1" />
                  </svg>
                  Facebook
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="border-gray-600 text-gray-300 hover:bg-gray-800 flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12a6 6 0 0111.95 1M5 12a6 6 0 0011.95 1M8 16a6 6 0 0011.95 1M12 20a6 6 0 0011.95 1" />
                  </svg>
                  Instagram
                </Button>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-6">Plataforma</h3>
              <ul className="space-y-3 text-gray-400">
                <li><button onClick={() => navigate('/dashboard')} className="hover:text-white transition-colors">Dashboard</button></li>
                <li><button onClick={() => navigate('/pozos')} className="hover:text-white transition-colors">Pozos</button></li>
                <li><button onClick={() => navigate('/consumo')} className="hover:text-white transition-colors">Consumo</button></li>
                <li><button onClick={() => navigate('/balance')} className="hover:text-white transition-colors">Balance Hídrico</button></li>
                <li><button onClick={handleLogin} className="hover:text-white transition-colors">Iniciar Sesión</button></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-6">Contacto</h3>
              <ul className="space-y-3 text-gray-400">
                <li className="hover:text-white transition-colors">Contacto@bluemetrics.mx</li>
                <li className="hover:text-white transition-colors">+52 (55) 1234-5678</li>
                <li className="hover:text-white transition-colors">Soporte 24/7</li>
                <li>
                  <Button 
                    onClick={handleGetStarted}
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700 text-white mt-2"
                  >
                    Empezar ahora
                  </Button>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm">
                © 2024 BlueMetrics. Todos los derechos reservados.
              </p>
              <p className="text-gray-500 text-sm mt-2 md:mt-0">
                Innovación y datos para un futuro con agua.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;

