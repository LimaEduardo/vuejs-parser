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
var Parser_1 = require("./Parser");
var Judge_1 = require("./Judge");
var fs = require("fs");
var App = /** @class */ (function () {
    function App() {
        this.results = [];
        this.testFolder = './';
    }
    App.prototype.runParser = function (filename) {
        return __awaiter(this, void 0, void 0, function () {
            var filePath, p, tag, templateStrings, getVueObjects, j, evaluateLongData, evaluateComplexTemplateSyntax, evaluateConditionalRendering, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        filePath = this.testFolder + filename;
                        p = new Parser_1.Parser(filePath);
                        return [4 /*yield*/, p.runHTML()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, p.runScript()];
                    case 2:
                        _a.sent();
                        tag = p.getTags();
                        templateStrings = p.getTemplateSyntax();
                        console.log(templateStrings);
                        getVueObjects = p.getVueObjects();
                        j = new Judge_1.Judge(tag, templateStrings, getVueObjects);
                        return [4 /*yield*/, j.evaluateLongData()];
                    case 3:
                        evaluateLongData = _a.sent();
                        return [4 /*yield*/, j.evaluateComplexTemplateSyntax()];
                    case 4:
                        evaluateComplexTemplateSyntax = _a.sent();
                        return [4 /*yield*/, j.evaluateManyConditionalRendering()
                            // var evaluatePropsWithoutDefinition =  await j.evaluatePropsWithoutDefinition()
                        ];
                    case 5:
                        evaluateConditionalRendering = _a.sent();
                        result = {
                            fileName: filename,
                            evaluateLongData: evaluateLongData,
                            evaluateComplexTemplateSyntax: evaluateComplexTemplateSyntax,
                            evaluateConditionalRendering: evaluateConditionalRendering
                        };
                        this.results.push(result);
                        // console.log(result)
                        return [2 /*return*/, Promise.resolve()];
                }
            });
        });
    };
    App.prototype.writeResults = function () {
        return __awaiter(this, void 0, void 0, function () {
            var jsonobj;
            return __generator(this, function (_a) {
                jsonobj = JSON.stringify(this.results);
                fs.writeFile("./results.json", jsonobj, function (err) {
                    if (err) {
                        return console.log(err);
                    }
                    console.log("The file was saved!");
                });
                return [2 /*return*/, Promise.resolve()];
            });
        });
    };
    App.prototype.runTests = function () {
        return __awaiter(this, void 0, void 0, function () {
            var folderFiles, i;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        folderFiles = fs.readdirSync(this.testFolder);
                        i = 0;
                        _a.label = 1;
                    case 1:
                        if (!(i < folderFiles.length)) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.runParser(folderFiles[i])];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        i++;
                        return [3 /*break*/, 1];
                    case 4:
                        console.log("vai escrever");
                        return [4 /*yield*/, this.writeResults()];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, this.evaluateResults()];
                    case 6:
                        _a.sent();
                        return [2 /*return*/, Promise.resolve()];
                }
            });
        });
    };
    App.prototype.evaluateResults = function () {
        return __awaiter(this, void 0, void 0, function () {
            var counter, i, jsonobj;
            return __generator(this, function (_a) {
                counter = {
                    evaluateLongData: 0,
                    evaluateComplexTemplateSyntax: 0,
                    evaluateConditionalRendering: 0,
                    evaluatePropsWithoutDefinition: 0
                };
                for (i = 0; i < this.results.length; i++) {
                    if (this.results[i]['evaluateLongData'] === true) {
                        counter.evaluateLongData++;
                    }
                    if (this.results[i]['evaluateComplexTemplateSyntax'] === true) {
                        counter.evaluateComplexTemplateSyntax++;
                    }
                    if (this.results[i]['evaluateConditionalRendering'] === true) {
                        counter.evaluateConditionalRendering++;
                    }
                }
                jsonobj = JSON.stringify(counter);
                fs.writeFile("./numbers.json", jsonobj, function (err) {
                    if (err) {
                        return console.log(err);
                    }
                    console.log("The file was saved!");
                });
                return [2 /*return*/, Promise.resolve()];
            });
        });
    };
    return App;
}());
var app = new App();
app.runParser("Home.vue");
// app.runTests()
