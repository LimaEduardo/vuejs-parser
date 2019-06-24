"use strict";
exports.__esModule = true;
var VueObject = /** @class */ (function () {
    function VueObject() {
        this.name = '',
            this.attributes = [];
    }
    VueObject.prototype.addAttr = function (attr) {
        this.attributes.push(attr);
    };
    VueObject.prototype.assignName = function (name) {
        this.name = name;
    };
    return VueObject;
}());
exports.VueObject = VueObject;
