import { CSSResult } from '../lit-element/lib/css-tag';
import { CSSResultArray } from '../lit-element/lit-element';
import { Subscription } from 'rxjs';
import { TemplateResult } from '../lit-html/lit-html';
import { OnInit, OnUpdate, OnUpdateFirst, OnBefore } from './hooks';

export class RXDIElement extends HTMLElement
  implements OnInit, OnUpdate, OnUpdateFirst, OnBefore {
  public static setElement?<T>(component: T, document: RXDIElement): T;
  public static is?(document: RXDIElement): RXDIElement;
  public static styles?: CSSResult | CSSResultArray;
  public static subscriptions?: Map<Subscription, Subscription>;
  public getTemplateResult?(): TemplateResult;

  OnBefore() {}
  OnInit() {}
  OnUpdate() {}
  OnUpdateFirst() {}
}
