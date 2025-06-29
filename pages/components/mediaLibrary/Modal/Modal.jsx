
import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';



const Modal = ({ isOpen, onClose, title, children }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto border border-gray-950 shadow-lg ">
      {/* Backdrop: change the opacity by adjusting 'bg-opacity-XX' (0-100). e.g., bg-opacity-50 is 50% black. */}
      <div
        className="fixed inset-0 bg-black-900 bg-opacity-70"
        onClick={onClose}
      />

      {/* Modal container */}
      <div
        ref={modalRef}
        className="relative bg-white rounded-2xl shadow-xl w-[90%] m-8 mx-auto h-[90%] overflow-hidden"
      >
        {/* Header: sticky so it stays in view */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white">
          {title && (
            <h2 id="modal-title" className="text-xl font-medium text-gray-800">
              {title}
            </h2>
          )}
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="text-gray-500 hover:text-gray-700 transition-colors p-1 rounded-full"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Body: height is total modal height minus header (~64px). */}
        <div className="p-6 overflow-y-auto h-[100vh] ">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
