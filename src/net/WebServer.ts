import { ViewService } from './ViewService';
import express from "express";
import { Logger } from '../misc/Logger';
import { IWebRequest } from './interfaces/IWebRequest';

/**
 * @class WebServer
 * @author Oste Jannick.
 * @created 2022/03/15
 */
export class WebServer
{
    private constructor() { }
    /** ExpressJS server application for listening for webrequests */
    private static readonly listener = express();

    /** Listening port for webrequests. */
    public static get serverPort(): Number  { return this.listener.get("port");}
    /** Get the current rendering engine for express-js (default: ejs) */
    public static get viewEngine(): string { return this.listener.get("view engine");}
    /**  Set the express-js "Views" engine  */
    public static set viewEngine(value: string) { this.listener.set("view engine", value);};

    /**
     * Get public accessible server data assigned on the listener object
     * @deprecated
     */
    public static get serverInfo(): object  { return this.listener.locals.info; }

    /**
     * Setup listener configuration
     * 
     * @psuedocode setupListener
     * - The code starts by setting the serverInfo object
     * - Then it assigns middle ware for incomming json objects, url encoded objects and an accessor for access to the public files directory.
     * - Then it sets the port to the port argument (default:  8080)
     */
    private static setupListener({assetsFolder = "public", port = 8080} = {}): void
    {
        this.listener.locals.info = {
            author: "Oste Jannick"
        } 

        this.listener.use(express.json({limit: "1mb"}));
        this.listener.use(express.urlencoded({extended: true}));
        this.listener.use(express.static(assetsFolder));

        this.listener.set("port", port);
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
        try
        {
            ViewService.setupViews().then(r =>
                {
                    this.listener.listen(this.serverPort, 
                        () => console.log(`[${this.constructor.name}]: listening for requests on port ${this.serverPort}`));

                });
        } catch(ex)
        {
            if(ex instanceof Error)
                console.log(ex.message);
        }

    }

    /**
     * Register a POST callback for a specific endpoint to the listener
     * 
     * @param endpoint absolute path on the server
     * @param callback request event occured callback
     */
    public static registerPostEndpoint(endpoint: string, callback: IWebRequest): void 
    {
        Logger.log(`Attempting to assign POST callback to: ${endpoint}`);

        this.listener.post(endpoint, callback as any);
    }

    /**
     * Register a GET callback for a specific endpoint to the listener
     * 
     * @param endpoint absolute server path
     * @param callback request event occured callback
     */
    public static registerGetEndpoint(endpoint: string, callback: IWebRequest): void 
    {
        Logger.log(`Attempting to assign GET callback to: ${endpoint}`);

        this.listener.get(endpoint, callback as any);
    }

    /**
     * SetMiddleware always running for all future assigned endpoint callbacks.
     * 
     * @param callback middleware callback
     */
    public static registerMiddleware(callback: Function): void 
    {
        this.listener.use(callback as any);
    }
}