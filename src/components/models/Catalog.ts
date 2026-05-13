import type { IProduct } from "../../types";
import { IEvents, EventEnum } from "../base/Events";

export class Catalog {
    private products: IProduct[] = [];
    private selectedProduct: IProduct | null = null;

    constructor(protected events: IEvents) {}

    get catalogData(): IProduct[] {
        return this.products;
    }

    set catalogData(products: IProduct[]) {
        this.products = products;
        this.events.emit(EventEnum.CatalogSetAllProducts, {products});
    }

    get selectedProductData(): IProduct | null {
        return this.selectedProduct;
    }

    set selectedProductData(id: string) {
        const product = this.findProductById(id);
        this.selectedProduct = product ?? null;
        this.events.emit(EventEnum.CatalogSetSelectedProduct, {product});
    }

    findProductById(productId: string): IProduct | undefined {
       return this.products.find(item => item.id === productId);
    }
}