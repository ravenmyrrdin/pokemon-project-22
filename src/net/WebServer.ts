/**
 * Network/Request handeling module 
 * 
 * @module src.net
 */

import express from "express";
import { Logger } from '../misc/Logger';
import { Globals } from '../misc/Globals';
import path from 'path';
import { IWebRequest } from './interfaces/IWebRequest';
import { EndpointManager } from "./EndpointManager";


/**
 * ExpressJS server module extension class. (sealed)
 */
export class WebServer
{
    private static _singleton: WebServer;
    public static get singleton(): WebServer 
    {
        if(this._singleton == undefined)
            this._singleton = new WebServer();
            
        return this._singleton;
    }

    /** ExpressJS server application for listening for webrequests */
    private readonly listener: any = express();

    /** Listening port for webrequests. */
    public get serverPort(): string | Number  { return this.listener.get("port");}

    /** Internal setter for listening port. */
    private set _serverPort(value: string | Number) { this.listener.set("port", value);};

    /** Get the current rendering engine for express-js (default: ejs) */
    public get viewEngine(): string { return this.listener.get("view engine");}

    /**  Set the express-js "Views" engine  */
    public set viewEngine(value: string) { this.listener.set("view engine", value);};

    /** Get the rootpath to the ejs views directory. */
    public get ejsViewsRoot(): string { return this.listener.settings.views; }

    /** Get all absolute names of ejs files in ejs views directory. */
    public get ejsViewNames(): string[] { return (Globals.fs.readdirSync(this.ejsViewsRoot) as string[])
                                                                .filter(i => i.endsWith("ejs"))
                                                                .map(i => i.substring(0, i.length-4));}

    /** Get ejs view interfaces root */
    public get viewInterfacesRoot(): string { return path.join(Globals.projectRoot, "src", "net", "views"); }
    
    /** Get names of all ejs view interfaces */
    public get viewInterfaceNames(): string[] { return (Globals.fs.readdirSync(this.viewInterfacesRoot) as string[]).filter(i => i.toLowerCase().endsWith(".ts")).map(i => i.substring(0, i.length-3));}
    
    /** Endpoint management object  */
    private endpoint: EndpointManager | undefined;
    
    /**
     * public constructor for modified server objects (port, assetfolder etc...)
     */
    public constructor({assetsFolder = "public", port = 8080} = {})
    {
        this.endpoint = new EndpointManager(this.listener);
        
        this.listener.use(express.json({limit: "1mb"}));
        this.listener.use(express.urlencoded({extended: true}));
        this.listener.use(express.static(assetsFolder));
        
        this._serverPort = process.env.PORT || port;
        this.viewEngine = "ejs";
    }
    /** 
     * Get all viewnames, attempt 
     */
    public async getViewPrototypes() : Promise<Map<string, {[key: string]: IWebRequest} | undefined>> 
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
     * Setup listener and start listening for requests.
     * 
     * psuedocode
     * - The code starts by logging "Starting WebServer...".
     * - Then it calls the setupListener() method, which is where the code starts listening for requests on port n.
     * - The ViewService is then called to start up all of its views and listen for requests on port n.
     * - If an error occurs during this process, it will catch that error and log it out in console.
     * - The code starts the server and listens for requests.
     */
    public async start(): Promise<void>
    {
        Logger.log("Starting WebServer...");
        if(this.endpoint)
        {
            const viewPrototypes = await this.getViewPrototypes();
            await this.endpoint.setEndpoints(viewPrototypes);

            this.listener.listen(this.serverPort, 
                () => console.log(`[${this.constructor.name}]: listening for requests on port ${this.serverPort}`));
        }
    }

}