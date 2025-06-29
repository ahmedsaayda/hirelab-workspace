// hirelab-frontend\src\pages\Dashboard\Vacancies\components\Logo\logo.jsx
import React from 'react'

function HireLabLogo() {
  return (
    <div>
        <div className=" px-4 py-[2px] flex items-center gap-2">
            <div className="flex items-center relative">
                <span className="font-bold text-gray-800 text-[8px]">HireLab</span>
                <div className="absolute -top-1 -right-6 flex flex-col gap-0.5">
                    <div className="flex gap-0.5">
                    <div className="w-2 h-2 rounded-full bg-red-500 opacity-90"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-red-400 opacity-80"></div>
                    </div>
                    <div className="flex gap-0.5 ml-1">
                    <div className="w-1 h-1 rounded-full bg-red-300 opacity-70"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-red-400 opacity-75"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export  {HireLabLogo}