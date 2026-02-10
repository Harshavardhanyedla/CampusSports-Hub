import React, { createContext, useContext, useState, useCallback } from 'react';
import CustomModal from '../components/Modal';

interface ModalContextType {
    showAlert: (title: string, message: string) => void;
    showConfirm: (title: string, message: string, onConfirm: () => void) => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const useModal = () => {
    const context = useContext(ModalContext);
    if (!context) {
        throw new Error('useModal must be used within a ModalProvider');
    }
    return context;
};

export const ModalProvider = ({ children }: { children: React.ReactNode }) => {
    const [modalConfig, setModalConfig] = useState<{
        isOpen: boolean;
        title: string;
        message: string;
        type: 'alert' | 'confirm';
        onConfirm?: () => void;
    }>({
        isOpen: false,
        title: '',
        message: '',
        type: 'alert'
    });

    const showAlert = useCallback((title: string, message: string) => {
        setModalConfig({
            isOpen: true,
            title,
            message,
            type: 'alert'
        });
    }, []);

    const showConfirm = useCallback((title: string, message: string, onConfirm: () => void) => {
        setModalConfig({
            isOpen: true,
            title,
            message,
            type: 'confirm',
            onConfirm
        });
    }, []);

    const closeModal = useCallback(() => {
        setModalConfig(prev => ({ ...prev, isOpen: false }));
    }, []);

    return (
        <ModalContext.Provider value={{ showAlert, showConfirm }}>
            {children}
            <CustomModal
                isOpen={modalConfig.isOpen}
                onClose={closeModal}
                title={modalConfig.title}
                message={modalConfig.message}
                type={modalConfig.type}
                onConfirm={modalConfig.onConfirm}
            />
        </ModalContext.Provider>
    );
};
