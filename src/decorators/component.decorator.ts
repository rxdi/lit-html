import { html, TemplateResult, CSSResult } from 'lit-element';
import { Component as RxdiComponent } from '@rxdi/core';

interface CustomElementConfig<T> {
  selector?: string;
  template?: (self: T) => TemplateResult;
  style?: CSSResult | string;
  useShadow?: boolean;
  extends?: HTMLElementTagNameMap;
}

// From the TC39 Decorators proposal
interface ClassDescriptor {
  kind: 'class';
  elements: ClassElement[];
  finisher?: <T>(clazz: Constructor<T>) => undefined | Constructor<T>;
}

// From the TC39 Decorators proposal
interface ClassElement {
  kind: 'field' | 'method';
  key: PropertyKey;
  placement: 'static' | 'prototype' | 'own';
  initializer?: Function;
  extras?: ClassElement[];
  finisher?: <T>(clazz: Constructor<T>) => undefined | Constructor<T>;
  descriptor?: PropertyDescriptor;
}
export type Constructor<T> = new (...args: unknown[]) => T;

const legacyCustomElement = (
  tagName: string,
  clazz: Constructor<HTMLElement>
) => {
  window.customElements.define(tagName, clazz);
  return clazz;
};

const standardCustomElement = (
  tagName: string,
  descriptor: ClassDescriptor
) => {
  const { kind, elements } = descriptor;
  return {
    kind,
    elements,
    // This callback is called once the class is otherwise fully defined
    finisher(clazz: Constructor<HTMLElement>) {
      window.customElements.define(tagName, clazz);
    }
  };
};

export const customElement = <T>(tag: string, config: CustomElementConfig<T> = {} as any) => (
  classOrDescriptor: Constructor<HTMLElement> | ClassDescriptor
) => {
  if (tag.indexOf('-') <= 0) {
    throw new Error('You need at least 1 dash in the custom element namee!');
  }

  const cls = classOrDescriptor as any;
  const OnInit = cls.prototype.OnInit || function() {};
  const OnDestroy = cls.prototype.OnDestroy || function() {};
  const OnUpdate = cls.prototype.OnUpdate || function() {};
  const OnUpdateFirst = cls.prototype.OnUpdateFirst || function() {};
  const connectedCallback = cls.prototype.connectedCallback || function() {};
  const disconnectedCallback =
    cls.prototype.disconnectedCallback || function() {};
  const update = cls.prototype.update || function() {};
  const firstUpdated = cls.prototype.firstUpdated || function() {};
  if (!config.template) {
    config.template = cls.prototype.render;
  }
  if (config.style) {
    cls.styles = config.style;
  }
  cls.prototype.render = config.template;
  const render = cls.prototype.render || function () {};

  cls.prototype.disconnectedCallback = function() {
    OnDestroy.call(this);
    disconnectedCallback.call(this);
  };
  cls.prototype.render = function() {
    return render.call(this);
  }
  cls.prototype.update = function() {
    update.call(this);
    OnUpdate.call(this);
  };
  cls.prototype.firstUpdated = function() {
    firstUpdated.call(this);
    OnUpdateFirst.call(this);
  };
  cls.prototype.connectedCallback = function() {
    config.template = config.template.bind(this);
    const clone = document.importNode(config.template(this).getTemplateElement().content, true);
    if (config.useShadow) {
        this.attachShadow({mode: 'open'}).append(clone);
    } else {
        this.appendChild(clone);
    }
    connectedCallback.call(this);
    OnInit.call(this);
  };

  RxdiComponent()(cls);
  // window.customElements.define(config.selector, cls);
  if (typeof cls === 'function') {
    legacyCustomElement(tag, cls)
  } else {
    standardCustomElement(tag, cls);
  }
};

// @CustomElement2({
//   selector: 'home-component',
//   style: '',
//   template: (self) => html``,
//   useShadow: true
// })
// export class Pesho {}
