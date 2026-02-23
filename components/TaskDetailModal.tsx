'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Task, Profile } from '@/types/database'
import { X, Send, MessageSquare, Clock, Calendar, User } from 'lucide-react'
import { format } from 'date-fns'

interface TaskDetailModalProps {
  task: Task
  isOpen: boolean
  onClose: () => void
  currentUserId: string
}

export function TaskDetailModal({ task, isOpen, onClose, currentUserId }: TaskDetailModalProps) {
  const [comments, setComments] = useState<any[]>([])
  const [newComment, setNewComment] = useState('')
  const [loadingComments, setLoadingComments] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    if (isOpen) {
      fetchComments()
    }
  }, [isOpen, task.id])

  async function fetchComments() {
    setLoadingComments(true)
    const { data } = await supabase
      .from('task_comments')
      .select('*, user:profiles(full_name)')
      .eq('task_id', task.id)
      .order('created_at', { ascending: true })
    
    setComments(data || [])
    setLoadingComments(false)
  }

  async function handleAddComment(e: React.FormEvent) {
    e.preventDefault()
    if (!newComment.trim()) return

    const { error } = await supabase.from('task_comments').insert({
      task_id: task.id,
      user_id: currentUserId,
      content: newComment
    })

    if (!error) {
      setNewComment('')
      fetchComments()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="flex h-full max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b p-4">
          <h3 className="text-xl font-bold text-gray-900">Task Details</h3>
          <button onClick={onClose} className="rounded-full p-1 hover:bg-gray-100">
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="mb-6">
            <div className="flex items-center space-x-2 mb-2">
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium bg-indigo-100 text-indigo-700`}>
                {task.status}
              </span>
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium bg-orange-100 text-orange-700`}>
                {task.priority}
              </span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">{task.title}</h2>
            <p className="mt-2 text-gray-600 whitespace-pre-wrap">{task.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8 border-t border-b py-4">
            <div className="flex items-center text-sm text-gray-500">
              <Calendar className="mr-2 h-4 w-4" />
              <span className="font-medium mr-1">Due Date:</span>
              {task.due_date ? format(new Date(task.due_date), 'PPP') : 'No deadline'}
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <User className="mr-2 h-4 w-4" />
              <span className="font-medium mr-1">Assignee:</span>
              {task.assignee?.full_name || 'Unassigned'}
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <Clock className="mr-2 h-4 w-4" />
              <span className="font-medium mr-1">Created:</span>
              {format(new Date(task.created_at), 'PPP')}
            </div>
          </div>

          <div>
            <div className="mb-4 flex items-center">
              <MessageSquare className="mr-2 h-5 w-5 text-gray-400" />
              <h4 className="text-lg font-semibold text-gray-800">Comments</h4>
            </div>

            <div className="space-y-4 mb-6">
              {loadingComments ? (
                <p className="text-sm text-gray-500">Loading comments...</p>
              ) : comments.length > 0 ? (
                comments.map((comment) => (
                  <div key={comment.id} className="rounded-lg bg-gray-50 p-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-gray-900">{comment.user?.full_name}</span>
                      <span className="text-[10px] text-gray-500">{format(new Date(comment.created_at), 'MMM d, HH:mm')}</span>
                    </div>
                    <p className="text-sm text-gray-700">{comment.content}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 text-center py-4 italic">No comments yet. Start the conversation!</p>
              )}
            </div>

            <form onSubmit={handleAddComment} className="flex space-x-2">
              <input
                type="text"
                placeholder="Write a comment..."
                className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <button
                type="submit"
                className="rounded-lg bg-indigo-600 p-2 text-white hover:bg-indigo-700"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
