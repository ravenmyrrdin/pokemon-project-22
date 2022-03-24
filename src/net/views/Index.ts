/**
 * @module src.net.views
 */
import { NextFunction } from "express";
import { IWebResponse } from "../interfaces/IWebResponse";
import { IViewTemplate } from '../interfaces/IViewTemplate';

/**
 * Callback interface based on IWebRequest for endpoint: /.
 */
export const Index: IViewTemplate = {
   get(req: Request, res: Response, next: NextFunction): IWebResponse  {
     return {data:{}}
   },
 
   post: undefined
 }