////////////////////////////////////////////////////////////////
///////////////////////// UI CONFIG ////////////////////////////
////////////////////////////////////////////////////////////////

// Show UI
figma.showUI(__html__, { width: 300, height: 600 });

////////////////////////////////////////////////////////////////
///////////////////////// ON MESSAGE ///////////////////////////
////////////////////////////////////////////////////////////////

const selection = figma.currentPage.selection;
const variantsJSON = [];

const variants = [
  ...new Set(
    selection.map(item => {
      return item.masterComponent.parent;
    })
  )
];

variants.forEach(item => {
  variantsJSON.push({
    component: { name: item.name, id: item.id },
    variants: item.children[0].name
      .split(", ")
      .map(name => name.substr(0, name.indexOf("=")))
  });
});

// console.log(variantsJSON);

figma.ui.postMessage({
  type: "variants",
  data: variantsJSON
});

figma.ui.onmessage = async msg => {
  if (msg.type === "what-to-random") {
    let selection = figma.currentPage.selection;

    console.log(msg.data);

    // msg.data.forEach(item => {

    // });

    // selection.forEach(item => {
    //   const componentVariants = item.masterComponent.parent.children;

    //   // let currentVariant = msg.data.filter(
    //   //   c => c.id === item.masterComponent.parent.id
    //   // );

    //   // if (currentVariant) {
    //   // console.log(currentVariant);

    //   msg.data.forEach(element => {
    //     let checkString = item.mainComponent.name
    //       .split(", ")
    //       .find(c => c.includes(element.variant));

    //     let filteredVariants = componentVariants.filter(c =>
    //       c.name.includes(checkString)
    //     );

    //     console.log(filteredVariants);

    //     const randomElement =
    //       filteredVariants[Math.floor(Math.random() * filteredVariants.length)];

    //     item.swapComponent(randomElement);
    //   });

    // let filteredVariants = componentVariants.filter(c =>
    //   c.name.includes(lockedVariant)
    // );

    // const randomElement =
    //   filteredVariants[Math.floor(Math.random() * filteredVariants.length)];

    // item.swapComponent(randomElement);

    // console.log(currentVariant);
    // }

    // console.log(item.mainComponent.name.split(currentVariant));

    // componentVariants.map(c => {
    //   let referenz = item.mainComponent.name;
    //   console.log(c.name, referenz);
    //   // if (c.name) {
    //   //   console.log(c.name);
    //   // }
    // });
    // });
  }
};
