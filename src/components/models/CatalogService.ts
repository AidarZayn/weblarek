import type {IOrder, ICatalogFromApi, IApi, IOrderResult} from "../../types";

export class CatalogService {
    private api: IApi;

    constructor(api: IApi) {
        this.api = api;
    }

    async getCatalogProducts(): Promise<ICatalogFromApi> {
        return this.api.get('/product');
    }

    async postOrder(value: IOrder): Promise<IOrderResult> {
        return this.api.post<IOrderResult>('/order', value);
    }
}