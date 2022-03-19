import { NextFunction } from "express";
import { IWebResponse } from "../interfaces/IWebResponse";
import { ViewTemplates } from "../ViewTemplates";

/**
 * Callback interface based on IWebRequest for endpoint: postExample.
 */
@ViewTemplates.set
export class PostExample
{
  get(req: Request, res: Response, next: NextFunction): IWebResponse 
  {
    const response: IWebResponse = {
      data:
      {
        message: undefined
      }
    }

    return response;
  }

  public post(req: any, res: any, next: NextFunction): IWebResponse
  {
    const response: IWebResponse = {
      data:
      {
        message: `<h2>Welcome, ${(req.body as any).fname}</h2>`
      }
    }

    return response;
  }
}
