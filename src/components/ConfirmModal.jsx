import React, { useEffect } from 'react'

export default function ConfirmModal({ title, message, onCancel, onConfirm }) {
  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') onCancel()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onCancel])

  return (
    <div className="fixed inset-0 bg-black/40 flex items-end sm:items-center justify-center z-40" role="dialog" aria-modal="true">
      <div className="bg-white rounded-t-lg sm:rounded-lg w-full sm:w-11/12 max-w-md p-4">
        <h3 className="font-semibold text-lg">{title}</h3>
        <p className="text-sm text-gray-700 mt-2">{message}</p>
        <div className="mt-4 flex flex-col sm:flex-row-reverse gap-2">
          <button className="px-4 py-2 bg-emerald-600 text-white rounded-md" onClick={onConfirm}>Yes, confirm</button>
          <button className="px-4 py-2 border rounded-md" onClick={onCancel}>Cancel</button>
        </div>
      </div>
    </div>
  )
}
