import type { IProduct } from "../../types";
import { IEvents } from "../base/Events";

export class Catalog {
    private products: IProduct[] = [];
    private selectedProduct: IProduct | null = null;

    constructor(protected events: IEvents) {}

    get catalogData(): IProduct[] {
        return this.products;
    }

    set catalogData(products: IProduct[]) {
        this.products = products;
        this.events.emit('catalog:changed');
    }

    get selectedProductData(): IProduct | null {
        if (this.selectedProduct !== null) {
            return this.selectedProduct;
        } else {
            return null
        }
    }

    set selectedProductData(id: string) {
        const product = this.findProductById(id);
        this.selectedProduct = product ?? null;
        this.events.emit('product:changed', { id });
    }

    findProductById(productId: string): IProduct | undefined {
       return this.products.find(item => item.id === productId);
    }
}