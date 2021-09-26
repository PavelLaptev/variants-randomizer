import * as React from "react";
import Toggler from "./components/Toggler";
import Divider from "./components/Divider";
import Button from "./components/Button";
import Resizer from "./components/Resizer";
import styles from "./app.module.scss";

import svgLogo from "./assets/logo.svg";

///////////////////////////////////////////////
///////////////// APPLICATION /////////////////
///////////////////////////////////////////////
const App = ({}) => {
  const containerRef = React.useRef(null);
  const [variants, setVariants] = React.useState([] as Array<variantsObj>);
  const [isNoRepeat, setIsNoRepeat] = React.useState(false);

  //////////////////////////////////////////////
  ////////////////// HANDLERS //////////////////
  //////////////////////////////////////////////
  const sendNewVariants = () => {
    parent.postMessage(
      {
        pluginMessage: {
          type: "random-selected",
          data: variants,
          isNoRepeat: isNoRepeat
        }
      },
      "*"
    );
  };

  const handleCheckbox = (e, componentID, variant) => {
    let variantsClone = variants;

    if (e.target.checked) {
      variantsClone.map(item => {
        if (componentID === item.component.id) {
          let index = item.selectedVariants.indexOf(variant);
          if (index >= 0) {
            item.selectedVariants.splice(index, 1);
          }
        }
      });
    } else {
      variantsClone.map(item => {
        if (componentID === item.component.id) {
          item.selectedVariants.push(variant);
        }
      });
    }
  };

  //////////////////////////////////////////////
  //////////////// REACT EFFECT ////////////////
  //////////////////////////////////////////////
  React.useEffect(() => {
    onmessage = event => {
      if (event.data.pluginMessage.type === "variants") {
        setVariants(event.data.pluginMessage.data);
      }
    };
  }, [variants]);

  //////////////////////////////////////////////
  //////////// COMPONENT FUNCTIONS /////////////
  //////////////////////////////////////////////
  const addVariants = (variants: Array<variantsObj>) => {
    return variants.map((item, i) => {
      // console.log(item);
      return (
        <div
          ref={containerRef}
          className={styles.variant}
          key={`component-${i}`}
        >
          <Divider />
          <h3>{item.component.name}</h3>
          {Object.keys(item.variants).map((variant, j) => {
            let variantKey = `variant-${i}-${j}`;
            return (
              <Toggler
                checked={true}
                key={variantKey}
                togglerKey={variantKey}
                name={variant}
                onChange={e => handleCheckbox(e, item.component.id, variant)}
              />
            );
          })}
        </div>
      );
    });
  };

  //////////////////////////////////////////////
  /////////////////// RENDER ///////////////////
  //////////////////////////////////////////////

  return (
    <section className={styles.app}>
      <Resizer />
      {variants.length > 0 ? (
        <>
          <div>
            <p className={styles.caption}>
              Unselect variant properties you don't want to randomize 👇
            </p>
            <div className={styles.variantsWrap}>{addVariants(variants)}</div>
          </div>

          <div className={styles.operationsWrap}>
            <Divider />
            <Toggler
              checked={isNoRepeat}
              togglerKey={"no-repeat"}
              name={"Do not repeat variants"}
              style={{ marginBottom: "16px" }}
              onChange={e => {
                setIsNoRepeat(e.target.checked);
              }}
            />
            <Button onClick={sendNewVariants} label="Randomize!" />
          </div>
        </>
      ) : (
        <section className={styles.emptyState}>
          <div className={styles.emptyState_placeholder}>
            <img src={svgLogo} />
            <h3>Select variant instances …</h3>
          </div>
        </section>
      )}
    </section>
  );
};

export default App;
