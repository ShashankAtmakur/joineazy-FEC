import React, { useEffect, useState } from 'react'

export default function SubmitModal({ title = 'Submit assignment', message, defaultLink = '', onCancel, onConfirm }) {
  const [link, setLink] = useState(defaultLink)
  const [error, setError] = useState('')

  useEffect(() => setLink(defaultLink), [defaultLink])

  function validate() {
    if (!link || link.trim() === '') {
      setError('Please provide a link to your submission.')
      return false
    }
    // basic URL check
    try {
      const url = new URL(link)
      if (!['http:', 'https:'].includes(url.protocol)) {
        setError('Link must be a valid http(s) URL')
        return false
      }
    } catch (e) {
      setError('Link must be a valid URL')
      return false
    }
    setError('')
    return true
  }

  function submit() {
    if (!validate()) return
    onConfirm(link.trim())
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-end sm:items-center justify-center z-40" role="dialog" aria-modal="true">
      <div className="bg-white rounded-t-lg sm:rounded-lg w-full sm:w-11/12 max-w-md p-4">
        <h3 className="font-semibold text-lg">{title}</h3>
        {message && <p className="text-sm text-gray-700 mt-2">{message}</p>}

        <label className="block text-sm text-gray-700 mt-3">Drive submission link</label>
        <input
          className="w-full mt-1 border rounded px-3 py-2"
          placeholder="https://drive.google.com/..."
          value={link}
          onChange={e => setLink(e.target.value)}
        />
        {error && <div className="text-sm text-red-600 mt-2">{error}</div>}

        <div className="mt-4 flex flex-col sm:flex-row-reverse gap-2">
          <button className="px-4 py-2 bg-emerald-600 text-white rounded-md" onClick={submit}>Submit</button>
          <button className="px-4 py-2 border rounded-md" onClick={onCancel}>Cancel</button>
        </div>
      </div>
    </div>
  )
}
