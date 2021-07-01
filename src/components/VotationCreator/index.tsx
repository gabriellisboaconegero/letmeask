import { FormEvent, useState } from "react";
import { database } from "../../services/firebase";
import { Button } from "../Button";
import "./styles.scss";

type VotationCreatorProps = {
  closeCreator: () => void;
  roomId: string;
};

type VoteOptions = {
  content: string;
}[];

export function VotationCreator({
  closeCreator,
  roomId,
}: VotationCreatorProps) {
  const [options, setOptions] = useState<VoteOptions>([]);
  const [newOption, setNewOption] = useState("");
  const [votationContent, setVotationContent] = useState("");

  function handleAddVoteOption(e: FormEvent) {
    e.preventDefault();
    setOptions((prev) => {
      setNewOption("");
      return [...prev, { content: newOption }];
    });
  }

  function handleDeleteOption(optId: number) {
    const updatedOptions = options.filter((v, id) => id !== optId);

    setOptions(updatedOptions);
  }

  async function handleCreateVotation() {
    if (options.length <= 0 || votationContent.trim() === "") {
      return;
    }

    const votationRef = database.ref(`rooms/${roomId}/votation`);

    await votationRef.set({
      content: votationContent,
      isClosed: false,
    });

    const optionsRef = votationRef.child("options");
    options.forEach((opt) => {
      optionsRef.push({
        content: opt.content,
      });
    });

    closeCreator();
  }

  return (
    <div className="votation-panel">
      <div className="context">
        <input
          type="text"
          placeholder="Digite o assunto"
          value={votationContent}
          onChange={(e) => setVotationContent(e.target.value)}
        />
      </div>
      <div className="options">
        {options.map(({ content }, id) => (
          <div key={content + id} className="option-added">
            <span>{content}</span>
            <button type="button" onClick={() => handleDeleteOption(id)}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="white"
                className="bi bi-x-lg"
                viewBox="0 0 16 16"
              >
                <path d="M1.293 1.293a1 1 0 0 1 1.414 0L8 6.586l5.293-5.293a1 1 0 1 1 1.414 1.414L9.414 8l5.293 5.293a1 1 0 0 1-1.414 1.414L8 9.414l-5.293 5.293a1 1 0 0 1-1.414-1.414L6.586 8 1.293 2.707a1 1 0 0 1 0-1.414z" />
              </svg>
            </button>
          </div>
        ))}
        <form onSubmit={handleAddVoteOption}>
          <input
            type="text"
            placeholder="Opção"
            value={newOption}
            onChange={(e) => setNewOption(e.target.value)}
          />
          <button type="submit">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="white"
              className="bi bi-plus-lg"
              viewBox="0 0 16 16"
            >
              <path d="M8 0a1 1 0 0 1 1 1v6h6a1 1 0 1 1 0 2H9v6a1 1 0 1 1-2 0V9H1a1 1 0 0 1 0-2h6V1a1 1 0 0 1 1-1z" />
            </svg>
          </button>
        </form>
      </div>
      <div>
        <Button type="button" onClick={handleCreateVotation}>
          Criar votação
        </Button>
        <Button onClick={closeCreator}>Cancelar</Button>
      </div>
    </div>
  );
}
