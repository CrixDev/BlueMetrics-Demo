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
import Brave_form from '../components/Brave_form'

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

      {/* Contact Section with Form */}
      <section id="contact" className="py-20 bg-gradient-to-br from-blue-50 via-blue-100/50 to-white relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-72 h-72 bg-blue-200/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute top-10 right-10 w-72 h-72 bg-blue-300/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-blue-400/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            {/* Icon header */}
            <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-600 rounded-full mb-6 shadow-lg">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            
            <h2 className="text-4xl lg:text-5xl font-bold text-blue-900 mb-6">
              <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                Contáctanos
              </span>
            </h2>
            <p className="text-xl text-blue-700 max-w-3xl mx-auto leading-relaxed">
              ¿Tienes preguntas? Nos encantaría ayudarte a encontrar la solución perfecta para tu empresa.
              <span className="block mt-2 text-lg text-blue-600">
                Transforma tu gestión hídrica con tecnología inteligente.
              </span>
            </p>
          </div>
          
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              {/* Decorative gradient border */}
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 rounded-2xl blur opacity-75"></div>
              <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden">
                <Brave_form />
              </div>
            </div>
            
            {/* Features below form */}
            <div className="mt-12 grid md:grid-cols-3 gap-6 text-center">
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-blue-100">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-600 rounded-full mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-blue-900 mb-2">Respuesta Rápida</h3>
                <p className="text-blue-700">Te contactamos en menos de 24 horas</p>
              </div>
              
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-blue-100">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-600 rounded-full mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-blue-900 mb-2">Sin Compromiso</h3>
                <p className="text-blue-700">Demo gratuita sin obligaciones</p>
              </div>
              
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-blue-100">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-600 rounded-full mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-blue-900 mb-2">Soporte Especializado</h3>
                <p className="text-blue-700">Equipo experto en gestión hídrica</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
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
                    variant="social"
                    size="sm"
                    href="https://www.linkedin.com/company/bluemetrics-gestion-h%C3%ADdrica/posts/?feedView=all"
                    target="_blank"
                    title="Síguenos en LinkedIn"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </Button>
                  
                  <Button 
                    variant="social"
                    size="sm"
                    href="https://www.facebook.com/people/BlueMetrics/61581174772648/"
                    target="_blank"
                    title="Síguenos en Facebook"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </Button>
                  
                  <Button 
                    variant="social"
                    size="sm"
                    href="https://www.instagram.com/blue_metrics_ai/?igsh=MWg1YzVtY2Y2OGkyOQ%3D%3D#"
                    target="_blank"
                    title="Síguenos en Instagram"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.042-3.441.219-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.888-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24c6.624 0 11.99-5.367 11.99-12.013C24.007 5.367 18.641.001 12.017.001z"/>
                    </svg>
                  </Button>
                </div>
            </div>
            
            <div>
              <h3 className="font-semibold  mb-6">Plataforma</h3>
              <ul className="space-y-3 text-gray-400">
                <li><button onClick={() => navigate('/dashboard')} className="hover:text-white transition-colors">Dashboard</button></li>
                <li><button onClick={() => navigate('/pozos')} className="hover:text-white transition-colors">Pozos</button></li>
                <li><button onClick={() => navigate('/consumo')} className="hover:text-white transition-colors">Consumo</button></li>
                <li><button onClick={() => navigate('/balance')} className="hover:text-white transition-colors">Balance Hídrico</button></li>
                <li><button onClick={handleLogin} className="hover:text-white transition-colors">Iniciar Sesión</button></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-6">Información</h3>
              <ul className="space-y-3 text-gray-400">
                <li className="hover:text-white transition-colors">contacto@bluemetrics.mx</li>
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