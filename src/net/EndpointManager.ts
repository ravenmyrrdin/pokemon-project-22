import { Logger } from "../misc/Logger";
import { IWebRequest } from "./interfaces/IWebRequest";

export class EndpointManager
{
    private listener: any;

    constructor(listener: any)
    {
        this.listener = listener;
    }

        /**
     * Attempts to load all EJS views and there interface if required.
     * - Handles numerical names as response code pages.
     * - Handles alphabetical names as content pages and attempts to load an interface matching the name of the ejs file, non case sensitive.
     * - Uses a stack based implementation to process endpoints as status codes are required to be loaded last. 
     */    
    public setEndpoints(endpointInterfaces: Map<string, {[key: string]: IWebRequest} | undefined>): Promise<void> 
    {
        return new Promise((resolve, reject) => 
        {
            const endpointSetters: Function[] = [];
            for(const [ejsName, callbackInterface] of endpointInterfaces) 
            {
                const endpoint: string = `/${ejsName}`.replace("index", "");
                
                if(/^[0-9]{3}$/.test(ejsName))
                {
                    endpointSetters.push(() => this.listener.use((req: any, res: any, next: any) => {
                        res.status(Number.parseInt(ejsName));
                        return res.render(ejsName, {});
                    }));
                }
                else if (/^[a-zA-Z]+$/.test(ejsName)) {
                    if(callbackInterface) 
                    {
                        for(const requestType in callbackInterface)
                        {
                            if(callbackInterface[requestType] === undefined ) continue;
                            const defaultResponseCallback: IWebRequest = (req: any, res: any, next : any) =>  (res as any).render(ejsName, callbackInterface[requestType](req, res, next));
                            const setCallback: Function | undefined = this.getRequestSetter(requestType, endpoint, defaultResponseCallback);
                            if(setCallback !== undefined)
                               endpointSetters.unshift(setCallback);
                        }
                    } 
                    else 
                    {
                        endpointSetters.unshift(() => this.listener.get(endpoint, (req: any, res: any, next: any) => {
                            return res.render(ejsName,  {});
                        }));
                    }
                }
            }

            try
            {
                Logger.log(`Found ${endpointSetters.length} request setters, attempting to assign requests to endpoints...`);
                endpointSetters.filter(i => i !== undefined).forEach(callback => callback());
                resolve();
            }
            catch(ex)
            {
                reject(ex);
            }
        });
    }

    public getRequestSetter(requestType: string, endpoint: string, responseCallback: IWebRequest) 
    {
       let setter: Function | undefined;  
       switch(requestType)
       {
           case "get":      setter = () => this.listener.get(endpoint, responseCallback); break;
           case "post":     setter = () => this.listener.post(endpoint, responseCallback); break;
           case "put":      setter = () => this.listener.put(endpoint, responseCallback); break;
           case "patch":    setter = () => this.listener.patch(endpoint,responseCallback); break;
           case "delete":   setter = () => this.listener.delete(endpoint, responseCallback); break;
           case "copy":     setter = () => this.listener.copy(endpoint, responseCallback); break;
           case "head":     setter = () => this.listener.head(endpoint, responseCallback); break;
           case "options":  setter = () => this.listener.options(endpoint, responseCallback); break;
           case "purge":    setter = () => this.listener.purge(endpoint, responseCallback); break;
           case "lock":     setter = () => this.listener.lock(endpoint, responseCallback); break;
           case "unlock":   setter = () => this.listener.unlock(endpoint, responseCallback); break;
           case "propfind": setter = () => this.listener.propfind(endpoint, responseCallback); break;
       }

       return setter;
    }
}