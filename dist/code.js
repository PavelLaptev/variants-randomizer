/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/plugin/controller.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/plugin/controller.ts":
/*!**********************************!*\
  !*** ./src/plugin/controller.ts ***!
  \**********************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils */ "./src/plugin/utils/index.ts");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};

let uiSize = {
    width: 260,
    height: 320
};
figma.showUI(__html__, { width: uiSize.width, height: uiSize.height });
const init = () => {
    const checkForVariants = (nodes) => {
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
    const reducedVariants = selectedVariants.reduce((r, i) => !r.some(j => JSON.stringify(i.masterComponent.parent.id) ===
        JSON.stringify(j.masterComponent.parent.id))
        ? [...r, i]
        : r, []);
    const groupedVariants = selectedVariants.reduce((r, a) => {
        r[a.masterComponent.parent.id] = r[a.masterComponent.parent.id] || [];
        r[a.masterComponent.parent.id].push(a);
        return r;
    }, {});
    const variantsObj = reducedVariants.map((variantInstance) => {
        let master = variantInstance.masterComponent.parent;
        let obj = {
            component: { name: master.name, id: master.id },
            variants: master.variantGroupProperties,
            selectedVariants: [],
            children: master.children.map((c) => ({
                id: c.id,
                name: c.name,
                variants: c.variantProperties
            }))
        };
        return obj;
    });
    figma.ui.postMessage({
        type: "variants",
        data: variantsObj
    });
    figma.ui.onmessage = (msg) => __awaiter(void 0, void 0, void 0, function* () {
        if (msg.type === "random-selected") {
            let data = msg.data;
            Object.values(groupedVariants).forEach((instanceGroup) => {
                let controlledGroupVariants = null;
                instanceGroup.forEach((item, instanceIndex) => {
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
                                ? (controlledGroupVariants = Object(_utils__WEBPACK_IMPORTED_MODULE_0__["shuffleArray"])(item.masterComponent.parent.children.filter(c => {
                                    let difference = c.name
                                        .split(", ")
                                        .filter(x => far.includes(x));
                                    if (difference.length === far.length) {
                                        return c;
                                    }
                                })))
                                : false;
                            let randomElement = controlledGroupVariants[Math.floor(Math.random() * controlledGroupVariants.length)];
                            if (msg.isNoRepeat) {
                                controlledGroupVariants.length > instanceIndex
                                    ? item.swapComponent(controlledGroupVariants[instanceIndex])
                                    : false;
                            }
                            else {
                                item.swapComponent(randomElement);
                            }
                        }
                    });
                });
            });
        }
        if (msg.type === "resize") {
            figma.ui.resize(uiSize.width, msg.size);
        }
    });
};
init();
figma.on("selectionchange", () => {
    init();
});


/***/ }),

/***/ "./src/plugin/utils/index.ts":
/*!***********************************!*\
  !*** ./src/plugin/utils/index.ts ***!
  \***********************************/
/*! exports provided: shuffleArray */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _shuffleArray__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./shuffleArray */ "./src/plugin/utils/shuffleArray.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "shuffleArray", function() { return _shuffleArray__WEBPACK_IMPORTED_MODULE_0__["default"]; });




/***/ }),

