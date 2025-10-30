import React, { useEffect, useState } from 'react'
import { getAssignments, getSubmissions, getUsers, addAssignment, addUser, removeUser, removeAssignment } from '../utils/data'
import AssignmentCard from './AssignmentCard'
import ProgressBar from './ProgressBar'
import ConfirmModal from './ConfirmModal'

export default function AdminView({ adminId }) {
  const [assignments, setAssignments] = useState([])
  const [submissions, setSubmissions] = useState([])
  const [allUsers, setAllUsers] = useState([])
  const [creating, setCreating] = useState(false)
  const [managingUsers, setManagingUsers] = useState(false)
  const [newUserName, setNewUserName] = useState('')
  const [newUserRole, setNewUserRole] = useState('student')
  const [confirm, setConfirm] = useState(null)
  const [newTitle, setNewTitle] = useState('')
  const [newLink, setNewLink] = useState('')
  const [selectedStudents, setSelectedStudents] = useState([])

  useEffect(() => {
    const as = getAssignments().filter(a => a.createdBy === adminId)
    setAssignments(as)
    setSubmissions(getSubmissions())
    setAllUsers(getUsers())
  }, [adminId])

  useEffect(() => {
    function onUpdate() {
      setAssignments(getAssignments().filter(a => a.createdBy === adminId))
      setSubmissions(getSubmissions())
      setAllUsers(getUsers())
    }
    window.addEventListener('joineazy:update', onUpdate)
    return () => window.removeEventListener('joineazy:update', onUpdate)
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

  function handleAddUser() {
    if (!newUserName) return
    const id = (newUserRole === 'student' ? 's' : 'a') + Date.now()
    addUser({ id, name: newUserName, role: newUserRole })
    setAllUsers(getUsers())
    setNewUserName('')
    setNewUserRole('student')
  }

  function handleRemoveUser(userId) {
    // basic confirmation
    if (!confirm) {
      setConfirm({ type: 'user', id: userId, message: 'Remove this user? This will delete their submissions.' })
      return
    }
  }

  function handleRequestDeleteAssignment(assignmentId) {
    setConfirm({ type: 'assignment', id: assignmentId, message: 'Delete this assignment? This will remove all related submissions.' })
  }

  function handleConfirmDelete() {
    if (!confirm) return
    if (confirm.type === 'assignment') {
      removeAssignment(confirm.id)
      setAssignments(getAssignments().filter(a => a.createdBy === adminId))
      setSubmissions(getSubmissions())
    } else if (confirm.type === 'user') {
      removeUser(confirm.id)
      setAllUsers(getUsers())
      // refresh assignments/submissions in case they referenced the user
      setAssignments(getAssignments().filter(a => a.createdBy === adminId))
      setSubmissions(getSubmissions())
    }
    setConfirm(null)
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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <h2 className="text-xl font-semibold mb-0">Your Assignments</h2>
        <button className="px-3 py-2 bg-emerald-600 text-white rounded-md shadow" onClick={() => setCreating(!creating)}>
          {creating ? 'Cancel' : 'Create Assignment'}
        </button>
      </div>

      {creating && (
        <div className="card p-4 my-4">
          <input className="w-full mb-3 border rounded px-3 py-2" placeholder="Title" value={newTitle} onChange={e => setNewTitle(e.target.value)} />
          <input className="w-full mb-3 border rounded px-3 py-2" placeholder="Drive link (optional)" value={newLink} onChange={e => setNewLink(e.target.value)} />
          <div className="mb-3">
            <div className="text-sm font-medium mb-2">Assign to students</div>
            <div className="flex flex-col sm:flex-row gap-2">
              {allUsers.filter(u => u.role === 'student').map(u => (
                <label key={u.id} className={`px-3 py-2 border rounded cursor-pointer flex items-center gap-2 ${selectedStudents.includes(u.id) ? 'bg-emerald-50 border-emerald-200' : 'bg-white'}`}>
                  <input type="checkbox" checked={selectedStudents.includes(u.id)} onChange={() => toggleStudentSelection(u.id)} /> <span className="ml-1">{u.name}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-emerald-600 text-white rounded-md" onClick={createAssignment}>Create</button>
            <button className="px-4 py-2 border rounded-md" onClick={() => setCreating(false)}>Cancel</button>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mt-4 mb-2 gap-2">
        <button onClick={() => setManagingUsers(!managingUsers)} className="px-3 py-2 bg-slate-100 border rounded">{managingUsers ? 'Close user management' : 'Manage users'}</button>
      </div>

      {managingUsers && (
        <div className="card p-4 mb-4">
          <div className="flex flex-col sm:flex-row gap-2 items-center">
            <input className="border rounded px-3 py-2 flex-1" placeholder="Full name" value={newUserName} onChange={e => setNewUserName(e.target.value)} />
            <select className="border rounded px-3 py-2" value={newUserRole} onChange={e => setNewUserRole(e.target.value)}>
              <option value="student">Student</option>
              <option value="admin">Professor / Admin</option>
            </select>
            <button className="px-4 py-2 bg-emerald-600 text-white rounded-md" onClick={handleAddUser}>Add</button>
          </div>

          <div className="mt-4">
            <div className="text-sm font-medium mb-2">All users</div>
            <div className="space-y-2">
              {allUsers.map(u => (
                <div key={u.id} className="flex items-center justify-between text-sm">
                  <div>{u.name} <span className="text-xs text-gray-500">({u.role})</span></div>
                  <div>
                    <button className="text-sm text-red-600 px-2 py-1 rounded hover:bg-red-50" onClick={() => setConfirm({ type: 'user', id: u.id, message: `Remove ${u.name}? This will delete their submissions.` })}>Remove</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        {assignments.map(a => (
          <div key={a.id} className="card p-3">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <div className="font-medium text-gray-800">{a.title}</div>
                <div className="text-sm text-gray-500">Drive: <a className="text-emerald-600 underline" href={a.driveLink} target="_blank" rel="noreferrer">open</a></div>
              </div>
              <div className="w-full sm:w-48 flex items-center gap-2">
                <div className="flex-1"><ProgressBar value={computeProgressForAssignment(a.id)} /></div>
                <button title="Delete assignment" onClick={() => setConfirm({ type: 'assignment', id: a.id, message: 'Delete this assignment? This will remove all related submissions.' })} className="text-sm text-red-600 px-2 py-1 rounded hover:bg-red-50">Delete</button>
              </div>
            </div>

            <div className="mt-3">
              <div className="text-sm font-medium mb-2">Students</div>
                <div className="space-y-2">
                  {getSubmissions().filter(s => s.assignmentId === a.id).map(s => (
                    <div key={s.studentId} className="flex items-center justify-between text-sm">
                      <div>
                        {allUsers.find(u => u.id === s.studentId)?.name ?? s.studentId}
                        {s.submissionLink && (
                          <div className="text-xs text-gray-500">Link: <a className="text-emerald-600 underline" href={s.submissionLink} target="_blank" rel="noreferrer">open</a></div>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`px-2 py-0.5 rounded text-xs ${s.confirmed ? 'bg-emerald-50 text-emerald-800' : s.submitted ? 'bg-yellow-50 text-yellow-800' : 'bg-gray-100 text-gray-700'}`}>
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
      {confirm && (
        <ConfirmModal
          title={confirm.type === 'user' ? 'Remove user' : 'Delete assignment'}
          message={confirm.message}
          onCancel={() => setConfirm(null)}
          onConfirm={handleConfirmDelete}
        />
      )}
    </div>
  )
}

