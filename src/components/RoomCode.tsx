import copyImg from '../assets/images/copy.svg';

import '../styles/room-code.scss';


type RoomCodeProps = {
  roomCode: string;
}
export function RoomCode({roomCode}: RoomCodeProps){

  function copyRoomCodeToClipboard(){
    navigator.clipboard.writeText(roomCode);
  }
  return(
    <button className="room-code" onClick={copyRoomCodeToClipboard}>
      <div>
        <img src={copyImg} alt="Copy room code" />
      </div>
      <span>sala #{roomCode}</span>
    </button>
  );
}