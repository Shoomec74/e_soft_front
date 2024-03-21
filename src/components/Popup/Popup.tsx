// Modal.tsx
import React from 'react';
import ReactDOM from 'react-dom';

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    (
      <div className="modal-overlay">
        <div className="modal-window">
          <button onClick={onClose}>Закрыть</button>
          {children}
        </div>
      </div>
    ),
    document.getElementById('modal')!
  );
};

export default Modal;
