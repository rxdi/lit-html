import { TemplateResult } from 'lit-element';
interface CustomElementConfig<T> {
    selector: string;
    template?: (self: T) => TemplateResult;
    style?: string;
    useShadow?: boolean;
}
export declare const Component: (config: CustomElementConfig<any>) => (cls: any) => void;
export {};
