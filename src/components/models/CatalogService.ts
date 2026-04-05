import type {IOrder, ICatalogFromApi, IApi, ApiPostMethods, IOrderResult} from "../../types";

import { API_URL } from "../../utils/constants.ts";

export class CatalogService implements IApi {
    async get<T extends object>(uri: string): Promise<T> {
        const res = await fetch(`${API_URL}${uri}`);

        if (!res.ok) {
            throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        }

        return await res.json() as T;
    }

    async post<T extends object>(
        uri: string,
        data: object,
        method?: ApiPostMethods
    ): Promise<T> {
        const res = await fetch(`${API_URL}${uri}`, {
            method: method ? method : "POST",
            body: JSON.stringify(data),
        });

        if (!res.ok) {
            throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        }

        return await res.json() as T;
    }

    async getCatalogProducts(): Promise<ICatalogFromApi> {
        return this.get('/product');
    }

    async postOrder(value: IOrder): Promise<IOrderResult> {
        return await this.post<IOrderResult>('/order', value);
    }
}