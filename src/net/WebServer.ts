/**
 * Network/Request handeling module 
 * 
 * @module net
 */

import express from "express";
import { Logger } from '../misc/Logger';
import { Globals } from '../misc/Globals';
import path from 'path';
import { IWebRequest } from './interfaces/IWebRequest';

/**
 * ExpressJS server module extension class.
 */
export class WebServer
{
    /** No object construction allowed externaly + hide constructor from typedoc documentation generator */
    private constructor() { }

    /** ExpressJS server application for listening for webrequests */
    private static readonly listener = express();

    /** Listening port for webrequests. */
    public static get serverPort(): Number  { return this.listener.get("port");}
    /** Internal setter for listening port. */
    private static set _serverPort(value: Number) { this.listener.set("port", value);};

    /** Get the current rendering engine for express-js (default: ejs) */
    public static get viewEngine(): string { return this.listener.get("view engine");}

    /**  Set the express-js "Views" engine  */
    public static set viewEngine(value: string) { this.listener.set("view engine", value);};

    /** Get the rootpath to the ejs views directory. */
    public static get ejsViewsRoot(): string { return this.listener.settings.views; }

    /** Get all absolute names of ejs files in ejs views directory. */
    public static get ejsViewNames(): string[] { return (Globals.fs.readdirSync(this.ejsViewsRoot) as string[])
                                                                .filter(i => i.endsWith("ejs"))
                                                                .map(i => i.substring(0, i.length-4));}

    /** Get ejs view interfaces root */
    public static get viewInterfacesRoot(): string { return path.join(Globals.projectRoot, "src", "net", "views"); }
    
    /** Get names of all ejs view interfaces */
    public static get viewInterfaceNames(): string[] { return (Globals.fs.readdirSync(this.viewInterfacesRoot) as string[]).filter(i => i.toLowerCase().endsWith(".ts")).map(i => i.substring(0, i.length-3));}
    
    /** Get all viewnames and there prototype if available  */
    public static async getViewPrototypes() : Promise<Map<string, {[key: string]: IWebRequest} | undefined>> 
    {
        let output: Map<string, {[key: string]: IWebRequest} | undefined> = new Map<string, {[key: string]: IWebRequest} | undefined>();
        for(const ejsN of this.ejsViewNames)
        {
            const interfaceName = this.viewInterfaceNames.filter(i => i.toLowerCase()==ejsN.toLowerCase())[0];
            let _interface: {[key: string]: any} | undefined = undefined;
            if(interfaceName)
            {
                try
                {
                    const modulePrototype = Object.assign({}, await import(path.join(this.viewInterfacesRoot, `${interfaceName}.ts`)));
                    const objectName: string = Object.getOwnPropertyNames(modulePrototype)[0];

                    _interface = Object.assign({}, (modulePrototype as {[key: string]: any})[objectName]);

                } catch(e) {}
            }

            output.set(ejsN, _interface);
        }   

        return output;
    }

    /**
     * Setup listener configuration
     * 
     * @psuedocode setupListener
     * - Then it assigns middle ware for incomming json objects, url encoded objects and an accessor for access to the public files directory.
     * - Then it sets the port to the port argument (default:  8080)
     */
    private static setupListener({assetsFolder = "public", port = 8080} = {}): void
    {

        this.listener.use(express.json({limit: "1mb"}));
        this.listener.use(express.urlencoded({extended: true}));
        this.listener.use(express.static(assetsFolder));

        this._serverPort = port;
    }

    /**
     * Attempts to load all EJS views and there interface if required.
     * - Handles numerical names as response code pages.
     * - Handles alphabetical names as content pages and attempts to load an interface matching the name of the ejs file, non case sensitive.
     * - Uses a stack based implementation to process endpoints as status codes are required to be loaded last. 
     */    
     private static setEndpoints(): Promise<void> 
     {
         return new Promise(async(resolve, reject) => 
         {
             const endpointSetters: Function[] = [];
             for(const pair of await this.getViewPrototypes()) 
             {
                 const ejsName: string = pair[0];
                 const callbackInterface:{[key:string]:IWebRequest} | undefined = pair[1]
 
                 const endpoint: string = `/${ejsName}`.replace("index", "");
                 
                 if(/^[0-9]{3}$/.test(ejsName))
                 {
                     endpointSetters.push(() => this.listener.use((req, res, next) => {
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
                             const renderViewCallback = (req: any, res: any, next : any) => (res as any).render(ejsName, callbackInterface[requestType](req, res, next));
     
                            let setter: Function | undefined;  
                            switch(requestType)
                            {
                                case "get":      setter = () => this.listener.get(endpoint, renderViewCallback); break;
                                case "post":     setter = () => this.listener.post(endpoint, renderViewCallback); break;
                                case "put":      setter = () => this.listener.put(endpoint, renderViewCallback); break;
                                case "patch":    setter = () => this.listener.patch(endpoint,renderViewCallback); break;
                                case "delete":   setter = () => this.listener.delete(endpoint, renderViewCallback); break;
                                case "copy":     setter = () => this.listener.copy(endpoint, renderViewCallback); break;
                                case "head":     setter = () => this.listener.head(endpoint, renderViewCallback); break;
                                case "options":  setter = () => this.listener.options(endpoint, renderViewCallback); break;
                                case "purge":    setter = () => this.listener.purge(endpoint, renderViewCallback); break;
                                case "lock":     setter = () => this.listener.lock(endpoint, renderViewCallback); break;
                                case "unlock":   setter = () => this.listener.unlock(endpoint, renderViewCallback); break;
                                case "propfind": setter = () => this.listener.propfind(endpoint, renderViewCallback); break;
                            }
                             
                             if(setter)
                                 endpointSetters.unshift(setter);
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

    /**
     * Setup listener and start listening for requests.
     * 
     * psuedocode
     * - The code starts by logging "Starting WebServer...".
     * - Then it calls the setupListener() method, which is where the code starts listening for requests on port n.
     * - The ViewService is then called to start up all of its views and listen for requests on port n.
     * - If an error occurs during this process, it will catch that error and log it out in console.
     * - The code starts the server and listens for requests.
     */
    public static start(): void
    {
        Logger.log("Starting WebServer...");
        this.setupListener();

        this.viewEngine = "ejs";
        this.setEndpoints()
            .then(v => {
                try
                {
                    this.listener.listen(this.serverPort, 
                        () => console.log(`[${this.constructor.name}]: listening for requests on port ${this.serverPort}`));
    
                } catch(ex)
                {
                    if(ex instanceof Error)
                        console.log(ex.message);
                }
            })
            .catch(e => console.log(`Failed to load endpoints...\n${e}`));
    }

}