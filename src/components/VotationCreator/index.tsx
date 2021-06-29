import { FormEvent, useState } from "react";
import { database } from "../../services/firebase";
import { Button } from "../Button";

type VotationCreatorProps = {
  closeCreator: () => void;
  roomId: string;
}

type VoteOptions = {
  content: string;
}[]

export function VotationCreator({closeCreator, roomId}: VotationCreatorProps){
  const [options, setOptions] = useState<VoteOptions>([]);
  const [newOption, setNewOption] = useState('');
  const [votationContent, setVotationContent] = useState('');

  function handleAddVoteOption(e: FormEvent){
    e.preventDefault();
    setOptions(prev => {
      setNewOption('');
      return [...prev, {content: newOption}];
    });
  }

  function handleDeleteOption(optId: number){
    const updatedOptions = options.filter((v, id) => id !== optId);

    setOptions(updatedOptions);
  }

  async function handleCreateVotation(){
    if (options.length <= 0 || votationContent.trim() === ''){
      return;
    }

    const votationRef = database.ref(`rooms/${roomId}/votation`);

    await votationRef.set({
      content: votationContent,
      isClosed: false
    });

    const optionsRef = votationRef.child('options')
    options.forEach(opt => {
      optionsRef.push({
        content: opt.content
      })
    });
  }

  return (
    <div className="votation-panel">
      <button onClick={closeCreator}>Cancelar</button>
      <input type="text"
        placeholder="Digite o assunto"
        value={votationContent}
        onChange={e => setVotationContent(e.target.value)} 
      />
      <form 
        onSubmit={handleAddVoteOption}
      >
        <input 
          type="text"
          placeholder="Digite o valor das opções"
          value={newOption}
          onChange={e => setNewOption(e.target.value)}
        />
        <button type="submit">Adicionar opção</button>
      </form>
      {options.map(({content}, id) => (
        <div key={content + id}>
          <label htmlFor={content + id}>
            <input type="radio" name={content + id} id={content + id} />
            <span>{content}</span>
          </label>
          <button type="button" onClick={() => handleDeleteOption(id)}>Retirar</button>
        </div>
      ))}
      <Button type="button" onClick={handleCreateVotation}>Criar votação</Button>
    </div>
  );
}