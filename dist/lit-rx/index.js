"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lit_html_1 = require("../lit-html/lit-html");
// For each part, remember the value that was last rendered to the part by the
// subscribe directive, and the subscribable that was last set as a value.
// The subscribable is used as a unique key to check if the last value
// rendered to the part was with subscribe. If not, we'll always re-render the
// value passed to subscribe.
const previousValues = new WeakMap();
/**
 * A directive that renders the items of a subscribable, replacing
 * previous values with new values, so that only one value is ever rendered
 * at a time.
 *
 * @param value A subscribable
 */
exports.subscribe = lit_html_1.directive((subscribableOrPromiseLike) => (part) => {
    // If subscribableOrPromiseLike is neither a subscribable or
    // a promise like, throw an error
    if (!('then' in subscribableOrPromiseLike) &&
        !('subscribe' in subscribableOrPromiseLike)) {
        throw new Error('subscribableOrPromiseLike must be a subscribable or a promise like');
    }
    // If we have already set up this subscribable in this part, we
    // don't need to do anything
    const previousValue = previousValues.get(part);
    if (previousValue !== undefined &&
        subscribableOrPromiseLike === previousValue.subscribableOrPromiseLike) {
        return;
    }
    const cb = (value) => {
        // If we have the same value and the same subscribable in the same part,
        // we don't need to do anything
        if (previousValue !== undefined &&
            part.value === previousValue.value &&
            subscribableOrPromiseLike === previousValue.subscribableOrPromiseLike) {
            return;
        }
        part.setValue(value);
        part.commit();
        previousValues.set(part, { value, subscribableOrPromiseLike });
    };
    if ('then' in subscribableOrPromiseLike) {
        subscribableOrPromiseLike.then(cb);
        return;
    }
    subscribableOrPromiseLike.subscribe(cb);
});
exports.async = exports.subscribe;
