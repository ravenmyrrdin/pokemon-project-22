import { NextFunction } from 'express';
import { IViewTemplate } from '../interfaces/IViewTemplate';
import { IWebResponse } from '../interfaces/IWebResponse';

/**
 * Namespace containing IViewTemplates, used for registering views based on generic type attribute (T).
 * models must be made in IViewTemplates.ts otherwise they wont be detected, 
 * todo: look into universal solution..;
 */
export namespace ViewTemplates {
  type Wrapper < T > = {
    new(...args: any[]): T;

    readonly prototype: T;
  }

  const viewImplementations: Wrapper < IViewTemplate > [] = [];

  /**
   * Get all registered views using the set attribute 
   * 
   * @returns IViewTemplateModel array
   */
  export function getViews(): Wrapper < IViewTemplate > [] 
  {
    return viewImplementations;
  }

  /**
   * sets an interface object to the views template stack
   * 
   * @param ctor extended type of IViewTemplateModel
   * @returns IViewTemplateModel wrapper
   */
  export function set < T extends Wrapper < IViewTemplate >> (ctor: T) {
    viewImplementations.push(ctor);
    return ctor;
  }
}
//#endregion

//#region Page objects
/**
 * Implementation of IViewTemplate interface in class style. 
 * 
 */
@ViewTemplates.set
class Index {
  get(req: Request, res: Response, next: NextFunction): IWebResponse  {
    return {data:{}}
  }

  post = undefined;
}
/**
 * Implementation of IViewTemplate interface in class style. 
 * 
 */
@ViewTemplates.set
class GetExample {
  get(req: Request, res: Response, next: NextFunction): IWebResponse {
    const index: number = Number.parseInt(`${(req as any).query.index}`);

    return {data: {
      person: isNaN(index) ? "No person index defined" : [{name: "Jannick Oste"}, {name: "Tom Bom"}][index],
      index: isNaN(index) ? -1 : index
    }}
  }

  post = undefined;
} 

export const postExample: IViewTemplate = {
  post: undefined,
  get: (req: Request, res: Response, next: NextFunction) =>
  {
    console.log("posted from new post");
    const response: IWebResponse = {
      data:
      {
        message: undefined
      }
    }

    return response;
  }
}

@ViewTemplates.set
class PostExample
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

//#endregion