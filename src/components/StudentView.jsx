import React, { useEffect, useState } from 'react'
import { getAssignments, getSubmissions, updateSubmission, getUsers } from '../utils/data'
import AssignmentCard from './AssignmentCard'
import ConfirmModal from './ConfirmModal'

export default function StudentView({ studentId }) {
  const [assignments, setAssignments] = useState([])
  const [submissions, setSubmissions] = useState([])
  const [confirming, setConfirming] = useState(null)
  const [users] = useState(getUsers())

  useEffect(() => {
    setAssignments(getAssignments().filter(a => a.assignedTo.includes(studentId)))
    setSubmissions(getSubmissions().filter(s => s.studentId === studentId))
  }, [studentId])

  function markSubmitted(assignmentId) {
    // open confirmation modal
    setConfirming({ assignmentId })
  }

  function finalizeSubmit(assignmentId) {
    const now = Date.now()
    updateSubmission({ assignmentId, studentId, submitted: true, confirmed: true, timestamp: now })
    setSubmissions(getSubmissions().filter(s => s.studentId === studentId))
    setConfirming(null)
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-3">Your Assignments</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {assignments.map(a => {
          const sub = submissions.find(s => s.assignmentId === a.id) || { submitted: false, confirmed: false }
          return (
            <AssignmentCard
              key={a.id}
              assignment={a}
              role="student"
              submission={sub}
              onSubmit={() => markSubmitted(a.id)}
            />
          )
        })}
      </div>

      {confirming && (
        <ConfirmModal
          title="Confirm submission"
          message="Do you confirm that you have submitted your work to the provided Drive link? This action will be recorded."
          onCancel={() => setConfirming(null)}
          onConfirm={() => finalizeSubmit(confirming.assignmentId)}
        />
      )}
    </div>
  )
}
