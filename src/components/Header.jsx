import React from 'react'

export default function Header({ children }) {
    return (
        <header className="bg-white shadow-sm sticky top-0 z-30">
            <div className="container mx-auto px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="bg-emerald-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold shadow">JZ</div>
                    <div>
                        <div className="text-lg font-semibold">Joineazy</div>
                        <div className="text-xs text-gray-500">Student Assignments Dashboard</div>
                    </div>
                </div>

                <div className="hidden sm:flex items-center gap-2 text-sm text-gray-600">
                    {children}
                </div>
            </div>
        </header>
    )
}
