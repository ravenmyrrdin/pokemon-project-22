/**
 * @module src.net.views
 */
import { NextFunction } from "express";
import { IWebResponse } from "../interfaces/IWebResponse";
import { IViewTemplate } from '../interfaces/IViewTemplate';
import { StringTools } from "../../misc/StringTools";

interface User
{
  firstName:string,
  lastName:string, 
  email:string,
  msg:string
}

export const Contact: IViewTemplate = {
  get(req: Request, res: Response, next: NextFunction): IWebResponse {
    const response: IWebResponse = {
      data: {
        message: undefined,
      },
    };
    return response;
  },

  post(req: any, res: any, next: NextFunction): IWebResponse {
    const userData: User = req.body;
    
    // Check data
    const errors: string[] = [];
    if(!([userData.firstName, userData.lastName, userData.email, userData.msg].some(i => i === undefined)))
    {
        // Email regex: https://www.emailregex.com/
        if(!StringTools.isEmail(userData.email)) errors.push("Invalid e-mail.");
    } else errors.push("Request error");

    if(errors) return { data: { error: errors.join("\n")}}
    else return { data: { message: "E-mail send test"} }
  }
}