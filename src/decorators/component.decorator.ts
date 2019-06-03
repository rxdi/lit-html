import { html, TemplateResult } from 'lit-element';
import { Component as RxdiComponent } from '@rxdi/core';

interface CustomElementConfig<T> {
    selector: string;
    template?: (self: T) => TemplateResult;
    style?: string;
    useShadow?: boolean;
  }
  
  export const Component = (config: CustomElementConfig<any>) => (cls: any) => {
    if (config.selector.indexOf('-') <= 0) {
      throw new Error('You need at least 1 dash in the custom element name!');
  }
    if (!config.template) {
        // throw new Error('You need to pass a template for the element');
    }
  
    const OnInit = cls.prototype.OnInit || function () {};
    const OnDestroy = cls.prototype.OnDestroy || function () {};
    const OnUpdate = cls.prototype.OnUpdate || function () {};
    const OnUpdateFirst = cls.prototype.OnUpdateFirst || function () {};

    // original
    // const render = cls.prototype.render || function () {};
    const connectedCallback = cls.prototype.connectedCallback || function () {};
    const disconnectedCallback = cls.prototype.disconnectedCallback || function () {};
    const update = cls.prototype.update || function () {};
    const firstUpdated = cls.prototype.firstUpdated || function () {};

    cls.prototype.disconnectedCallback = function() {
      disconnectedCallback.call(this);
      OnDestroy.call(this);
    };
    // cls.prototype.render = function() {
    //   render.call(this);
    // }
    cls.prototype.update = function() {
      update.call(this);
      OnUpdate.call(this);
    }
    cls.prototype.firstUpdated = function() {
      firstUpdated.call(this);
      OnUpdateFirst.call(this);
    }
    cls.prototype.connectedCallback = function() {
      // const template = document.createElement('template');
      // this
      // debugger
      // const clone = document.importNode(template.content, true);
      // if (config.useShadow) {
      //     this.attachShadow({mode: 'open'}).appendChild(clone);
      // } else {
      //     this.appendChild(clone);
      // }
        connectedCallback.call(this);
        OnInit.call(this);
    };
  

    RxdiComponent()(cls)
    window.customElements.define(config.selector, cls);
  };
  
  // @CustomElement2({
  //   selector: 'home-component',
  //   style: '',
  //   template: (self) => html``,
  //   useShadow: true
  // })
  // export class Pesho {}