import { IWebRequest } from './IWebRequest';
/**
 * IViewTemplate interface object, namespace and implemntations.
 * 
 * Implementation have to be implemented in IViewTemplate.ts otherwise they will not be recognized by the namespace.
 * @!TODO: look for universal solution
 */

//#region View interface and namespace.
/**
 * View data interface
 */
 export abstract class IViewTemplate {

    /**
     * Post method callback
     */
    public abstract post: IWebRequest | undefined;
  
    /**
     * Get method callback
     * @param request 
     */
    public abstract get: Function | undefined;
} 
  