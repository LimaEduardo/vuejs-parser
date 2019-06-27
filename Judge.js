"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var Judge = /** @class */ (function () {
    function Judge(tags, templateStrings, vueObjects) {
        this.MAX_NUMBER_OF_DATA_OBJECTS = 6;
        this.MAX_NUMBER_OF_CONDITIONAL_RENDERING = 5;
        this.tags = tags;
        this.templateStrings = templateStrings;
        this.vueObjects = vueObjects;
    }
    Judge.prototype.evaluateLongData = function () {
        return __awaiter(this, void 0, void 0, function () {
            var dataObject, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.getDataObject()];
                    case 1:
                        dataObject = _a.sent();
                        if (dataObject.attributes.length > this.MAX_NUMBER_OF_DATA_OBJECTS) {
                            console.log("Long Data encontrado!");
                            return [2 /*return*/, Promise.resolve(true)];
                        }
                        else {
                            console.log("Limpo de long data");
                            return [2 /*return*/, Promise.resolve(false)];
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        e_1 = _a.sent();
                        console.log(e_1);
                        return [2 /*return*/, Promise.resolve(false)];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Judge.prototype.evaluateComplexTemplateSyntax = function () {
        return __awaiter(this, void 0, void 0, function () {
            var smellFound, i, templateString, content, tag;
            return __generator(this, function (_a) {
                smellFound = false;
                try {
                    for (i = 0; i < this.templateStrings.length; i++) {
                        templateString = this.templateStrings[i];
                        content = templateString.content, tag = templateString.tag;
                        if (content.includes("??")
                            || content.includes("function")
                            || content.includes(":")
                            || content.includes("=>")) {
                            console.log("Complex Template Syntax encontrado!");
                            smellFound = true;
                        }
                    }
                    if (!smellFound) {
                        console.log("Limpo de Complex Template Syntax");
                        return [2 /*return*/, Promise.resolve(false)];
                    }
                    return [2 /*return*/, Promise.resolve(true)];
                }
                catch (e) {
                    console.log("Um erro foi encontrado na avaliação do complex template syntax");
                    console.log(e);
                    return [2 /*return*/, Promise.resolve(false)];
                }
                return [2 /*return*/];
            });
        });
    };
    Judge.prototype.evaluateManyConditionalRendering = function () {
        return __awaiter(this, void 0, void 0, function () {
            var vifCounter, i, j, prop;
            return __generator(this, function (_a) {
                try {
                    vifCounter = 0;
                    for (i = 0; i < this.tags.length; i++) {
                        for (j = 0; j < this.tags[i].props.length; j++) {
                            prop = this.tags[i].props[j];
                            if (prop.name === "v-if" || prop.name === "v-else-if") {
                                vifCounter++;
                            }
                            if (vifCounter > this.MAX_NUMBER_OF_CONDITIONAL_RENDERING) {
                                console.log("Many Conditional Rendering encontrado!");
                                return [2 /*return*/, Promise.resolve(true)];
                            }
                        }
                    }
                    console.log("Limpo de Many Conditional Rendering");
                    return [2 /*return*/, Promise.resolve(false)];
                }
                catch (e) {
                    console.log("Um erro foi encontrado na avaliação do Many Conditional Rendering");
                    console.log(e);
                    return [2 /*return*/, Promise.resolve(false)];
                }
                return [2 /*return*/];
            });
        });
    };
    Judge.prototype.evaluatePropsWithoutDefinition = function () {
        return __awaiter(this, void 0, void 0, function () {
            var propsObject, smellFound, i, value, e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.getPropsObject()];
                    case 1:
                        propsObject = _a.sent();
                        smellFound = false;
                        for (i = 0; i < propsObject.attributes.length; i++) {
                            console.log("ae");
                            value = propsObject.attributes[i].value;
                            console.log(value);
                            if (!value.includes("String")
                                && !value.includes("Number")
                                && !value.includes("Boolean")
                                && !value.includes("Array")
                                && !value.includes("Object")
                                && !value.includes("Function")
                                && !value.includes("Props")
                                && !value.includes("Boolean")
                                && !smellFound) {
                                console.log("Props Without Definition encontrado!");
                                smellFound = true;
                            }
                            if (value == undefined) {
                                console.log("Props Without Definition encontrado!");
                                smellFound = true;
                            }
                        }
                        if (!smellFound) {
                            console.log("Limpo de Props Without Definition");
                            return [2 /*return*/, Promise.resolve(false)];
                        }
                        return [2 /*return*/, Promise.resolve(true)];
                    case 2:
                        e_2 = _a.sent();
                        console.log(e_2);
                        return [2 /*return*/, Promise.resolve(true)];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Judge.prototype.getDataObject = function () {
        return __awaiter(this, void 0, void 0, function () {
            var i;
            return __generator(this, function (_a) {
                for (i = 0; i < this.vueObjects.length; i++) {
                    if (this.vueObjects[i].name === "data") {
                        return [2 /*return*/, Promise.resolve(this.vueObjects[i])];
                    }
                }
                throw "Data não existe no componente";
            });
        });
    };
    Judge.prototype.getPropsObject = function () {
        return __awaiter(this, void 0, void 0, function () {
            var i;
            return __generator(this, function (_a) {
                for (i = 0; i < this.vueObjects.length; i++) {
                    if (this.vueObjects[i].name === "props") {
                        return [2 /*return*/, Promise.resolve(this.vueObjects[i])];
                    }
                }
                throw "Props não existe no componente";
            });
        });
    };
    return Judge;
}());
exports.Judge = Judge;
