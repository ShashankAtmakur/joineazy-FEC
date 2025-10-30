import React from 'react'
import ProgressBar from './ProgressBar'

export default function AssignmentCard({ assignment, role, submission = {}, onSubmit }) {
  return (
    <article className="card p-4">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-800">{assignment.title}</h3>
          <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
            {assignment.dueDate && <div>Due: <span className="font-medium text-gray-700">{assignment.dueDate}</span></div>}
            {assignment.driveLink && (
              <a className="text-brand-DEFAULT underline" href={assignment.driveLink} target="_blank" rel="noreferrer">Open Drive</a>
            )}
          </div>
        </div>

        <div className="w-full sm:w-44">
          <ProgressBar value={submission.confirmed ? 100 : submission.submitted ? 66 : 0} />
        </div>
      </div>

      <div className="mt-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="text-sm text-gray-600">Status: <span className="font-medium text-gray-800">{submission.confirmed ? 'Confirmed' : submission.submitted ? 'Submitted (unconfirmed)' : 'Not submitted'}</span>
          {submission.submissionLink && (
            <div className="text-xs mt-1 text-gray-500">Your submission: <a className="text-emerald-600 underline" href={submission.submissionLink} target="_blank" rel="noreferrer">open link</a></div>
          )}
        </div>

        {role === 'student' && (
          <div className="flex-shrink-0">
            <button
              className={`px-4 py-2 rounded-md font-medium ${submission.confirmed ? 'bg-gray-200 text-gray-700 cursor-default' : 'bg-emerald-600 text-white hover:bg-emerald-700'}`}
              onClick={onSubmit}
              disabled={submission.confirmed}
            >
              {submission.confirmed ? 'Done' : 'Mark Submitted'}
            </button>
          </div>
        )}
      </div>
    </article>
  )
}
