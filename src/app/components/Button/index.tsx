import * as React from "react";
import styles from "./styles.module.scss";

interface Props {
  label: string;
  onClick: (e: any) => void;
}

const Divider: React.FunctionComponent<Props> = props => {
  return (
    <button onClick={props.onClick} className={styles.button}>
      {props.label}
    </button>
  );
};

export default Divider;
