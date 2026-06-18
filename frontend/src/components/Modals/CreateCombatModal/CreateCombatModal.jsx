import { useState } from "react";
import Modal from "../Modal/Modal";
import "./CreateCombatModal.css";

function CreateCombatModal({ isOpen, onClose, onCreateCombat }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  function resetForm() {
    setName("");
    setDescription("");
    setErrorMessage("");
  }

  function handleClose() {
    resetForm();
    onClose();
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (name.trim() === "") {
      setErrorMessage("Digite o nome do combate.");
      return;
    }

    onCreateCombat({
      name: name.trim(),
      description: description.trim(),
    });

    resetForm();
    onClose();
  }

  return (
    <Modal isOpen={isOpen} title="Criar novo combate" onClose={handleClose}>
      <form className="create-combat-form" onSubmit={handleSubmit}>
        <label className="create-combat-form__label">
          Nome do combate
          <input
            className="create-combat-form__input"
            type="text"
            placeholder="Ex: Covil dos Lobisomens"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </label>

        <label className="create-combat-form__label">
          Descrição
          <textarea
            className="create-combat-form__textarea"
            placeholder="Ex: Combate contra lobisomens nas florestas de Baróvia."
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
        </label>

        {errorMessage && (
          <p className="create-combat-form__error">{errorMessage}</p>
        )}

        <button className="create-combat-form__submit-button" type="submit">
          Criar combate
        </button>
      </form>
    </Modal>
  );
}

export default CreateCombatModal;
