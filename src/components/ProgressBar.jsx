import React from 'react'

export default function ProgressBar({ value = 0 }) {
  return (
    <div className="w-full">
      <div className="bg-gray-200 rounded h-3 overflow-hidden">
        <div className="bg-green-500 h-3" style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
      </div>
      <div className="text-xs text-gray-600 mt-1">{value}%</div>
    </div>
  )
}
