import * as React from "react";
import Toggler from "./components/Toggler";
import Divider from "./components/Divider";
import Button from "./components/Button";
import styles from "./app.module.scss";

import svgLogo from "./assets/logo.svg";

///////////////////////////////////////////////
///////////////// APPLICATION /////////////////
///////////////////////////////////////////////
const App = ({}) => {
  const containerRef = React.useRef(null);
  const [variants, setVariants] = React.useState([] as Array<variantsObj>);
  const [newVariants, setNewVariants] = React.useState(
    [] as Array<variantsObj>
  );

  //////////////////////////////////////////////
  ////////////////// HANDLERS //////////////////
  //////////////////////////////////////////////
  const sendNewVariants = () => {
    parent.postMessage(
      {
        pluginMessage: {
          type: "what-to-random",
          data: newVariants
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

    setNewVariants(variantsClone);
  };

  //////////////////////////////////////////////
  //////////////// REACT EFFECT ////////////////
  //////////////////////////////////////////////
  React.useEffect(() => {
    onmessage = event => {
      if (event.data.pluginMessage.type === "variants") {
        setVariants(event.data.pluginMessage.data);
        setNewVariants(event.data.pluginMessage.data);
      }
    };
  }, [variants, newVariants]);

  //////////////////////////////////////////////
  //////////// COMPONENT FUNCTIONS /////////////
  //////////////////////////////////////////////
  const addVariants = (variants: Array<variantsObj>) => {
    return variants.map((item, i) => {
      // console.log(i);
      return (
        <div
          ref={containerRef}
          className={styles.variant}
          key={`component-${i}`}
        >
          <Divider />
          <h3>{item.component.name}</h3>
          {item.variants.map((variant, j) => {
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
      {variants.length > 0 ? (
        <>
          <div>
            <p className={styles.caption}>
              Unselect variants that you don't want to randomize 👇
            </p>
            <div className={styles.variantsWrap}>{addVariants(variants)}</div>
          </div>

          <Button onClick={sendNewVariants} label="Randomize!" />
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
