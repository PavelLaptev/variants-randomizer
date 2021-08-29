import { shuffleArray } from "./utils";

////////////////////////////////////////////////////////////////
///////////////////////// UI CONFIG ////////////////////////////
////////////////////////////////////////////////////////////////

// Show UI
let uiSize = {
  width: 260,
  height: 320
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

  const groupedSelection = selection.reduce((r, a) => {
    r[a.masterComponent.parent.id] = r[a.masterComponent.parent.id] || [];
    r[a.masterComponent.parent.id].push(a);
    return r;
  }, {});

  const variants = [
    ...new Set(
      selection.map((item: InstanceNode) => {
        return item.masterComponent.parent;
      })
    )
  ];

  // console.log(variants);

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
      let data = msg.data;

      Object.values(groupedSelection).forEach(
        (instanceGroup: Array<InstanceNode>) => {
          let controlledGroupVariants = null;

          instanceGroup.forEach((item: InstanceNode, instanceIndex: number) => {
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

                !controlledGroupVariants
                  ? (controlledGroupVariants = shuffleArray(
                      item.masterComponent.parent.children.filter(c => {
                        let difference = c.name
                          .split(", ")
                          .filter(x => far.includes(x));

                        if (difference.length === far.length) {
                          return c;
                        }
                      })
                    ))
                  : false;

                let randomElement = controlledGroupVariants[
                  Math.floor(Math.random() * controlledGroupVariants.length)
                ] as ComponentNode;

                if (msg.isNoRepeat) {
                  controlledGroupVariants.length > instanceIndex
                    ? item.swapComponent(controlledGroupVariants[instanceIndex])
                    : false;
                } else {
                  item.swapComponent(randomElement);
                }
              }
            });
          });
        }
      );
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
