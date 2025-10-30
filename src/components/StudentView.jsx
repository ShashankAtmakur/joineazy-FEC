import React, { useEffect, useState } from 'react'
import { getAssignments, getSubmissions, updateSubmission, getUsers } from '../utils/data'
import AssignmentCard from './AssignmentCard'
import SubmitModal from './SubmitModal'

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
    // open submission modal
    // populate with existing link if any
    const existing = getSubmissions().find(s => s.assignmentId === assignmentId && s.studentId === studentId)
    setConfirming({ assignmentId, existingLink: existing?.submissionLink ?? '' })
  }

  function finalizeSubmit(assignmentId, submissionLink) {
    const now = Date.now()
    updateSubmission({ assignmentId, studentId, submitted: true, confirmed: true, timestamp: now, submissionLink })
    setSubmissions(getSubmissions().filter(s => s.studentId === studentId))
    setConfirming(null)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xl font-semibold">Your Assignments</h2>
        <div className="text-sm text-gray-500">Progress shown for each assignment</div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
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
        <SubmitModal
          title="Submit assignment"
          message="Paste your Drive link below. After submission your professor will see the link and status."
          defaultLink={confirming.existingLink}
          onCancel={() => setConfirming(null)}
          onConfirm={(link) => finalizeSubmit(confirming.assignmentId, link)}
        />
      )}
    </div>
  )
}
