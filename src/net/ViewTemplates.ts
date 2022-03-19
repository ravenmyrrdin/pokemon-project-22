import { IViewTemplate } from './interfaces/IViewTemplate';

/**
 * psuedocode ViewTemplates
 * - The code exports a function called getViews() which returns an array of all the registered views.
 * - The code then exports a function called set() that sets an interface object to the view template stack.
 * - The code is a wrapper around the IViewTemplate interface.
 * - It has a readonly prototype property which returns the view implementation object itself.
 * - The set function takes an instance of the extended type of IViewTemplateModel and pushes it onto the viewImplementations array.
 */
export namespace ViewTemplates {
  export type Wrapper < T > = {
    new(...args: any[]): T;

    readonly prototype: T;
  }

  const viewImplementations: Wrapper < IViewTemplate > [] = [];

  /**
   * Get all registered views using the set attribute 
   * 
   * @returns IViewTemplateModel array
   */
  export function getViews(): Wrapper < IViewTemplate > [] 
  {
    return viewImplementations;
  }

  /**
   * sets an interface object to the views template stack
   * 
   * @param ctor extended type of IViewTemplateModel
   * @returns IViewTemplateModel wrapper
   */
  export function set < T extends Wrapper < IViewTemplate >> (ctor: T) {
    viewImplementations.push(ctor);
    return ctor;
  }
}