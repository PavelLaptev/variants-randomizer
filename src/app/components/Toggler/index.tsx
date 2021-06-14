import * as React from "react";
import styles from "./styles.module.scss";

interface Props {
  togglerKey: string;
  name: string;
  checked: boolean;
  onChange: (e: any) => void;
}

const Toggler: React.FC<Props> = props => {
  const [toggle, setToggle] = React.useState(props.checked);

  const handleChange = e => {
    setToggle(!toggle);
    props.onChange(e);
  };

  return (
    <div className={styles.wrap}>
      <label className={styles.label} htmlFor={props.togglerKey}>
        {props.name}
      </label>
      <div className={`${styles.toggler} ${toggle ? styles.active : ""}`}>
        <input
          checked={toggle}
          id={props.togglerKey}
          onChange={handleChange}
          type="checkbox"
        />
      </div>
    </div>
  );
};

export default Toggler;
