import * as React from "react";
// import styles from "./app.module.scss";

///////////////////////////////////////////////
///////////////// APPLICATION /////////////////
///////////////////////////////////////////////
const App = ({}) => {
  const [variants, setVariants] = React.useState([] as Array<variantsObj>);
  const [randomizeList, setRandomizeList] = React.useState([] as Array<object>);

  //////////////////////////////////////////////
  ////////////////// HANDLERS //////////////////
  //////////////////////////////////////////////
  const sendRandom = () => {
    parent.postMessage(
      {
        pluginMessage: {
          type: "what-to-random",
          data: randomizeList
        }
      },
      "*"
    );
  };

  const handleCheckbox = (e, componentName, componentID, variant) => {
    // console.log(e.target.checked, component, variant);
    // if (e.target.checked) {
    //   setRandomizeList([
    //     ...randomizeList,
    //     {
    //       name: componentName,
    //       id: componentID,
    //       variant: variant
    //     }
    //   ]);
    // }

    if (e.target.checked) {
      if (randomizeList.length > 0) {
        randomizeList.forEach(c => {
          if (c.id !== componentID) {
            setRandomizeList([
              ...randomizeList,
              {
                name: componentName,
                id: componentID,
                variant: variant
              }
            ]);

            console.log(randomizeList);
          }
        });
      } else {
        setRandomizeList([
          {
            name: componentName,
            id: componentID,
            variant: variant
          }
        ]);
      }
    }

    // console.log(randomizeList);
  };

  //////////////////////////////////////////////
  //////////////// REACT EFFECT ////////////////
  //////////////////////////////////////////////
  React.useEffect(() => {
    onmessage = event => {
      setVariants(event.data.pluginMessage.data);
    };
  }, [variants]);

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
                      handleCheckbox(
                        e,
                        item.component.name,
                        item.component.id,
                        variant
                      )
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

      <button onClick={sendRandom}>Get Stats</button>
    </div>
  );
};

export default App;
