import React, { useEffect, useState } from 'react'
import Dashboard from './components/Dashboard'
import { loadState, saveState, seedDataIfNeeded, getUsers } from './utils/data'
import Header from './components/Header'

export default function App() {
  const [role, setRole] = useState('student')
  const [users, setUsers] = useState([])
  const [currentUserId, setCurrentUserId] = useState(null)

  useEffect(() => {
    seedDataIfNeeded()
    const state = loadState()
    setUsers(state.users)
    // pick a default user for each role
    const defaultStudent = state.users.find(u => u.role === 'student')
    const defaultAdmin = state.users.find(u => u.role === 'admin')
    setCurrentUserId(role === 'student' ? defaultStudent?.id : defaultAdmin?.id)
  }, [])

  useEffect(() => {
    // listen to external updates from data utils so UI refreshes when data.js mutates localStorage
    function onUpdate() {
      const state = loadState()
      setUsers(state.users)
      // if current user was removed, pick a default for role
      const exists = state.users.find(u => u.id === currentUserId)
      if (!exists) {
        const defaultUser = state.users.find(u => u.role === role)
        if (defaultUser) setCurrentUserId(defaultUser.id)
      }
    }
    window.addEventListener('joineazy:update', onUpdate)
    return () => window.removeEventListener('joineazy:update', onUpdate)
  }, [currentUserId, role])

  useEffect(() => {
    // if role changes, switch currentUser to a default for that role
    const state = loadState()
    const defaultUser = state.users.find(u => u.role === role)
    if (defaultUser) setCurrentUserId(defaultUser.id)
  }, [role])

  useEffect(() => {
    // persist minimal UI state for convenience
    saveState({ ui: { lastRole: role, lastUser: currentUserId } })
  }, [role, currentUserId])

  if (!users || users.length === 0) return null

  return (
    <div className="min-h-screen bg-gray-50">
      <Header>
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">Role</label>
          <select
            value={role}
            onChange={e => setRole(e.target.value)}
            className="border rounded px-2 py-1"
          >
            <option value="student">Student</option>
            <option value="admin">Admin</option>
          </select>

          <label className="text-sm text-gray-600">User</label>
          <select
            value={currentUserId ?? ''}
            onChange={e => setCurrentUserId(e.target.value)}
            className="border rounded px-2 py-1"
          >
            {getUsers()
              .filter(u => u.role === role)
              .map(u => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
          </select>
        </div>
      </Header>

      <main className="container mx-auto px-4 py-6">
        <Dashboard role={role} userId={currentUserId} />
      </main>
    </div>
  )
}
