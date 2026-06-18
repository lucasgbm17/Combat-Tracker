import { useEffect, useState } from "react";
import Modal from "../Modal/Modal";
import "./HealthModal.css";

function HealthModal({ isOpen, mode, participant, onClose, onSubmit }) {
  const [amount, setAmount] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const isDamageMode = mode === "damage";

  useEffect(() => {
    if (isOpen) {
      setAmount("");
      setErrorMessage("");
    }
  }, [isOpen]);

  function handleSubmit(event) {
    event.preventDefault();

    const parsedAmount = Number(amount);

    if (Number.isNaN(parsedAmount) || parsedAmount <= 0) {
      setErrorMessage("Digite um valor maior que zero.");
      return;
    }

    onSubmit(parsedAmount);
  }

  if (!participant) {
    return null;
  }

  return (
    <Modal
      isOpen={isOpen}
      title={isDamageMode ? "Aplicar dano" : "Aplicar cura"}
      onClose={onClose}
      variant={isDamageMode ? "damage" : "heal"}
    >
      <form className="health-modal" onSubmit={handleSubmit}>
        <div
          className={`health-modal__target ${
            isDamageMode
              ? "health-modal__target_damage"
              : "health-modal__target_heal"
          }`}
        >
          <span className="health-modal__label">Alvo</span>
          <strong className="health-modal__name">{participant.name}</strong>
          <span className="health-modal__hp">
            HP atual: {participant.currentHp}/{participant.maxHp}
          </span>
        </div>

        <label className="health-modal__field">
          {isDamageMode ? "Valor do dano" : "Valor da cura"}
          <input
            className="health-modal__input"
            type="number"
            min="1"
            placeholder={isDamageMode ? "Ex: 12" : "Ex: 8"}
            value={amount}
            autoFocus
            onChange={(event) => setAmount(event.target.value)}
          />
        </label>

        {errorMessage && <p className="health-modal__error">{errorMessage}</p>}

        <button
          className={`health-modal__submit-button ${
            isDamageMode
              ? "health-modal__submit-button_damage"
              : "health-modal__submit-button_heal"
          }`}
          type="submit"
        >
          {isDamageMode ? "Aplicar dano" : "Aplicar cura"}
        </button>
      </form>
    </Modal>
  );
}

export default HealthModal;
