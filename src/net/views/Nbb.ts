/**
 * @module src.net.views
 */
import { NextFunction } from "express";
import { IWebResponse } from "../interfaces/IWebResponse";
import { IViewTemplate } from '../interfaces/IViewTemplate';

export const Nbb: IViewTemplate = {
  get(req: Request, res: Response, next: NextFunction): IWebResponse {
    const response: IWebResponse = {
      data: {
        message: undefined,
      },
    };
    return response;
  },

  post(req: any, res: any, next: NextFunction): IWebResponse {
    const response: IWebResponse = {
      data: {
        message: `<h2>Welcome, ${(req.body as any).fname}</h2>`,
      },
    };

    return response;
  }
}
