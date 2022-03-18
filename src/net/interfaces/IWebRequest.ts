import { Response, Request, NextFunction } from "express"; 
import { IWebResponse } from './IWebResponse';

/**
 * Custom express-js request callback interface
 */
export interface IWebRequest
{
    (res: Response, req: Request, next: NextFunction): IWebResponse;
}