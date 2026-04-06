import type { IProduct } from "../../types";

export class Busket {
    private busket: IProduct[] = [];

    get productsBusket(): IProduct[] {
        return this.busket;
    }

    addItemInBusket(value: IProduct) {
        this.busket.push(value);
    }

    deleteProductInBusket(id: string) {
        this.busket = this.busket.filter(item => item.id !== id);
    }

    clearBusket(): void {
        this.busket = []
    }

    get amountBusket(): number {
        return this.busket.reduce((acc, item: IProduct) => {
            if (item.price !== null) {
                return acc + item.price;
            }
            return acc;
        }, 0);
    }

    get busketLength(): number {
        return this.busket.length;
    }

    hasProductInBasket(id: string): boolean {
        return this.busket.some(element => element.id === id);
    }
}