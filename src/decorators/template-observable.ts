import { async } from '../lit-rx';

export function TemplateObservable() {
    return (target: any, key: string) => {
      const Connect = target.constructor.prototype.connectedCallback || function () {};
      target.constructor.prototype.connectedCallback = function () {
        this[key] = async(this[key]);
        return Connect.call(this);
      };
    };
  }
  