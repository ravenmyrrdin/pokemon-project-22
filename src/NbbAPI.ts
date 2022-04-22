
import { AxiosInstance, AxiosResponse } from "axios"
const axios = require("axios");
import {v4 as uuidv4} from 'uuid';

class NBBApi 
{
    
    private readonly categories: string[] = ["authentic", "authentic-archive", "extracts","improved-archive", "improved"];
    private apiEndpoint: string = "https://ws.uat2.cbso.nbb.be";
    private readonly keys = require("../keys.json")

    private getKey(): string | undefined
    {
        if(Object.keys(this.keys).includes("full-access"))
        {
            const keySet: string = (Object.assign({}, this.keys) as any)["full-access"];
            if(keySet)
                return keySet[0];
        }

        return undefined;
    }

    public get({category = "", endpoint = ""} = {}):  Promise<AxiosResponse<any, any>>
    {
        return new Promise<AxiosResponse<any, any>>(async(resolve, reject) => 
        {
            if(!this.categories.includes(category))
                reject(new Error("Invalid category, allowed categories: "+Object.keys(this.keys).join(", ")))
            
            const key: string | undefined = this.getKey();
            if(!key)
                reject(new Error("Key not found"));
            
            const url: string = `${this.apiEndpoint}/${category}/${endpoint}`;
            let response: any
            try
            {
                response = await axios.create().get(url, {
                    headers: {
                        "NBB-CBSO-Subscription-Key": key,
                        "X-Request-Id": uuidv4(),
                        "Accept": "application/json"
                }});
            }
            catch(error) 
            {
                reject(error);
            }
            finally
            {
                resolve(response);
            }
        });
    }
}

const api = new NBBApi();

api.get({
    endpoint: "deposit/0203201340/accountingData",
    category: "authentic"
})