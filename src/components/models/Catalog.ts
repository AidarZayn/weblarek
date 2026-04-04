import {IProduct} from "../../types";

export type { IProduct } from '../../types/index.ts'

const exampleCatalog: IProduct = {
    id: '',
    title: '',
    description: '',
    image: '',
    category: '',
    price: null,
};

class Catalog {
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