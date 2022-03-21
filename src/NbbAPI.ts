/*
import { AxiosInstance, AxiosResponse } from "axios"
const axios = require("axios");
import {v4 as uuidv4} from 'uuid';

/***
 * 
 * This service provides summarized information about the annual accounts that were filed to 
 *      the Central Balance Sheet Office of the National Bank of Belgium.

* This service allows to retrieve the following information:
* - The references of annual accounts filed to <u>and</u> accepted by NBB
* - The annual account documents published to the public portal of NBB
                        - The reproduction as PDF image by NBB of the published annual accounts
                        - The improvements made by NBB to a selection of annual accounts
*//*
class NBBApi 
{
    private apiEndpoint: string = "https://ws.cbso.nbb.be";

    public async apiRequest({endpoint = "", productKey = ""} = {}): Promise<AxiosResponse<any, any>>
    {
        return await new Promise<AxiosResponse<any, any>>((resolve, reject) => {
                try
                {
                    resolve(axios.create().get(`${this.apiEndpoint}/${endpoint}`, {
                        headers: {
                            "NBB-CBSO-Subscription-Key": productKey,
                            "X-Request-aId": uuidv4(),
                            "Accept": "application/json"
                    }}));
                }
                catch(error) 
                {
                    reject(error);
                }
            }
        );
    }

    public async getLegalEntityReferences(id: string) 
    {
        return new Promise<AxiosResponse<any, any>>(async(resolve, reject) => await this.apiRequest({
            endpoint: `authentic/legalEntity/${id}/references`,
            productKey: ""
        }));
    }
}

new NBBApi().apiRequest({
    endpoint: `authentic/legalEntity/0203201340/references`,
    productKey: ""
}).then((res: AxiosResponse<any, any>) => console.log(res))
.catch((error: Error) => console.log(error.message));
*/