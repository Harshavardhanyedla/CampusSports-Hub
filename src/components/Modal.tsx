import { useEffect, useState } from 'react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm?: () => void;
    title: string;
    message: string;
    type?: 'alert' | 'confirm';
    confirmText?: string;
    cancelText?: string;
}

const CustomModal = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    type = 'alert',
    confirmText = 'Confirm',
    cancelText = 'Cancel'
}: ModalProps) => {
    const [isRendered, setIsRendered] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsRendered(true);
            document.body.style.overflow = 'hidden';
        } else {
            const timer = setTimeout(() => {
                setIsRendered(false);
                document.body.style.overflow = 'unset';
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    if (!isRendered) return null;

    return (
        <div className={`fixed inset-0 z-[100] flex items-center justify-center p-4 transition-all duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div
                className={`relative w-full max-w-md glass-panel rounded-3xl border border-white/10 p-8 shadow-2xl transition-all duration-300 transform ${isOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'
                    }`}
            >
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl -translate-x-12 -translate-y-12" />

                <div className="relative z-10 text-center">
                    <h3 className="text-2xl font-bold text-white mb-3">{title}</h3>
                    <p className="text-gray-400 mb-8 leading-relaxed">
                        {message}
                    </p>

                    <div className="flex gap-4">
                        {type === 'confirm' && (
                            <button
                                onClick={onClose}
                                className="flex-1 py-3 px-6 rounded-xl bg-white/5 hover:bg-white/10 text-white font-semibold transition-all border border-white/5"
                            >
                                {cancelText}
                            </button>
                        )}
                        <button
                            onClick={() => {
                                if (onConfirm) onConfirm();
                                onClose();
                            }}
                            className={`flex-1 py-3 px-6 rounded-xl font-bold transition-all shadow-lg ${type === 'confirm' && title.toLowerCase().includes('delete')
                                    ? 'bg-red-500 hover:bg-red-600 shadow-red-500/20'
                                    : 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-500/20'
                                } text-white`}
                        >
                            {confirmText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomModal;
