import React from 'react'

export default function ConfirmModal({ title, message, onCancel, onConfirm }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-40">
      <div className="bg-white rounded shadow-lg w-11/12 max-w-md p-4">
        <h3 className="font-semibold text-lg">{title}</h3>
        <p className="text-sm text-gray-700 mt-2">{message}</p>
        <div className="mt-4 flex justify-end gap-2">
          <button className="px-3 py-1 border rounded" onClick={onCancel}>Cancel</button>
          <button className="px-3 py-1 bg-red-600 text-white rounded" onClick={onConfirm}>Yes, confirm</button>
        </div>
      </div>
    </div>
  )
}
