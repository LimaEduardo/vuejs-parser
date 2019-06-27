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
var fs = require("fs");
var Tag_1 = require("./Tag");
var Prop_1 = require("./Prop");
var TagDelimiterEnum_1 = require("./TagDelimiterEnum");
var TemplateString_1 = require("./TemplateString");
var VueObject_1 = require("./VueObject");
var Attribute_1 = require("./Attribute");
var Parser = /** @class */ (function () {
    function Parser(fileName) {
        this.fileName = fileName;
        this.fileContent = fs.readFileSync(this.fileName, 'utf-8');
        this.tags = [];
        this.templateStrings = [];
        this.vueObjects = [];
        this.currentLevel = 0;
        this.indexAtHTMLEnd = 0;
    }
    Parser.prototype.runHTML = function () {
        return __awaiter(this, void 0, void 0, function () {
            var fileContent, tagBuffer, templateStringBuffer, allowAddInBuffer, allowAddInTemplateStringBuffer, possibleTemplateString, i, currentChar;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        fileContent = this.fileContent;
                        tagBuffer = [];
                        templateStringBuffer = [];
                        allowAddInBuffer = false;
                        allowAddInTemplateStringBuffer = false;
                        possibleTemplateString = false;
                        i = 0;
                        _a.label = 1;
                    case 1:
                        if (!(i < fileContent.length)) return [3 /*break*/, 7];
                        currentChar = fileContent[i];
                        if (currentChar === TagDelimiterEnum_1.TagDelimiterEnum.TAG_START) {
                            allowAddInBuffer = true;
                            return [3 /*break*/, 6];
                        }
                        if (!(currentChar === TagDelimiterEnum_1.TagDelimiterEnum.TAG_END)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.bufferHandler(tagBuffer)];
                    case 2:
                        _a.sent();
                        allowAddInBuffer = false;
                        tagBuffer = [];
                        _a.label = 3;
                    case 3:
                        if (currentChar === TagDelimiterEnum_1.TagDelimiterEnum.OPEN_BRACES) {
                            if (possibleTemplateString && !allowAddInTemplateStringBuffer) {
                                allowAddInTemplateStringBuffer = true;
                                return [3 /*break*/, 6];
                            }
                            else {
                                possibleTemplateString = true;
                                return [3 /*break*/, 6];
                            }
                        }
                        if (!(currentChar === TagDelimiterEnum_1.TagDelimiterEnum.END_BRACES && allowAddInTemplateStringBuffer)) return [3 /*break*/, 5];
                        if (!(fileContent[i + 1] === TagDelimiterEnum_1.TagDelimiterEnum.END_BRACES)) return [3 /*break*/, 5];
                        allowAddInTemplateStringBuffer = false;
                        possibleTemplateString = false;
                        return [4 /*yield*/, this.templateStringHandler(templateStringBuffer)];
                    case 4:
                        _a.sent();
                        templateStringBuffer = [];
                        _a.label = 5;
                    case 5:
                        if (allowAddInBuffer) {
                            tagBuffer.push(currentChar);
                        }
                        if (allowAddInTemplateStringBuffer) {
                            templateStringBuffer.push(currentChar);
                        }
                        possibleTemplateString = false;
                        if (this.tags.length > 0 && this.currentLevel === 0) {
                            this.indexAtHTMLEnd = i + 1;
                            return [2 /*return*/, Promise.resolve()];
                        }
                        _a.label = 6;
                    case 6:
                        i++;
                        return [3 /*break*/, 1];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    Parser.prototype.runScript = function () {
        return __awaiter(this, void 0, void 0, function () {
            var currentIndex, hasAScriptTag, allowAddInBuffer, buffer, ignoreBuffer, i, currentChar;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        currentIndex = this.indexAtHTMLEnd;
                        hasAScriptTag = false;
                        allowAddInBuffer = false;
                        buffer = [];
                        ignoreBuffer = false;
                        for (i = currentIndex; i < this.fileContent.length; i++) {
                            if (ignoreBuffer)
                                continue;
                            currentChar = this.fileContent[i];
                            if (hasAScriptTag) {
                                buffer.push(currentChar);
                            }
                            if (currentChar === TagDelimiterEnum_1.TagDelimiterEnum.TAG_START) {
                                allowAddInBuffer = true;
                                if (hasAScriptTag) {
                                    ignoreBuffer = true;
                                }
                                continue;
                            }
                            if (currentChar === TagDelimiterEnum_1.TagDelimiterEnum.TAG_END) {
                                allowAddInBuffer = false;
                                if (buffer.join('') === TagDelimiterEnum_1.TagDelimiterEnum.SCRIPT_STRING) {
                                    hasAScriptTag = true;
                                    buffer = [];
                                }
                            }
                            if (allowAddInBuffer) {
                                buffer.push(currentChar);
                            }
                        }
                        buffer.pop();
                        return [4 /*yield*/, this.removeUselessCharsFromBuffer(buffer)];
                    case 1:
                        buffer = _a.sent();
                        return [4 /*yield*/, this.handleScriptBuffer(buffer)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, Promise.resolve()];
                }
            });
        });
    };
    Parser.prototype.handleScriptBuffer = function (buffer) {
        return __awaiter(this, void 0, void 0, function () {
            var string, dataObject, propsObject;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        string = buffer.join('');
                        return [4 /*yield*/, this.findAndRetrieve(string, 'data')];
                    case 1:
                        dataObject = _a.sent();
                        this.vueObjects.push(dataObject);
                        return [4 /*yield*/, this.findAndRetrieve(string, 'props')];
                    case 2:
                        propsObject = _a.sent();
                        this.vueObjects.push(propsObject);
                        return [2 /*return*/, Promise.resolve()];
                }
            });
        });
    };
    Parser.prototype.findAndRetrieve = function (scriptString, term) {
        return __awaiter(this, void 0, void 0, function () {
            var index, buffer, level, name, searchBuffer, isVerifyingName, vueObject, i, currentChar, attrName, attrValue, attr;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        index = scriptString.indexOf(term);
                        buffer = scriptString.split("");
                        level = 0;
                        name = '';
                        searchBuffer = [];
                        isVerifyingName = true;
                        vueObject = new VueObject_1.VueObject();
                        i = index;
                        _a.label = 1;
                    case 1:
                        if (!(i < buffer.length)) return [3 /*break*/, 6];
                        currentChar = buffer[i];
                        if (!(currentChar == TagDelimiterEnum_1.TagDelimiterEnum.COLON)) return [3 /*break*/, 4];
                        if (isVerifyingName) {
                            name = searchBuffer.join('');
                            searchBuffer = [];
                            isVerifyingName = false;
                            vueObject.assignName(name);
                            return [3 /*break*/, 5];
                        }
                        return [4 /*yield*/, this.getAttrName(buffer, i)];
                    case 2:
                        attrName = _a.sent();
                        return [4 /*yield*/, this.getAttrValue(buffer, i)];
                    case 3:
                        attrValue = _a.sent();
                        attr = new Attribute_1.Attribute(attrName, attrValue);
                        vueObject.addAttr(attr);
                        _a.label = 4;
                    case 4:
                        if (isVerifyingName) {
                            searchBuffer.push(currentChar);
                        }
                        if (currentChar === TagDelimiterEnum_1.TagDelimiterEnum.OPEN_BRACES) {
                            level++;
                        }
                        if (currentChar === TagDelimiterEnum_1.TagDelimiterEnum.END_BRACES) {
                            level--;
                        }
                        if (currentChar === TagDelimiterEnum_1.TagDelimiterEnum.END_BRACES && level === 0) {
                            return [2 /*return*/, Promise.resolve(vueObject)];
                        }
                        _a.label = 5;
                    case 5:
                        i++;
                        return [3 /*break*/, 1];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    Parser.prototype.getAttrName = function (buffer, index) {
        return __awaiter(this, void 0, void 0, function () {
            var attrName, i, currentChar, attrNameString;
            return __generator(this, function (_a) {
                attrName = [];
                for (i = index - 1; i > 0; i--) {
                    currentChar = buffer[i];
                    if (currentChar === TagDelimiterEnum_1.TagDelimiterEnum.COMMA || currentChar == TagDelimiterEnum_1.TagDelimiterEnum.OPEN_BRACES) {
                        attrNameString = attrName.reverse().join("").trim();
                        return [2 /*return*/, Promise.resolve(attrNameString)];
                    }
                    attrName.push(currentChar);
                }
                return [2 /*return*/];
            });
        });
    };
    Parser.prototype.getAttrValue = function (buffer, index) {
        return __awaiter(this, void 0, void 0, function () {
            var attrValue, shouldIgnoreDelimeters, level, i, currentChar, attrValueString;
            return __generator(this, function (_a) {
                attrValue = [];
                shouldIgnoreDelimeters = false;
                level = 0;
                for (i = index + 1; i < buffer.length; i++) {
                    currentChar = buffer[i];
                    if (currentChar === TagDelimiterEnum_1.TagDelimiterEnum.OPEN_BRACES || currentChar === TagDelimiterEnum_1.TagDelimiterEnum.OPEN_BRACKET) {
                        shouldIgnoreDelimeters = true;
                        level++;
                    }
                    if (currentChar === TagDelimiterEnum_1.TagDelimiterEnum.CLOSE_BRACKET || currentChar === TagDelimiterEnum_1.TagDelimiterEnum.CLOSE_BRACKET) {
                        level--;
                        if (level === 0) {
                            shouldIgnoreDelimeters = false;
                        }
                    }
                    if ((currentChar === TagDelimiterEnum_1.TagDelimiterEnum.COMMA || currentChar == TagDelimiterEnum_1.TagDelimiterEnum.END_BRACES) && !shouldIgnoreDelimeters) {
                        attrValueString = attrValue.join("").trim();
                        return [2 /*return*/, Promise.resolve(attrValueString)];
                    }
                    attrValue.push(currentChar);
                }
                return [2 /*return*/];
            });
        });
    };
    Parser.prototype.removeUselessCharsFromBuffer = function (buffer) {
        return __awaiter(this, void 0, void 0, function () {
            var newBuffer, i, currentChar;
            return __generator(this, function (_a) {
                newBuffer = [];
                for (i = 0; i < buffer.length; i++) {
                    currentChar = buffer[i];
                    if (this.isWhiteSpace(currentChar)) {
                        continue;
                    }
                    newBuffer.push(currentChar);
                }
                return [2 /*return*/, Promise.resolve(newBuffer)];
            });
        });
    };
    Parser.prototype.templateStringHandler = function (buffer) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        var templateStrinContent = buffer.join('').trim();
                        var templateStringTag = _this.tags[_this.tags.length - 1].name;
                        var templateStringlevel = _this.tags[_this.tags.length - 1].level;
                        var templateStringObj;
                        templateStringObj = new TemplateString_1.TemplateString(templateStrinContent, templateStringTag, templateStringlevel);
                        _this.templateStrings.push(templateStringObj);
                        resolve();
                    })];
            });
        });
    };
    Parser.prototype.bufferHandler = function (buffer) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var index, tagName, isClosingTag, tag, propName, propValue, prop, error_1;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    index = 0;
                                    tagName = '';
                                    for (; index < buffer.length; index++) {
                                        if (this.isWhiteSpace(buffer[index])) {
                                            break;
                                        }
                                        tagName += buffer[index];
                                    }
                                    return [4 /*yield*/, this.isClosingTag(tagName)];
                                case 1:
                                    isClosingTag = _a.sent();
                                    if (isClosingTag) {
                                        this.currentLevel--;
                                        return [2 /*return*/, resolve()];
                                    }
                                    tag = new Tag_1.Tag(tagName, this.currentLevel);
                                    _a.label = 2;
                                case 2:
                                    if (!(index < buffer.length)) return [3 /*break*/, 9];
                                    if (!(buffer[index] === TagDelimiterEnum_1.TagDelimiterEnum.ASSIGN_OPERATOR)) return [3 /*break*/, 7];
                                    _a.label = 3;
                                case 3:
                                    _a.trys.push([3, 6, , 7]);
                                    return [4 /*yield*/, this.getPropName(buffer, index - 1)];
                                case 4:
                                    propName = _a.sent();
                                    return [4 /*yield*/, this.getPropValue(buffer, index + 1)];
                                case 5:
                                    propValue = _a.sent();
                                    prop = new Prop_1.Prop(propName, propValue);
                                    tag.addProp(prop);
                                    index += propValue.length;
                                    return [3 /*break*/, 7];
                                case 6:
                                    error_1 = _a.sent();
                                    console.log("Tag Error");
                                    console.log(error_1);
                                    return [3 /*break*/, 7];
                                case 7:
                                    if (buffer[index] === TagDelimiterEnum_1.TagDelimiterEnum.TAG_CLOSE) {
                                        this.tags.push(tag);
                                        return [2 /*return*/, resolve()];
                                    }
                                    _a.label = 8;
                                case 8:
                                    index++;
                                    return [3 /*break*/, 2];
                                case 9:
                                    this.currentLevel++;
                                    this.tags.push(tag);
                                    return [2 /*return*/, resolve()];
                            }
                        });
                    }); })];
            });
        });
    };
    Parser.prototype.isWhiteSpace = function (character) {
        return /\s/.test(character);
    };
    Parser.prototype.getPropName = function (buffer, index) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        var propName = '';
                        for (; index > 0; index--) {
                            if (_this.isWhiteSpace(buffer[index])) {
                                return resolve(propName.split("").reverse().join(""));
                            }
                            propName += buffer[index];
                        }
                        return reject("");
                    })];
            });
        });
    };
    Parser.prototype.getPropValue = function (buffer, index) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        var propValue = '';
                        var closingChar = buffer[index];
                        index++;
                        for (; index < buffer.length; index++) {
                            if (buffer[index] === closingChar) {
                                return resolve(propValue);
                            }
                            propValue += buffer[index];
                        }
                        return resolve(propValue);
                    })];
            });
        });
    };
    Parser.prototype.isClosingTag = function (tagName) {
        return new Promise(function (resolve, reject) {
            var length = tagName.length;
            var tagNameArray = tagName.split("");
            for (var i = 0; i < length; i++) {
                if (tagNameArray[i] === TagDelimiterEnum_1.TagDelimiterEnum.TAG_CLOSE) {
                    return resolve(true);
                }
            }
            return resolve(false);
        });
    };
    Parser.prototype.getTags = function () {
        return this.tags;
    };
    Parser.prototype.getTemplateSyntax = function () {
        return this.templateStrings;
    };
    Parser.prototype.getVueObjects = function () {
        return this.vueObjects;
    };
    Parser.prototype.debug = function () {
        // console.log(this.fileName)
        // console.log(this.fileContent)
        this.tags.forEach(function (tag) {
            console.log(tag);
        });
        this.templateStrings.forEach(function (template) {
            console.log(template);
        });
    };
    return Parser;
}());
exports.Parser = Parser;
