import type { IProduct } from "../../types";

export class Catalog {
    private products: IProduct[]
    private selectedProduct: IProduct | null

    constructor() {
        this.products = []
        this.selectedProduct = null
    }

    get catalogData(): IProduct[] {
        return this.products;
    }

    set catalogData(products: IProduct[]) {
        this.products = products;
    }

    get selectedProductData(): IProduct | null {
        if (this.selectedProduct !== null) {
            return this.selectedProduct;
        } else {
            return null
        }
    }

    set selectedProductData(product: IProduct) {
        this.selectedProduct = product;
    }

    findProductById(productId: string): IProduct | null {
        const product = this.products.find(item => item.id === productId);
        return product ?? null;
    }
}