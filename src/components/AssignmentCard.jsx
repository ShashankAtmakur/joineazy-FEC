import React from 'react'
import ProgressBar from './ProgressBar'

export default function AssignmentCard({ assignment, role, submission = {}, onSubmit }) {
  return (
    <div className="bg-white border rounded p-4">
      <div className="flex justify-between items-start gap-4">
        <div>
          <div className="font-semibold">{assignment.title}</div>
          {assignment.dueDate && <div className="text-sm text-gray-500">Due: {assignment.dueDate}</div>}
          {assignment.driveLink && (
            <div className="text-sm mt-2">Drive: <a className="text-blue-600" href={assignment.driveLink} target="_blank" rel="noreferrer">open</a></div>
          )}
        </div>
        <div className="w-40">
          <ProgressBar value={submission.confirmed ? 100 : submission.submitted ? 60 : 0} />
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <div className="text-sm text-gray-600">Status: <span className="font-medium">{submission.confirmed ? 'Confirmed' : submission.submitted ? 'Submitted (unconfirmed)' : 'Not submitted'}</span></div>
        {role === 'student' && (
          <div>
            <button
              className="px-3 py-1 bg-blue-600 text-white rounded"
              onClick={onSubmit}
              disabled={submission.confirmed}
            >
              {submission.confirmed ? 'Done' : 'Mark Submitted'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
