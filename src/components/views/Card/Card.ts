import { IProduct } from "../../../types";
import { Component } from "../../base/Component";
import { ensureElement } from "../../../utils/utils";

export interface ICard extends Partial<IProduct> {
    index?: number;
}

export abstract class Card<T extends ICard> extends Component <T> {
    protected cardTitle: HTMLElement;
    protected cardPrice: HTMLElement;

    constructor(container: HTMLElement) {
        super(container);

        this.cardTitle = ensureElement<HTMLElement>('.card__title', this.container);
        this.cardPrice = ensureElement<HTMLElement>('.card__price', this.container);
    };

    set title(title: string) {
        this.cardTitle.textContent = String(title);
    };

    set price(price: number | null) {
        if (price === null) {
            this.cardPrice.textContent = 'Бесценно';
        } else {
            this.cardPrice.textContent = `${price} синапсов`;
        }
    }
}