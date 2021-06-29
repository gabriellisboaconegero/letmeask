import { ChangeEvent, useState } from "react";
import { FormEvent, ReactNode } from "react";

type VotationType ={
  content: string;
  isClosed: boolean;
  totalVotes: number;
  voteId: string | undefined;
  options: {
    id: string;
    content: string;
    votes: number;
  }[];
}

type VotationProps = {
  children?: ReactNode;
  votation: VotationType;
  handleVote?: (optionId: string) => void
}

export function Votation({
  children,
  votation,
  handleVote
}: VotationProps){
  const [selectedOption, setSelectedOption] = useState('');

  function handleSelectOption(e: ChangeEvent<HTMLInputElement>){
    setSelectedOption(e.target.value);
    console.log(e.target.id);
  }

  function handleVoteInternal(e: FormEvent){
    e.preventDefault();
    if (handleVote){
      handleVote(selectedOption);
    }
  }

  return (
  <div className="votation">
    <p>{votation.content}</p>
    <form className="options" onSubmit={handleVoteInternal}>
      {votation.options.map(vote => (
        <label htmlFor={vote.id} key={vote.id}>
          <input 
            onChange={handleSelectOption}
            type="radio" 
            name={votation.content} 
            id={vote.id} 
            value={vote.id} 
            disabled={votation.isClosed || Boolean(votation.voteId)}
          />
          <span>{vote.content}</span>
          <div className="votes-bar">{vote.votes}</div>
        </label>
      ))}
      <button type="submit">Enviar</button>
    </form>
    {children && (
      <div>
        {children}
      </div>
    )} 
  </div>
  );
}