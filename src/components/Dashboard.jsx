import React from 'react'
import StudentView from './StudentView'
import AdminView from './AdminView'

export default function Dashboard({ role, userId }) {
  if (!userId) return <div>Pick a user to start</div>
  return (
    <div>
      {role === 'student' ? (
        <StudentView studentId={userId} />
      ) : (
        <AdminView adminId={userId} />
      )}
    </div>
  )
}
