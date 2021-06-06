import * as React from "react";
// import styles from "./app.module.scss";

///////////////////////////////////////////////
///////////////// APPLICATION /////////////////
///////////////////////////////////////////////
const App = ({}) => {
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
          let index = item.variants.indexOf(variant);
          if (index >= 0) {
            item.variants.splice(index, 1);
          }
        }
      });
    } else {
      variantsClone.map(item => {
        if (componentID === item.component.id) {
          item.variants.push(variant);
        }
      });
    }

    // console.log(variantsClone);
    setNewVariants(variantsClone);
  };

  //////////////////////////////////////////////
  //////////////// REACT EFFECT ////////////////
  //////////////////////////////////////////////
  React.useEffect(() => {
    onmessage = event => {
      setVariants(event.data.pluginMessage.data);
      setNewVariants(event.data.pluginMessage.data);
    };
  }, [variants, newVariants]);

  //////////////////////////////////////////////
  //////////// COMPONENT FUNCTIONS /////////////
  //////////////////////////////////////////////
  const addVariants = (variants: Array<variantsObj>) => {
    if (variants.length > 0) {
      return variants.map((item, i) => {
        return (
          <div key={`component-${i}`}>
            <h3>{item.component.name}</h3>
            {item.variants.map((variant, j) => {
              let variantKey = `variant-${i}-${j}`;
              return (
                <div key={variantKey}>
                  <label htmlFor={variantKey}>{variant}</label>
                  <input
                    onChange={e =>
                      handleCheckbox(e, item.component.id, variant)
                    }
                    id={variantKey}
                    type="checkbox"
                  />
                </div>
              );
            })}
          </div>
        );
      });
    } else {
      return <div>please select something</div>;
    }
  };

  //////////////////////////////////////////////
  /////////////////// RENDER ///////////////////
  //////////////////////////////////////////////

  return (
    <div>
      <h1>Hello Stats!</h1>

      {addVariants(variants)}

      <button onClick={sendNewVariants}>Get Stats</button>
    </div>
  );
};

export default App;
