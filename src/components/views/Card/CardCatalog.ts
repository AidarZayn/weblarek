import { ensureElement } from "../../../utils/utils";
import { IProduct } from "../../../types";
import { Card } from "./Card";
import { categoryMap, CDN_URL } from "../../../utils/constants";
import { ICardActions } from '../../../types'

export type TCardCatalog = Pick <IProduct, 'id' | 'title' | 'image' | 'category'>;

type CategoryKey = keyof typeof categoryMap;

export class CardCatalog extends Card<TCardCatalog> {
    protected cardImage: HTMLImageElement;
    protected cardCategory: HTMLElement;

    constructor(container: HTMLElement, actions?: ICardActions) {
        super(container);

        this.cardImage = ensureElement<HTMLImageElement>('.card__image', this.container);
        this.cardCategory = ensureElement<HTMLElement>('.card__category', this.container);

        if (actions?.onClick) {
            this.container.addEventListener("click", actions.onClick);
        }
    };

    set category(text: string) {
        this.cardCategory.textContent = text;

        for (const key in categoryMap) {
            this.cardCategory.classList.toggle(
                categoryMap[key as CategoryKey],
                key === text
            );
        }
    };

    set image(image: string) {
        this.setImage(this.cardImage, CDN_URL + image, this.title);
    };
}