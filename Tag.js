"use strict";
exports.__esModule = true;
var Tag = /** @class */ (function () {
    function Tag(name, level) {
        this.name = name;
        this.props = [];
        this.level = level;
    }
    Tag.prototype.addProp = function (prop) {
        this.props.push(prop);
    };
    return Tag;
}());
exports.Tag = Tag;
