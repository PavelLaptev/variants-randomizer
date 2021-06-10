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
      .map(name => name.substr(0, name.indexOf("="))),
    children: item.children.map(c => ({
      name: c.name,
      variants: c.name.split(", "),
      id: c.id
    }))
  });
});

// console.log(variantsJSON);

figma.ui.postMessage({
  type: "variants",
  data: variantsJSON
});

function arr_diff(a1, a2) {
  var a = [],
    diff = [];

  for (var i = 0; i < a1.length; i++) {
    a[a1[i]] = true;
  }

  for (var i = 0; i < a2.length; i++) {
    if (a[a2[i]]) {
      delete a[a2[i]];
    } else {
      a[a2[i]] = true;
    }
  }

  for (var k in a) {
    diff.push(k);
  }

  return diff;
}

figma.ui.onmessage = async msg => {
  if (msg.type === "what-to-random") {
    let selection = figma.currentPage.selection;

    // console.log(arr.variants);

    selection.forEach(item => {
      // console.log(
      //   item.mainComponent.name
      //     .split(", ")
      //     .filter(x => x.includes(data.variants))
      // );
      let data = msg.data;

      let itemVariants = item.mainComponent.name.split(", ");

      data.map(x => {
        if (x.component.id === item.masterComponent.parent.id) {
          let ar = itemVariants.map(y => {
            return x.variants.map(z => {
              if (y.includes(z)) {
                return y;
              }
            });
          });

          let far = ar.flat().filter(Boolean);

          // console.log(far);

          // const componentVariants = item.masterComponent.parent.children.filter(c => c)

          let vfar = item.masterComponent.parent.children.filter(c => {
            let difference = c.name.split(", ").filter(x => far.includes(x));
            // console.log(difference);
            if (difference.length === far.length) {
              console.log(c.name);
              return c;
            }
            // console.log(difference);
          });

          // console.log(vfar);

          let randomElement = vfar[Math.floor(Math.random() * vfar.length)];

          item.swapComponent(randomElement);
          // console.log(fca);
        }
      });

      // console.log(,item.masterComponent.parent.id);
      // itemVariants.map(x => {

      // })
    });
  }
};
