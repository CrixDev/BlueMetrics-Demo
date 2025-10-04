import { useState, useEffect } from 'react';
import { DashboardSidebar } from '../components/dashboard-sidebar';
import { DashboardHeader } from '../components/dashboard-header';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Mail, Send, Inbox, Star, Trash2, Search, Edit, Eye } from 'lucide-react';
import { supabase } from '../supabaseClient';
// import { useAuth } from '../contexts/AuthContext';

import { RedirectIfNotAuth } from '../components/RedirectIfNotAuth';

const CorreosPage = () => {
  const [user, setUser] = useState({ name: 'Cargando...' });

  // Cargar datos del usuario desde Supabase
  useEffect(() => {
    const loadUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          setUser({
            name: profile?.full_name || session.user.email
          });
        }
      } catch (error) {
        console.error('❌ Error al cargar usuario:', error);
      }
    };

    loadUser();
  }, []);

  // Cargar correos al montar el componente
  useEffect(() => {
    fetchCorreos();
  }, []);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [filter, setFilter] = useState('todos'); // todos, leidos, no-leidos
  const [correos, setCorreos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCorreos = async () => {
    try {
      setIsLoading(true);
      console.log('🔍 Consultando correos desde Supabase...');
      
      const { data, error } = await supabase
        .from('correos')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Error al consultar correos:', error);
        throw error;
      }

      console.log('✅ Correos obtenidos:', data);
      
      // Formatear los datos para que coincidan con la estructura esperada
      const correosFormateados = data.map(correo => ({
        id: correo.id,
        remitente: correo.remitente,
        email: correo.email,
        telefono: correo.telefono,
        empresa: correo.empresa,
        asunto: correo.asunto,
        mensaje: correo.mensaje,
        fecha: new Date(correo.created_at).toLocaleString('es-MX', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        }),
        leido: correo.leido,
        importante: correo.importante,
        categoria: correo.categoria
      }));

      setCorreos(correosFormateados);
    } catch (error) {
      console.error('❌ Error al cargar correos:', error);
      alert('Error al cargar los correos. Por favor, recarga la página.');
    } finally {
      setIsLoading(false);
    }
  };


  // Filtrar correos
  const correosFiltrados = correos.filter(correo => {
    const matchSearch = correo.remitente.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       correo.asunto.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       correo.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filter === 'leidos') return matchSearch && correo.leido;
    if (filter === 'no-leidos') return matchSearch && !correo.leido;
    return matchSearch;
  });

  const handleSelectEmail = async (correo) => {
    setSelectedEmail(correo);
    
    // Si el correo no está leído, marcarlo como leído en Supabase
    if (!correo.leido) {
      try {
        const { error } = await supabase
          .from('correos')
          .update({ leido: true })
          .eq('id', correo.id);

        if (error) {
          console.error('❌ Error al marcar correo como leído:', error);
        } else {
          console.log('✅ Correo marcado como leído:', correo.id);
          // Actualizar el estado local
          setCorreos(prevCorreos => 
            prevCorreos.map(c => 
              c.id === correo.id ? { ...c, leido: true } : c
            )
          );
        }
      } catch (error) {
        console.error('❌ Error al actualizar correo:', error);
      }
    }
  };

  const getCategoryColor = (categoria) => {
    const colors = {
      consulta: 'bg-blue-100 text-blue-800',
      mantenimiento: 'bg-green-100 text-green-800',
      alerta: 'bg-red-100 text-red-800',
      solicitud: 'bg-purple-100 text-purple-800',
      facturacion: 'bg-yellow-100 text-yellow-800'
    };
    return colors[categoria] || 'bg-gray-100 text-gray-800';
  };

  // Mostrar loading mientras se cargan los correos
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <DashboardSidebar />
        <div className="flex-1 flex flex-col">
          <DashboardHeader />
          <main className="flex-1 p-6 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Cargando correos...</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <RedirectIfNotAuth>
      <div className="min-h-screen bg-gray-50 ">
        <DashboardSidebar />
        
        <div className="ml-64">
          <DashboardHeader />
          
          <main className="flex-1 p-6">
            {/* Header con información del admin */}
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                    <Mail className="w-8 h-8 text-blue-600" />
                    Correos
                  </h1>
                  <p className="text-gray-600 mt-1">
                    Bandeja de entrada - Usuario: <span className="font-semibold">{user?.name}</span>
                  </p>
                </div>
                <div className="flex gap-3">
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Send className="w-4 h-4 mr-2" />
                    Nuevo Correo
                  </Button>
                </div>
              </div>
            </div>

            {/* Estadísticas rápidas */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Correos</p>
                      <p className="text-2xl font-bold text-gray-900">{correos.length}</p>
                    </div>
                    <Inbox className="w-8 h-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">No Leídos</p>
                      <p className="text-2xl font-bold text-orange-600">
                        {correos.filter(c => !c.leido).length}
                      </p>
                    </div>
                    <Mail className="w-8 h-8 text-orange-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Importantes</p>
                      <p className="text-2xl font-bold text-yellow-600">
                        {correos.filter(c => c.importante).length}
                      </p>
                    </div>
                    <Star className="w-8 h-8 text-yellow-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Leídos</p>
                      <p className="text-2xl font-bold text-green-600">
                        {correos.filter(c => c.leido).length}
                      </p>
                    </div>
                    <Eye className="w-8 h-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Contenido principal */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Lista de correos */}
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Bandeja de Entrada</CardTitle>
                    
                    {/* Búsqueda */}
                    <div className="relative mt-4">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        placeholder="Buscar correos..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    {/* Filtros */}
                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={() => setFilter('todos')}
                        className={`px-3 py-1 rounded-md text-sm ${
                          filter === 'todos' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        Todos
                      </button>
                      <button
                        onClick={() => setFilter('no-leidos')}
                        className={`px-3 py-1 rounded-md text-sm ${
                          filter === 'no-leidos' ? 'bg-orange-600 text-white' : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        No leídos
                      </button>
                      <button
                        onClick={() => setFilter('leidos')}
                        className={`px-3 py-1 rounded-md text-sm ${
                          filter === 'leidos' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        Leídos
                      </button>
                    </div>
                  </CardHeader>

                  <CardContent className="p-0">
                    <div className="divide-y divide-gray-200 max-h-[600px] overflow-y-auto">
                      {correosFiltrados.map((correo) => (
                        <div
                          key={correo.id}
                          onClick={() => handleSelectEmail(correo)}
                          className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                            selectedEmail?.id === correo.id ? 'bg-blue-50 border-l-4 border-blue-600' : ''
                          } ${!correo.leido ? 'bg-blue-50/30' : ''}`}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              {correo.importante && <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />}
                              <h3 className={`text-sm ${!correo.leido ? 'font-bold' : 'font-medium'} text-gray-900`}>
                                {correo.remitente}
                              </h3>
                            </div>
                            {!correo.leido && (
                              <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                            )}
                          </div>
                          <p className="text-xs text-gray-600 mb-1">{correo.email}</p>
                          <p className={`text-sm ${!correo.leido ? 'font-semibold' : ''} text-gray-900 mb-2`}>
                            {correo.asunto}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className={`text-xs px-2 py-1 rounded ${getCategoryColor(correo.categoria)}`}>
                              {correo.categoria}
                            </span>
                            <span className="text-xs text-gray-500">{correo.fecha}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Vista del correo seleccionado */}
              <div className="lg:col-span-2">
                <Card>
                  {selectedEmail ? (
                    <>
                      <CardHeader className="border-b">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h2 className="text-xl font-bold text-gray-900">{selectedEmail.asunto}</h2>
                              {selectedEmail.importante && (
                                <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <span className="font-semibold">{selectedEmail.remitente}</span>
                              <span>&lt;{selectedEmail.email}&gt;</span>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">{selectedEmail.fecha}</p>
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => window.location.href = `mailto:${selectedEmail.email}?subject=Re: ${selectedEmail.asunto}`}
                            >
                              <Mail className="w-4 h-4 mr-2" />
                              Responder por correo
                            </Button>
                            <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="mt-3">
                          <span className={`text-xs px-2 py-1 rounded ${getCategoryColor(selectedEmail.categoria)}`}>
                            {selectedEmail.categoria}
                          </span>
                        </div>
                      </CardHeader>

                      <CardContent className="p-6">
                        <div className="prose max-w-none">
                          <p className="text-gray-700 whitespace-pre-wrap">{selectedEmail.mensaje}</p>
                        </div>

                        {/* Acciones rápidas */}
                        <div className="mt-8 pt-6 border-t border-gray-200">
                          <h3 className="text-sm font-semibold text-gray-900 mb-3">Acciones Rápidas</h3>
                          <div className="flex gap-3">
                            <Button 
                              className="bg-blue-600 hover:bg-blue-700"
                              onClick={() => window.location.href = `mailto:${selectedEmail.email}?subject=Re: ${selectedEmail.asunto}&body=En respuesta a tu mensaje:\n\n${selectedEmail.mensaje}\n\n--\n`}
                            >
                              <Mail className="w-4 h-4 mr-2" />
                              Responder por correo
                            </Button>
                            <Button variant="outline">
                              <Mail className="w-4 h-4 mr-2" />
                              Reenviar
                            </Button>
                            <Button variant="outline">
                              Marcar como {selectedEmail.leido ? 'no leído' : 'leído'}
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </>
                  ) : (
                    <CardContent className="p-12 text-center">
                      <Mail className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Selecciona un correo</h3>
                      <p className="text-gray-600">
                        Elige un correo de la lista para ver su contenido completo
                      </p>
                    </CardContent>
                  )}
                </Card>
              </div>
            </div>
          </main>
        </div>
      </div>
    </RedirectIfNotAuth>
  );
};

export default CorreosPage;

