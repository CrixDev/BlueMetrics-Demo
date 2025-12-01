import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'
import { Card, CardHeader, CardContent } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog'
import {
  MessageSquareIcon,
  PlusIcon,
  Trash2Icon,
  EditIcon,
  Loader2Icon,
  AlertTriangleIcon,
  SendIcon,
  XIcon
} from 'lucide-react'

export default function WellComments({ wellId }) {
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({
    comment_text: '',
    author_name: 'Usuario'
  })

  // Cargar comentarios al montar el componente
  useEffect(() => {
    fetchComments()
  }, [wellId])

  // Función para cargar comentarios desde Supabase
  const fetchComments = async () => {
    try {
      setLoading(true)
      setError(null)

      const { data, error: fetchError } = await supabase
        .from('well_comments')
        .select('*')
        .eq('well_id', wellId)
        .order('created_at', { ascending: false })

      if (fetchError) throw fetchError

      setComments(data || [])
    } catch (err) {
      console.error('Error cargando comentarios:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Función para agregar un nuevo comentario
  const handleAddComment = async () => {
    if (!formData.comment_text.trim()) {
      alert('Por favor escribe un comentario')
      return
    }

    try {
      setLoading(true)
      const { data, error: insertError } = await supabase
        .from('well_comments')
        .insert([
          {
            well_id: wellId,
            comment_text: formData.comment_text,
            author_name: formData.author_name || 'Usuario'
          }
        ])
        .select()

      if (insertError) throw insertError

      // Actualizar lista de comentarios
      await fetchComments()

      // Resetear formulario
      setFormData({ comment_text: '', author_name: 'Usuario' })
      setIsModalOpen(false)
    } catch (err) {
      console.error('Error agregando comentario:', err)
      alert('Error al agregar comentario: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  // Función para actualizar un comentario
  const handleUpdateComment = async (id) => {
    if (!formData.comment_text.trim()) {
      alert('Por favor escribe un comentario')
      return
    }

    try {
      setLoading(true)
      const { error: updateError } = await supabase
        .from('well_comments')
        .update({
          comment_text: formData.comment_text,
          author_name: formData.author_name || 'Usuario'
        })
        .eq('id', id)

      if (updateError) throw updateError

      // Actualizar lista de comentarios
      await fetchComments()

      // Resetear formulario
      setFormData({ comment_text: '', author_name: 'Usuario' })
      setEditingId(null)
      setIsModalOpen(false)
    } catch (err) {
      console.error('Error actualizando comentario:', err)
      alert('Error al actualizar comentario: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  // Función para eliminar un comentario
  const handleDeleteComment = async (id) => {
    if (!confirm('¿Estás seguro de eliminar este comentario?')) return

    try {
      setLoading(true)
      const { error: deleteError } = await supabase
        .from('well_comments')
        .delete()
        .eq('id', id)

      if (deleteError) throw deleteError

      // Actualizar lista de comentarios
      await fetchComments()
    } catch (err) {
      console.error('Error eliminando comentario:', err)
      alert('Error al eliminar comentario: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  // Función para iniciar edición
  const startEdit = (comment) => {
    setEditingId(comment.id)
    setFormData({
      comment_text: comment.comment_text,
      author_name: comment.author_name
    })
    setIsModalOpen(true)
  }

  // Función para cancelar edición/adición
  const cancelEdit = () => {
    setEditingId(null)
    setIsModalOpen(false)
    setFormData({ comment_text: '', author_name: 'Usuario' })
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <MessageSquareIcon className="h-5 w-5 text-blue-600" />
              Comentarios del Pozo
            </h2>
            <Button
              size="sm"
              onClick={() => {
                setEditingId(null)
                setFormData({ comment_text: '', author_name: 'Usuario' })
                setIsModalOpen(true)
              }}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <PlusIcon className="h-4 w-4 mr-1" />
              Crear Comentario
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          {/* Lista de comentarios */}
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2Icon className="h-8 w-8 animate-spin text-gray-400" />
            <span className="ml-2 text-sm text-gray-500">Cargando comentarios...</span>
          </div>
        ) : error ? (
          <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg">
            <AlertTriangleIcon className="h-5 w-5 text-red-500" />
            <span className="text-sm text-red-600">Error: {error}</span>
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-8">
            <MessageSquareIcon className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-500">No hay comentarios aún</p>
            <p className="text-xs text-gray-400 mt-1">Sé el primero en comentar</p>
          </div>
        ) : (
          <div className="space-y-3">
            {comments.map((comment) => (
              <div
                key={comment.id}
                className="p-4 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {comment.author_name}
                    </Badge>
                    <span className="text-xs text-gray-500">
                      {new Date(comment.created_at).toLocaleDateString('es-MX', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => startEdit(comment)}
                      className="h-7 w-7 p-0"
                      title="Editar"
                    >
                      <EditIcon className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDeleteComment(comment.id)}
                      className="h-7 w-7 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                      title="Eliminar"
                    >
                      <Trash2Icon className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-gray-700 whitespace-pre-wrap">
                  {comment.comment_text}
                </p>
                {comment.updated_at !== comment.created_at && (
                  <p className="text-xs text-gray-400 mt-2 italic">
                    Editado el {new Date(comment.updated_at).toLocaleDateString('es-MX', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
        </CardContent>
      </Card>

      {/* Modal para agregar/editar comentario */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingId ? 'Editar Comentario' : 'Nuevo Comentario'}
            </DialogTitle>
          </DialogHeader>
          <div className="p-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Autor
                </label>
                <input
                  type="text"
                  value={formData.author_name}
                  onChange={(e) => setFormData({ ...formData, author_name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nombre del autor"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Comentario
                </label>
                <textarea
                  value={formData.comment_text}
                  onChange={(e) => setFormData({ ...formData, comment_text: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="4"
                  placeholder="Escribe tu comentario aquí..."
                />
              </div>
              <div className="flex gap-2 justify-end">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={cancelEdit}
                  disabled={loading}
                >
                  <XIcon className="h-4 w-4 mr-1" />
                  Cancelar
                </Button>
                <Button
                  size="sm"
                  onClick={() => editingId ? handleUpdateComment(editingId) : handleAddComment()}
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {loading ? (
                    <Loader2Icon className="h-4 w-4 animate-spin mr-1" />
                  ) : (
                    <SendIcon className="h-4 w-4 mr-1" />
                  )}
                  {editingId ? 'Actualizar' : 'Publicar'}
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
