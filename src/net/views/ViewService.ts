import path from "path";
import { ViewTemplates } from "./ViewTemplates";
import { Globals } from '../../misc/Globals';
import { WebServer } from "../WebServer";
import { Logger } from '../../misc/Logger';

/**
 * Service responsible for loading view data and registering endpoints.
 * 
 * @author Oste Jannick
 * @created 2022/03/16
 */
export abstract class ViewService {
    protected static readonly ejs: any = require("ejs");

    /**
     * @description bind all ejs views based on name to listener foreach content and statuscode.
     * @param listener websocket
     * 
     * @psuedocode bindViewEngine
     * - Set view engine to ejs 
     * - Fetch all views from views folder and iterate over each name to 
     *      fetch all numerical (status pages) & non-numerical (content pages) 
     * - foreach content page fetch name and use as this as the current value in iteration loop
     * - attempt to fetch an interface of the same name, from the ViewTemplates namespace (none case sensitive).
     * - (if interface found): attempt to fetch a get callback from and apply to endpoint, otherwise return empty object
     * - (if interface found): attempt to get post callback and bind to same endpoint.
     * - Set status pages
     */
    public bindViewEngine(): void {
        Logger.log("Loading view data...");
        WebServer.instance.viewEngine = "ejs";

        this.views.filter((name: string) => !(/^[0-9]+$/.test(name)))
            .forEach((name: string) => {
                const _interface = ViewTemplates.getViews()
                    .filter(i => i.name.toLowerCase() == name.toLowerCase())[0];

                WebServer.instance.registerGetEndpoint(`/${name}`.replace("index", ""),
                    (req: any, res: any) => {
                        const getCallack: Function | undefined = _interface.prototype.get;
                        res.render(name, _interface && getCallack ? getCallack(req, res) : {});
                });
                
                if (_interface) {
                    {
                        const postCallback = _interface.prototype.post;
                        if(postCallback !== undefined)
                        {
                            WebServer.instance.registerPostEndpoint(`/${name}`.replace("index", ""),
                                (req: any, res: any, next: any) => {
                                    Object.create(_interface.prototype).post(req, res);
                                    res.render(name, _interface ? postCallback(req, res, next) : {});
                                }
                            );
                        }
                    }
                }
            });

        this.views.filter(n => /^[0-9]+$/.test(n)).forEach(n => {
            const _interface = ViewTemplates.getViews().filter(i => i.name.toLowerCase() == n.toLowerCase())[0];
            
            WebServer.instance.setMiddleware((req: any, res: any) => {
                res.status(n);

                const getCallback: Function | undefined = _interface?.prototype.get; 
                res.render(n, _interface && getCallback ? getCallback(req, res) : {})
            });
        })
    }

    /**
     * fetch all ejs templates from views folder under root.
     * 
     * @psuedocode views
     * - fetches the projectRoot from the Globals class. 
     * - Scans recursivly over the views folder for .ejs files (View templates)
     * - if view found, sanitizes to its absolute name and adds the name to return stack.
     * - return found ejs views
     */
    private get views(): string[] {
        let out: string[] = [];

        Globals.fileSystem.recurseSync(path.join(Globals.projectRoot, "views"), (filepath: string, relative: string, name: string) => {
            if (name && name.endsWith("ejs")) {
                const filename = path.basename(filepath);
                const absName = filename.substring(0, filename.length - 4);

                out.push(absName);
            }
        });

        return out;
    }
}