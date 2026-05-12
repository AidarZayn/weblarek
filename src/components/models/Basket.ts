import type { IProduct } from "../../types";
import { IEvents } from "../base/Events"

export class Basket {
    private basket: IProduct[] = [];

    constructor(protected events: IEvents) {}

    get productsBasket(): IProduct[] {
        return this.basket;
    }

    addItemInBasket(value: IProduct) {
        this.basket.push(value);
        this.events.emit('basket:change');
    }

    deleteProductInBasket(id: string) {
        this.basket = this.basket.filter(item => item.id !== id);
        this.events.emit('basket:change');
    }

    clearBasket(): void {
        this.basket = [];
        this.events.emit('basket:change');
    }

    get amountBasket(): number {
        return this.basket.reduce((acc, item: IProduct) => {
            if (item.price !== null) {
                return acc + item.price;
            }
            return acc;
        }, 0);
    }

    get basketLength(): number {
        return this.basket.length;
    }

    hasProductInBasket(id: string): boolean {
        return this.basket.some(element => element.id === id);
    }
}