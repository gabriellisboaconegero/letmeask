import { ButtonHTMLAttributes } from "react";
// importado para que eu possa usar nas props do elemento, como eu quero passar todas a propriedades 
// de um elemento button Html, eu uso seus atributos

import "../styles/button.scss";
import cx from 'classnames';
import { useTheme } from "../hooks/useTheme";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  isOutlined?: boolean;
};

export const Button = ({isOutlined=false, ...props}: ButtonProps) => {

  const {theme} = useTheme();
  return <button {...props} className={cx(
    'button',
    theme.name,
    {outlined: isOutlined},
  )} />;
};
