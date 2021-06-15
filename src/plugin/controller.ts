////////////////////////////////////////////////////////////////
///////////////////////// UI CONFIG ////////////////////////////
////////////////////////////////////////////////////////////////

// Show UI
let uiSize = {
  width: 260,
  height: 300
};
figma.showUI(__html__, { width: uiSize.width, height: uiSize.height });

////////////////////////////////////////////////////////////////
///////////////////////// ON MESSAGE ///////////////////////////
////////////////////////////////////////////////////////////////

const clearSelection = selection =>
  (selection as Array<any>).filter(
    c => c.masterComponent?.parent.type === "COMPONENT_SET"
  );

const init = () => {
  const selection = clearSelection(figma.currentPage.selection);
  const variantsJSON = [];

  const variants = [
    ...new Set(
      selection.map((item: InstanceNode) => {
        return item.masterComponent.parent;
      })
    )
  ];

  variants.forEach((item: InstanceNode) => {
    variantsJSON.push({
      component: { name: item.name, id: item.id },
      variants: item.children[0].name
        .split(", ")
        .map(name => name.substr(0, name.indexOf("="))),
      selectedVariants: [],
      children: item.children.map(c => ({
        name: c.name,
        variants: c.name.split(", "),
        id: c.id
      }))
    } as variantsObj);
  });

  figma.ui.postMessage({
    type: "variants",
    data: variantsJSON
  });

  figma.ui.onmessage = async msg => {
    if (msg.type === "what-to-random") {
      selection.forEach((item: InstanceNode) => {
        let data = msg.data;
        let itemVariants = item.mainComponent.name.split(", ");

        data.map(x => {
          if (x.component.id === item.masterComponent.parent.id) {
            let ar = itemVariants.map(y => {
              return x.selectedVariants.map(z => {
                if (y.includes(z)) {
                  return y;
                }
              });
            });

            let far = ar.flat().filter(Boolean);

            let vfar = item.masterComponent.parent.children.filter(c => {
              let difference = c.name.split(", ").filter(x => far.includes(x));

              if (difference.length === far.length) {
                // console.log(c.name);
                return c;
              }
            });

            // console.log(vfar);

            let randomElement = vfar[
              Math.floor(Math.random() * vfar.length)
            ] as ComponentNode;

            item.swapComponent(randomElement);
          }
        });
      });
    }

    if (msg.type === "resize") {
      figma.ui.resize(uiSize.width, msg.size);
    }
  };
};

init();

figma.on("selectionchange", () => {
  init();
});
