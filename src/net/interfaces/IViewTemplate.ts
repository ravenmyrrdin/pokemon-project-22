/**
 * @module src.net.interfaces
 */
import { IWebRequest } from './IWebRequest';


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
  