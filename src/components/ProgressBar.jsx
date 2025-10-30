import React from 'react'

export default function ProgressBar({ value = 0 }) {
  const v = Math.max(0, Math.min(100, value))
  return (
    <div className="w-full" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={v}>
      <div className="bg-gray-200 rounded h-3 overflow-hidden">
        <div className="bg-emerald-600 h-3 transition-all" style={{ width: `${v}%` }} />
      </div>
      <div className="text-xs text-gray-600 mt-1 text-right">{v}%</div>
    </div>
  )
}
