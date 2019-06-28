"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lit_rx_1 = require("../lit-rx");
function TemplateObservable() {
    return (target, key) => {
        const Connect = target.constructor.prototype.connectedCallback || function () { };
        target.constructor.prototype.connectedCallback = function () {
            this[key] = lit_rx_1.async(this[key]);
            return Connect.call(this);
        };
    };
}
exports.TemplateObservable = TemplateObservable;
