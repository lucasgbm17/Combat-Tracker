import Modal from "../Modal/Modal";
import "./ConfirmResetModal.css";

function ConfirmResetModal({ isOpen, onClose, onConfirm }) {
  return (
    <Modal
      isOpen={isOpen}
      title="Reiniciar combate?"
      onClose={onClose}
      variant="danger"
    >
      <div className="confirm-reset-modal">
        <p className="confirm-reset-modal__text">
          Essa ação vai remover todos os participantes do combate, zerar a ordem
          de iniciativa e voltar para a rodada 1.
        </p>

        <p className="confirm-reset-modal__warning">
          Essa ação não pode ser desfeita.
        </p>

        <div className="confirm-reset-modal__actions">
          <button
            className="confirm-reset-modal__button confirm-reset-modal__button_cancel"
            type="button"
            onClick={onClose}
          >
            Cancelar
          </button>

          <button
            className="confirm-reset-modal__button confirm-reset-modal__button_confirm"
            type="button"
            onClick={onConfirm}
          >
            Reiniciar combate
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default ConfirmResetModal;