/***/ "./src/plugin/utils/shuffleArray.ts":
/*!******************************************!*\
  !*** ./src/plugin/utils/shuffleArray.ts ***!
  \******************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
const shuffleArray = array => {
    var currentIndex = array.length, randomIndex;
    while (currentIndex != 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex],
            array[currentIndex]
        ];
    }
    return array;
};
/* harmony default export */ __webpack_exports__["default"] = (shuffleArray);


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL3BsdWdpbi9jb250cm9sbGVyLnRzIiwid2VicGFjazovLy8uL3NyYy9wbHVnaW4vdXRpbHMvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3BsdWdpbi91dGlscy9zaHVmZmxlQXJyYXkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtRQUFBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBOzs7UUFHQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMENBQTBDLGdDQUFnQztRQUMxRTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLHdEQUF3RCxrQkFBa0I7UUFDMUU7UUFDQSxpREFBaUQsY0FBYztRQUMvRDs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0EseUNBQXlDLGlDQUFpQztRQUMxRSxnSEFBZ0gsbUJBQW1CLEVBQUU7UUFDckk7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSwyQkFBMkIsMEJBQTBCLEVBQUU7UUFDdkQsaUNBQWlDLGVBQWU7UUFDaEQ7UUFDQTtRQUNBOztRQUVBO1FBQ0Esc0RBQXNELCtEQUErRDs7UUFFckg7UUFDQTs7O1FBR0E7UUFDQTs7Ozs7Ozs7Ozs7OztBQ2xGQTtBQUFBO0FBQUEsaUJBQWlCLFNBQUksSUFBSSxTQUFJO0FBQzdCLDJCQUEyQiwrREFBK0QsZ0JBQWdCLEVBQUUsRUFBRTtBQUM5RztBQUNBLG1DQUFtQyxNQUFNLDZCQUE2QixFQUFFLFlBQVksV0FBVyxFQUFFO0FBQ2pHLGtDQUFrQyxNQUFNLGlDQUFpQyxFQUFFLFlBQVksV0FBVyxFQUFFO0FBQ3BHLCtCQUErQixxRkFBcUY7QUFDcEg7QUFDQSxLQUFLO0FBQ0w7QUFDdUM7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3QkFBd0IsNkNBQTZDO0FBQ3JFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSyxJQUFJO0FBQ1Q7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLG1DQUFtQztBQUMzRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlDQUFpQztBQUNqQyw2QkFBNkI7QUFDN0I7QUFDQTtBQUNBLDZEQUE2RCwyREFBWTtBQUN6RTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQ0FBaUM7QUFDakM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQjtBQUNyQixpQkFBaUI7QUFDakIsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7Ozs7Ozs7Ozs7OztBQzNHRDtBQUFBO0FBQUE7QUFBQTtBQUF5RDs7Ozs7Ozs7Ozs7OztBQ0F6RDtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNlLDJFQUFZLEVBQUMiLCJmaWxlIjoiY29kZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGdldHRlciB9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuIFx0XHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcbiBcdFx0fVxuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuIFx0fTtcblxuIFx0Ly8gY3JlYXRlIGEgZmFrZSBuYW1lc3BhY2Ugb2JqZWN0XG4gXHQvLyBtb2RlICYgMTogdmFsdWUgaXMgYSBtb2R1bGUgaWQsIHJlcXVpcmUgaXRcbiBcdC8vIG1vZGUgJiAyOiBtZXJnZSBhbGwgcHJvcGVydGllcyBvZiB2YWx1ZSBpbnRvIHRoZSBuc1xuIFx0Ly8gbW9kZSAmIDQ6IHJldHVybiB2YWx1ZSB3aGVuIGFscmVhZHkgbnMgb2JqZWN0XG4gXHQvLyBtb2RlICYgOHwxOiBiZWhhdmUgbGlrZSByZXF1aXJlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnQgPSBmdW5jdGlvbih2YWx1ZSwgbW9kZSkge1xuIFx0XHRpZihtb2RlICYgMSkgdmFsdWUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKHZhbHVlKTtcbiBcdFx0aWYobW9kZSAmIDgpIHJldHVybiB2YWx1ZTtcbiBcdFx0aWYoKG1vZGUgJiA0KSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlICYmIHZhbHVlLl9fZXNNb2R1bGUpIHJldHVybiB2YWx1ZTtcbiBcdFx0dmFyIG5zID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yKG5zKTtcbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG5zLCAnZGVmYXVsdCcsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHZhbHVlIH0pO1xuIFx0XHRpZihtb2RlICYgMiAmJiB0eXBlb2YgdmFsdWUgIT0gJ3N0cmluZycpIGZvcih2YXIga2V5IGluIHZhbHVlKSBfX3dlYnBhY2tfcmVxdWlyZV9fLmQobnMsIGtleSwgZnVuY3Rpb24oa2V5KSB7IHJldHVybiB2YWx1ZVtrZXldOyB9LmJpbmQobnVsbCwga2V5KSk7XG4gXHRcdHJldHVybiBucztcbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSBcIi4vc3JjL3BsdWdpbi9jb250cm9sbGVyLnRzXCIpO1xuIiwidmFyIF9fYXdhaXRlciA9ICh0aGlzICYmIHRoaXMuX19hd2FpdGVyKSB8fCBmdW5jdGlvbiAodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XG4gICAgZnVuY3Rpb24gYWRvcHQodmFsdWUpIHsgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgUCA/IHZhbHVlIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZSh2YWx1ZSk7IH0pOyB9XG4gICAgcmV0dXJuIG5ldyAoUCB8fCAoUCA9IFByb21pc2UpKShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHN0ZXAocmVzdWx0KSB7IHJlc3VsdC5kb25lID8gcmVzb2x2ZShyZXN1bHQudmFsdWUpIDogYWRvcHQocmVzdWx0LnZhbHVlKS50aGVuKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpOyB9XG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcbiAgICB9KTtcbn07XG5pbXBvcnQgeyBzaHVmZmxlQXJyYXkgfSBmcm9tIFwiLi91dGlsc1wiO1xubGV0IHVpU2l6ZSA9IHtcbiAgICB3aWR0aDogMjYwLFxuICAgIGhlaWdodDogMzIwXG59O1xuZmlnbWEuc2hvd1VJKF9faHRtbF9fLCB7IHdpZHRoOiB1aVNpemUud2lkdGgsIGhlaWdodDogdWlTaXplLmhlaWdodCB9KTtcbmNvbnN0IGluaXQgPSAoKSA9PiB7XG4gICAgY29uc3QgY2hlY2tGb3JWYXJpYW50cyA9IChub2RlcykgPT4ge1xuICAgICAgICByZXR1cm4gbm9kZXNcbiAgICAgICAgICAgIC5tYXAobm9kZSA9PiB7XG4gICAgICAgICAgICBpZiAobm9kZS52YXJpYW50UHJvcGVydGllcykge1xuICAgICAgICAgICAgICAgIHJldHVybiBub2RlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKG5vZGUudHlwZSA9PT0gXCJGUkFNRVwiIHx8IG5vZGUudHlwZSA9PT0gXCJHUk9VUFwiKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNoZWNrRm9yVmFyaWFudHMobm9kZS5jaGlsZHJlbik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICAgICAgICAuZmxhdChJbmZpbml0eSlcbiAgICAgICAgICAgIC5maWx0ZXIoQm9vbGVhbik7XG4gICAgfTtcbiAgICBjb25zdCBzZWxlY3Rpb24gPSBmaWdtYS5jdXJyZW50UGFnZS5zZWxlY3Rpb247XG4gICAgY29uc3Qgc2VsZWN0ZWRWYXJpYW50cyA9IGNoZWNrRm9yVmFyaWFudHMoc2VsZWN0aW9uKTtcbiAgICBjb25zdCByZWR1Y2VkVmFyaWFudHMgPSBzZWxlY3RlZFZhcmlhbnRzLnJlZHVjZSgociwgaSkgPT4gIXIuc29tZShqID0+IEpTT04uc3RyaW5naWZ5KGkubWFzdGVyQ29tcG9uZW50LnBhcmVudC5pZCkgPT09XG4gICAgICAgIEpTT04uc3RyaW5naWZ5KGoubWFzdGVyQ29tcG9uZW50LnBhcmVudC5pZCkpXG4gICAgICAgID8gWy4uLnIsIGldXG4gICAgICAgIDogciwgW10pO1xuICAgIGNvbnN0IGdyb3VwZWRWYXJpYW50cyA9IHNlbGVjdGVkVmFyaWFudHMucmVkdWNlKChyLCBhKSA9PiB7XG4gICAgICAgIHJbYS5tYXN0ZXJDb21wb25lbnQucGFyZW50LmlkXSA9IHJbYS5tYXN0ZXJDb21wb25lbnQucGFyZW50LmlkXSB8fCBbXTtcbiAgICAgICAgclthLm1hc3RlckNvbXBvbmVudC5wYXJlbnQuaWRdLnB1c2goYSk7XG4gICAgICAgIHJldHVybiByO1xuICAgIH0sIHt9KTtcbiAgICBjb25zdCB2YXJpYW50c09iaiA9IHJlZHVjZWRWYXJpYW50cy5tYXAoKHZhcmlhbnRJbnN0YW5jZSkgPT4ge1xuICAgICAgICBsZXQgbWFzdGVyID0gdmFyaWFudEluc3RhbmNlLm1hc3RlckNvbXBvbmVudC5wYXJlbnQ7XG4gICAgICAgIGxldCBvYmogPSB7XG4gICAgICAgICAgICBjb21wb25lbnQ6IHsgbmFtZTogbWFzdGVyLm5hbWUsIGlkOiBtYXN0ZXIuaWQgfSxcbiAgICAgICAgICAgIHZhcmlhbnRzOiBtYXN0ZXIudmFyaWFudEdyb3VwUHJvcGVydGllcyxcbiAgICAgICAgICAgIHNlbGVjdGVkVmFyaWFudHM6IFtdLFxuICAgICAgICAgICAgY2hpbGRyZW46IG1hc3Rlci5jaGlsZHJlbi5tYXAoKGMpID0+ICh7XG4gICAgICAgICAgICAgICAgaWQ6IGMuaWQsXG4gICAgICAgICAgICAgICAgbmFtZTogYy5uYW1lLFxuICAgICAgICAgICAgICAgIHZhcmlhbnRzOiBjLnZhcmlhbnRQcm9wZXJ0aWVzXG4gICAgICAgICAgICB9KSlcbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIG9iajtcbiAgICB9KTtcbiAgICBmaWdtYS51aS5wb3N0TWVzc2FnZSh7XG4gICAgICAgIHR5cGU6IFwidmFyaWFudHNcIixcbiAgICAgICAgZGF0YTogdmFyaWFudHNPYmpcbiAgICB9KTtcbiAgICBmaWdtYS51aS5vbm1lc3NhZ2UgPSAobXNnKSA9PiBfX2F3YWl0ZXIodm9pZCAwLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgaWYgKG1zZy50eXBlID09PSBcInJhbmRvbS1zZWxlY3RlZFwiKSB7XG4gICAgICAgICAgICBsZXQgZGF0YSA9IG1zZy5kYXRhO1xuICAgICAgICAgICAgT2JqZWN0LnZhbHVlcyhncm91cGVkVmFyaWFudHMpLmZvckVhY2goKGluc3RhbmNlR3JvdXApID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgY29udHJvbGxlZEdyb3VwVmFyaWFudHMgPSBudWxsO1xuICAgICAgICAgICAgICAgIGluc3RhbmNlR3JvdXAuZm9yRWFjaCgoaXRlbSwgaW5zdGFuY2VJbmRleCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBsZXQgaXRlbVZhcmlhbnRzID0gaXRlbS5tYWluQ29tcG9uZW50Lm5hbWUuc3BsaXQoXCIsIFwiKTtcbiAgICAgICAgICAgICAgICAgICAgZGF0YS5tYXAoeCA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoeC5jb21wb25lbnQuaWQgPT09IGl0ZW0ubWFzdGVyQ29tcG9uZW50LnBhcmVudC5pZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBhciA9IGl0ZW1WYXJpYW50cy5tYXAoeSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB4LnNlbGVjdGVkVmFyaWFudHMubWFwKHogPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHkuaW5jbHVkZXMoeikpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4geTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGZhciA9IGFyLmZsYXQoKS5maWx0ZXIoQm9vbGVhbik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIWNvbnRyb2xsZWRHcm91cFZhcmlhbnRzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gKGNvbnRyb2xsZWRHcm91cFZhcmlhbnRzID0gc2h1ZmZsZUFycmF5KGl0ZW0ubWFzdGVyQ29tcG9uZW50LnBhcmVudC5jaGlsZHJlbi5maWx0ZXIoYyA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgZGlmZmVyZW5jZSA9IGMubmFtZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5zcGxpdChcIiwgXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmZpbHRlcih4ID0+IGZhci5pbmNsdWRlcyh4KSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZGlmZmVyZW5jZS5sZW5ndGggPT09IGZhci5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gYztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCByYW5kb21FbGVtZW50ID0gY29udHJvbGxlZEdyb3VwVmFyaWFudHNbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogY29udHJvbGxlZEdyb3VwVmFyaWFudHMubGVuZ3RoKV07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG1zZy5pc05vUmVwZWF0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZWRHcm91cFZhcmlhbnRzLmxlbmd0aCA+IGluc3RhbmNlSW5kZXhcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gaXRlbS5zd2FwQ29tcG9uZW50KGNvbnRyb2xsZWRHcm91cFZhcmlhbnRzW2luc3RhbmNlSW5kZXhdKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW0uc3dhcENvbXBvbmVudChyYW5kb21FbGVtZW50KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG1zZy50eXBlID09PSBcInJlc2l6ZVwiKSB7XG4gICAgICAgICAgICBmaWdtYS51aS5yZXNpemUodWlTaXplLndpZHRoLCBtc2cuc2l6ZSk7XG4gICAgICAgIH1cbiAgICB9KTtcbn07XG5pbml0KCk7XG5maWdtYS5vbihcInNlbGVjdGlvbmNoYW5nZVwiLCAoKSA9PiB7XG4gICAgaW5pdCgpO1xufSk7XG4iLCJleHBvcnQgeyBkZWZhdWx0IGFzIHNodWZmbGVBcnJheSB9IGZyb20gXCIuL3NodWZmbGVBcnJheVwiO1xuIiwiY29uc3Qgc2h1ZmZsZUFycmF5ID0gYXJyYXkgPT4ge1xuICAgIHZhciBjdXJyZW50SW5kZXggPSBhcnJheS5sZW5ndGgsIHJhbmRvbUluZGV4O1xuICAgIHdoaWxlIChjdXJyZW50SW5kZXggIT0gMCkge1xuICAgICAgICByYW5kb21JbmRleCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGN1cnJlbnRJbmRleCk7XG4gICAgICAgIGN1cnJlbnRJbmRleC0tO1xuICAgICAgICBbYXJyYXlbY3VycmVudEluZGV4XSwgYXJyYXlbcmFuZG9tSW5kZXhdXSA9IFtcbiAgICAgICAgICAgIGFycmF5W3JhbmRvbUluZGV4XSxcbiAgICAgICAgICAgIGFycmF5W2N1cnJlbnRJbmRleF1cbiAgICAgICAgXTtcbiAgICB9XG4gICAgcmV0dXJuIGFycmF5O1xufTtcbmV4cG9ydCBkZWZhdWx0IHNodWZmbGVBcnJheTtcbiJdLCJzb3VyY2VSb290IjoiIn0=