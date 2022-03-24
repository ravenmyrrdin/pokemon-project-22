
import { AxiosInstance, AxiosResponse } from "axios"
const axios = require("axios");
import {v4 as uuidv4} from 'uuid';

interface keydata {
    authentic: string[];
    'authentic-archive': string[];
    extracts: string[];
    'improved-archive': string[];
    improved: string[];
}

class NBBApi 
{
    private apiEndpoint: string = "https://ws.uat2.cbso.nbb.be";
    private readonly keys: keydata = require("../keys.json")

    private getCategoryKey(category: string): string | undefined
    {
        if(Object.keys(this.keys).includes(category))
        {
            const keySet: string = (Object.assign({}, this.keys) as any)[category];
            if(keySet)
                return keySet[0];
        }

        return undefined;
    }

    public get({category = "", endpoint = ""} = {}):  Promise<AxiosResponse<any, any>>
    {
        return new Promise<AxiosResponse<any, any>>(async(resolve, reject) => 
        {
            const key: string | undefined = this.getCategoryKey(category);
            if(!key) reject(new Error("Invalid category, allowed categories: "+Object.keys(this.keys).join(", ")))

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