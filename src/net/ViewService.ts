import path from "path";
import { ViewTemplates } from "./ViewTemplates";

import { Globals } from '../misc/Globals';
import { WebServer } from "./WebServer";
import { Logger } from '../misc/Logger';
import { IViewTemplate } from './interfaces/IViewTemplate';

/**
 * Service responsible for loading view data and registering endpoints.
 * 
 * @author Oste Jannick
 * @created 2022/03/16
 */
export abstract class ViewService {
    protected static readonly ejs: any = require("ejs");

    /**
     * Loads all view data and configuration and binds them to required endpoints.
     * 
     * @psuedocode bindViewEngine
     *  -  The code then gets all of the interfaces for views for namespace acces, loads content pages, and load status pages.
     *  -  The code is used to initialize the views for the application.
     */
    public static async setupViews(): Promise<void> 
    {
        Logger.log("Loading view data...");
        WebServer.viewEngine = "ejs";

        await this.getViewInterfaces();
        this.loadContentPages();
        this.loadStatusPages();
    }

    /**
     * Load all status pages for non valid webresponse (ex: 401 access, 404 non existent, ...)
     * 
     *
     * psuedocode
     * - The code is loading the status pages.
     * - The code is iterating through all of the views and then for each view it will check if that view has a name that starts with 0-9, and if so, it will register a middleware function to render the page with an appropriate status code.
     * - The code is a snippet of code that is used to load the status pages.
     * - The code will return an array of ViewTemplates.
    */
    private static loadStatusPages(): void 
    {
        const views: string[] = this.getViews;
        const viewModels: ViewTemplates.Wrapper<IViewTemplate>[] = ViewTemplates.getViews();

        views.filter(n => /^[0-9]+$/.test(n)).forEach(n => {
            const _interface = viewModels.filter(i => i.name.toLowerCase() == n.toLowerCase())[0];
            
            WebServer.registerMiddleware((req: any, res: any, next: any) => {
                res.status(n);

                const getCallback: Function | undefined = _interface?.prototype.get; 
                res.render(n, _interface && getCallback ? getCallback(req, res) : {})
            });
        })
    }

    /**
     * Loads all non numerical pages and assigns required requests to endpoint matching the filename.
     * 
     * psuedocode
     * - The code is trying to load all the content pages.
     * - It does this by filtering out any views that do not have a name starting with an alphabetical character and then iterating over each view model.
     * - For each view model, it registers a get endpoint for the view's name and posts a render function which will call back into the registered post endpoint if one exists.
     * - If there is no post callback, it will just return what was rendered from the get endpoint.
     * - The code first checks if there is an interface for that particular view model before registering both endpoints in order to make sure they are available when needed.
     * - The code is used to load content pages.
     */
    private static loadContentPages(): void 
    {
        const views = this.getViews;
        const viewModels: ViewTemplates.Wrapper<IViewTemplate>[] = ViewTemplates.getViews();

        views.filter((name: string) => !(/^[0-9]+$/.test(name)))
            .forEach((name: string) => {
                const _interface = viewModels.filter(i => i.name.toLowerCase() == name.toLowerCase())[0];
                WebServer.registerGetEndpoint(`/${name}`.replace("index", ""),
                    (req, res, next) => {
                        const getCallack: Function | undefined = _interface.prototype.get;
                        return (res as any).render(name, _interface && getCallack ? getCallack(req, res) : {});
                });
                
                if (_interface) {
                    {
                        const postCallback = _interface.prototype.post;
                        if(postCallback !== undefined)
                        {
                            WebServer.registerPostEndpoint(`/${name}`.replace("index", ""),
                                (req, res, next) => {
                                    return (res as any).render(name, _interface ? postCallback(req, res, next) : {});
                                }
                            );
                        }
                    }
                }
            });
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
    private static get getViews(): string[] {
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

    /**
     * Load all IViewTemplate extensions from src.net.views
     * @returns 
     * 
     * - The code starts by loading all the IViewTemplate extensions from src.net.views into the current namespace, and then iterates through each of them to see if it is a view that starts with "viewName".
     * - If so, it tries to import the file using await import (path.join(targetPath, interfaceFile)).
     * - If not, it logs an exception and continues on its way through the rest of the code.
     * - The outputViews are then pushed onto an array called outputViews which is returned as a promise in return outputViews;
     * - The code is a simple example of the getViewInterfaces() function.
     * - The getViewInterfaces() function returns a Promise that will return an IViewTemplate[] array.
     */
         private static async getViewInterfaces(): Promise<IViewTemplate[]>
         {
             console.log("Loading interfaces into current namespace...");
             const targetPath: string = path.join(__dirname, "views");
     
             const viewInterfaces: string[] = Globals.fs.readdirSync(targetPath);
             const views: string[] =  this.getViews.map(i => i.toLowerCase());
             const outputViews: IViewTemplate[] = [];
             for(let interfaceFile of viewInterfaces)
             {
                 if(views.filter(viewName => interfaceFile.toLowerCase().startsWith(viewName)).length == 1)
                 {
                     try
                     {
                         const f: IViewTemplate = await import (path.join(targetPath, interfaceFile));
                         outputViews.push(f);
                     }
                     catch(ex)
                     {
                         // Log exceptie...
                         if(ex instanceof Error)
                             Logger.log(ex.message);
                     }
                 }
             }
     
             return outputViews;
         }
}