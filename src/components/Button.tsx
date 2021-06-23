import { useState } from "react";

export const Button = () => {
    const [counter, setCounter] = useState(0);

    const handleClick = (e: any) => {
        if (e.shiftKey){
            setCounter(prev =>prev > 0? prev - 1: prev);
        }else if(e.ctrlKey){
            setCounter(0);
        }else{
            setCounter(prev => prev + 1);
        }
    }

    return (
        <button onClick={handleClick}>{counter}</button>
    );
}