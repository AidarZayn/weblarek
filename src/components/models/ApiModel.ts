import { ICatalogFromApi, IOrder, IOrderResult } from "../../types";
import { Api } from "../base/Api.ts";

export class ApiModel extends Api{
    constructor(baseUrl: string, options: RequestInit = {}) {
        super(baseUrl, options);
    }

    getCatalogProducts(): Promise<ICatalogFromApi> {
        return this.get('/product/');
    }

    postOrder(order: IOrder): Promise<IOrderResult>{
        return this.post('/order', order).then((data => data as IOrderResult));
    }
}