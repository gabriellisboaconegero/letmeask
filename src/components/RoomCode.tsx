import copyImg from '../assets/images/copy.svg';

import '../styles/room-code.scss';
import {useTheme} from '../hooks/useTheme';

type RoomCodeProps = {
  roomCode: string;
}
export function RoomCode({roomCode}: RoomCodeProps){

  const {theme} = useTheme();

  function copyRoomCodeToClipboard(){
    navigator.clipboard.writeText(roomCode);
  }
  return(
    <button className={`room-code ${theme.name}`} onClick={copyRoomCodeToClipboard}>
      <div>
        <img src={copyImg} alt="Copy room code" />
      </div>
      <span>sala #{roomCode}</span>
    </button>
  );
}