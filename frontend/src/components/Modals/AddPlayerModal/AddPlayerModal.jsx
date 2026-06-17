import { useState } from "react";
import Modal from "../Modal/Modal";
import "./AddPlayerModal.css";

function AddPlayerModal({ isOpen, onClose, onAddPlayer }) {
  const [name, setName] = useState("");
  const [armorClass, setArmorClass] = useState("");
  const [maxHp, setMaxHp] = useState("");
  const [initiative, setInitiative] = useState("");
  const [speed, setSpeed] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  function resetForm() {
    setName("");
    setArmorClass("");
    setMaxHp("");
    setInitiative("");
    setSpeed("");
    setErrorMessage("");
  }

  function handleClose() {
    resetForm();
    onClose();
  }

  function handleSubmit(event) {
    event.preventDefault();

    const parsedArmorClass = Number(armorClass);
    const parsedMaxHp = Number(maxHp);
    const parsedInitiative = Number(initiative);
    const parsedSpeed = Number(speed);

    if (
      name.trim() === "" ||
      Number.isNaN(parsedArmorClass) ||
      Number.isNaN(parsedMaxHp) ||
      Number.isNaN(parsedInitiative) ||
      Number.isNaN(parsedSpeed) ||
      parsedArmorClass <= 0 ||
      parsedMaxHp <= 0 ||
      parsedSpeed <= 0
    ) {
      setErrorMessage("Preencha todos os campos corretamente.");
      return;
    }

    onAddPlayer({
      name: name.trim(),
      armorClass: parsedArmorClass,
      maxHp: parsedMaxHp,
      initiative: parsedInitiative,
      speed: parsedSpeed,
    });

    resetForm();
    onClose();
  }

  return (
    <Modal isOpen={isOpen} title="Adicionar jogador" onClose={handleClose}>
      <form className="add-player-form" onSubmit={handleSubmit}>
        <label className="add-player-form__label">
          Nome do personagem
          <input
            className="add-player-form__input"
            type="text"
            placeholder="Ex: Sócrates Riverdeep"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </label>

        <div className="add-player-form__grid">
          <label className="add-player-form__label">
            CA
            <input
              className="add-player-form__input"
              type="number"
              min="1"
              placeholder="16"
              value={armorClass}
              onChange={(event) => setArmorClass(event.target.value)}
            />
          </label>

          <label className="add-player-form__label">
            HP máximo
            <input
              className="add-player-form__input"
              type="number"
              min="1"
              placeholder="72"
              value={maxHp}
              onChange={(event) => setMaxHp(event.target.value)}
            />
          </label>

          <label className="add-player-form__label">
            Iniciativa
            <input
              className="add-player-form__input"
              type="number"
              placeholder="18"
              value={initiative}
              onChange={(event) => setInitiative(event.target.value)}
            />
          </label>

          <label className="add-player-form__label">
            Deslocamento
            <input
              className="add-player-form__input"
              type="number"
              min="1"
              placeholder="30"
              value={speed}
              onChange={(event) => setSpeed(event.target.value)}
            />
          </label>
        </div>

        {errorMessage && (
          <p className="add-player-form__error">{errorMessage}</p>
        )}

        <button className="add-player-form__submit-button" type="submit">
          Adicionar ao combate
        </button>
      </form>
    </Modal>
  );
}

export default AddPlayerModal;
