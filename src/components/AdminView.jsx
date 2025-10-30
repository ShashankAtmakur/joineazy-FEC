import React, { useEffect, useState } from 'react'
import { getAssignments, getSubmissions, getUsers, addAssignment } from '../utils/data'
import AssignmentCard from './AssignmentCard'
import ProgressBar from './ProgressBar'

export default function AdminView({ adminId }) {
  const [assignments, setAssignments] = useState([])
  const [submissions, setSubmissions] = useState([])
  const [users, setUsers] = useState([])
  const [creating, setCreating] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newLink, setNewLink] = useState('')
  const [selectedStudents, setSelectedStudents] = useState([])

  useEffect(() => {
    const as = getAssignments().filter(a => a.createdBy === adminId)
    setAssignments(as)
    setSubmissions(getSubmissions())
    setUsers(getUsers().filter(u => u.role === 'student'))
  }, [adminId])

  function computeProgressForAssignment(assignmentId) {
    const assignedSubs = submissions.filter(s => s.assignmentId === assignmentId)
    if (assignedSubs.length === 0) return 0
    const done = assignedSubs.filter(s => s.confirmed).length
    return Math.round((done / assignedSubs.length) * 100)
  }

  function toggleStudentSelection(id) {
    setSelectedStudents(prev => (prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]))
  }

  function createAssignment() {
    if (!newTitle || selectedStudents.length === 0) return
    const id = 'as' + Date.now()
    addAssignment({ id, title: newTitle, dueDate: null, driveLink: newLink, createdBy: adminId, assignedTo: selectedStudents })
    // refresh
    setAssignments(getAssignments().filter(a => a.createdBy === adminId))
    setSubmissions(getSubmissions())
    setCreating(false)
    setNewTitle('')
    setNewLink('')
    setSelectedStudents([])
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold mb-3">Your Assignments</h2>
        <button className="px-3 py-1 bg-blue-600 text-white rounded" onClick={() => setCreating(!creating)}>
          {creating ? 'Cancel' : 'Create Assignment'}
        </button>
      </div>

      {creating && (
        <div className="border rounded p-4 mb-4 bg-white">
          <input className="w-full mb-2 border rounded px-2 py-1" placeholder="Title" value={newTitle} onChange={e => setNewTitle(e.target.value)} />
          <input className="w-full mb-2 border rounded px-2 py-1" placeholder="Drive link (optional)" value={newLink} onChange={e => setNewLink(e.target.value)} />
          <div className="mb-2">
            <div className="text-sm font-medium mb-1">Assign to students</div>
            <div className="flex flex-wrap gap-2">
              {users.map(u => (
                <label key={u.id} className={`px-2 py-1 border rounded cursor-pointer ${selectedStudents.includes(u.id) ? 'bg-blue-100 border-blue-300' : 'bg-white'}`}>
                  <input type="checkbox" checked={selectedStudents.includes(u.id)} onChange={() => toggleStudentSelection(u.id)} /> <span className="ml-1">{u.name}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="flex gap-2">
            <button className="px-3 py-1 bg-green-600 text-white rounded" onClick={createAssignment}>Create</button>
            <button className="px-3 py-1 border rounded" onClick={() => setCreating(false)}>Cancel</button>
          </div>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {assignments.map(a => (
          <div key={a.id} className="bg-white border rounded p-3">
            <div className="flex justify-between items-center">
              <div>
                <div className="font-medium">{a.title}</div>
                <div className="text-sm text-gray-500">Drive: <a className="text-blue-600" href={a.driveLink} target="_blank" rel="noreferrer">open</a></div>
              </div>
              <div className="w-48">
                <ProgressBar value={computeProgressForAssignment(a.id)} />
              </div>
            </div>

            <div className="mt-3">
              <div className="text-sm font-medium mb-1">Students</div>
              <div className="space-y-2">
                {getSubmissions().filter(s => s.assignmentId === a.id).map(s => (
                  <div key={s.studentId} className="flex items-center justify-between text-sm">
                    <div>{users.find(u => u.id === s.studentId)?.name ?? s.studentId}</div>
                    <div className="flex items-center gap-2">
                      <div className={`px-2 py-0.5 rounded text-xs ${s.confirmed ? 'bg-green-100 text-green-800' : s.submitted ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-700'}`}>
                        {s.confirmed ? 'Submitted' : s.submitted ? 'Awaiting confirmation' : 'Not submitted'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        ))}
      </div>
    </div>
  )
}
