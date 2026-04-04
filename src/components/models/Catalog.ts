import type { IProduct } from "../../types";

const exampleCatalog: IProduct = {
    id: '',
    title: '',
    description: '',
    image: '',
    category: '',
    price: null,
};

export class Catalog {
    private products: IProduct[]
    private selectedProduct: IProduct

    constructor() {
        this.products = [{...exampleCatalog}]
        this.selectedProduct = {...exampleCatalog}
    }

    get catalogData(): IProduct[] {
        return this.products;
    }

    set catalogData(products: IProduct[]) {
        this.products = products;
    }

    get selectedProductData(): IProduct {
        return this.selectedProduct;
    }

    set selectedProductData(product: IProduct) {
        this.selectedProduct = product;
    }

    findProductById(productId: string): IProduct | null {
        const product = this.products.find(item => item.id === productId);
        return product ?? null;
    }
}