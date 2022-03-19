
//#region Page objects

import { NextFunction } from "express";
import { IWebResponse } from "../interfaces/IWebResponse";
import { ViewTemplates } from "../ViewTemplates";

/**
 * Callback interface based on IWebRequest for endpoint: /.
 */
@ViewTemplates.set
export class Index {
   get(req: Request, res: Response, next: NextFunction): IWebResponse  {
     return {data:{}}
   }
 
   post = undefined;
 }