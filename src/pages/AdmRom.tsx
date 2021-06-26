import { useState, FormEvent } from "react";
import { useParams } from "react-router-dom";

import logoImg from "../assets/images/logo.svg";

import { Button } from "../components/Button";
import { Question } from "../components/Question";
import { RoomCode } from "../components/RoomCode";

import { useRoom } from "../hooks/useRoom";
import { database } from "../services/firebase";


import "../styles/room.scss";

type RoomParams = {
  id: string;
};

export function AdmRoom() {
  // pega os parametros que foram passados na rota, nesse cado o id da sala
  const params = useParams<RoomParams>();
  const roomId = params.id;
  const { questions, title, user } = useRoom(roomId);

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="Letmeask" />
          <div className="">
            <RoomCode roomCode={roomId}></RoomCode>
            <Button isOutlined>Encerrar Sala</Button>
          </div>
        </div>
      </header>

      <main>
        <div className="room-title">
          <h1>Sala {title}</h1>
          {/* se não tiver pergunta não mostra quantas perguntas tem */}
          {questions.length > 0 && <span>{questions.length} pergunta(s)</span>}
        </div>

        <div className="question-list">
          {questions.map((quest) => (
            <Question 
              key={quest.id}
              content={quest.context}
              author={quest.author}
            >

            </Question>
          ))}
        </div>
      </main>
    </div>
  );
}
