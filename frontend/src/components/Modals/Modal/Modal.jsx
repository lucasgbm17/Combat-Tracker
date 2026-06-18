import "./Modal.css";

function Modal({ isOpen, title, children, onClose, variant = "default" }) {
  if (!isOpen) {
    return null;
  }

  function handleOverlayClick(event) {
    if (event.target === event.currentTarget) {
      onClose();
    }
  }

  return (
    <div className="modal" onMouseDown={handleOverlayClick}>
      <div className={`modal__container modal__container_${variant}`}>
        <button
          className="modal__close-button"
          type="button"
          aria-label="Fechar modal"
          onClick={onClose}
        >
          ×
        </button>

        <h2 className={`modal__title modal__title_${variant}`}>{title}</h2>

        {children}
      </div>
    </div>
  );
}

export default Modal;
