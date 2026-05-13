import { ICatalogFromApi, IOrder, IOrderResult, IProduct } from "../../types";
import { Api } from "../base/Api.ts";

export class ApiModel {
    private api: Api;
    constructor(api: Api) {
        this.api = api;
    }
    getCatalogProducts():Promise<IProduct[]> {
        return this.api.get<ICatalogFromApi>('/product').then((data) => data.items);
    }
    postOrder(reqData:IOrder): Promise<IOrderResult> { // отправка данных о заказе
        return this.api.post<IOrderResult>('/order', reqData);
    }
}