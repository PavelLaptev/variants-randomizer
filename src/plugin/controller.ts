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

const init = () => {
  const checkForVariants = (nodes: any) => {
    return nodes
      .map(node => {
        if (node.variantProperties) {
          return node;
        }
        if (node.type === "FRAME" || node.type === "GROUP") {
          return checkForVariants(node.children);
        }
      })
      .flat(Infinity)
      .filter(Boolean);
  };

  const selection = figma.currentPage.selection;
  const selectedVariants = checkForVariants(selection);

  const reducedVariants = selectedVariants.reduce(
    (r, i) =>
      !r.some(
        j =>
          JSON.stringify(i.masterComponent.parent.id) ===
          JSON.stringify(j.masterComponent.parent.id)
      )
        ? [...r, i]
        : r,
    []
  );

  const groupedVariants = (selectedVariants as any).reduce((r, a) => {
    r[a.masterComponent.parent.id] = r[a.masterComponent.parent.id] || [];
    r[a.masterComponent.parent.id].push(a);
    return r;
  }, {});

  const variantsObj = reducedVariants.map((variantInstance: InstanceNode) => {
    let master = variantInstance.masterComponent.parent as ComponentSetNode;

    let obj = {
      component: { name: master.name, id: master.id },
      variants: master.variantGroupProperties,
      selectedVariants: [],
      children: master.children.map((c: InstanceNode) => ({
        id: c.id,
        name: c.name,
        variants: c.variantProperties
      }))
    } as variantsObj;

    return obj;
  });

  figma.ui.postMessage({
    type: "variants",
    data: variantsObj
  });

  figma.ui.onmessage = async msg => {
    if (msg.type === "random-selected") {
      let data = msg.data;

      Object.values(groupedVariants).forEach(
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
