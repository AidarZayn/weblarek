import { ensureElement } from "../../../utils/utils";
import { IProduct } from "../../../types";
import { Card } from "./Card";
import { categoryMap } from "../../../utils/constants";
import { IEvents } from "../../base/Events";

export type TCardCatalog = Pick <IProduct, 'id' | 'title' | 'image' | 'category'>;

type CategoryKey = keyof typeof categoryMap;

export class CardCatalog extends Card<TCardCatalog> {
    protected cardImage: HTMLImageElement;
    protected cardCategory: HTMLElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);

        this.cardImage = ensureElement<HTMLImageElement>('.card__image', this.container);
        this.cardCategory = ensureElement<HTMLElement>('.card__category', this.container);

        this.container.addEventListener('click', () => {
            this.events.emit('card:select', { id: this.id });
        });
    };

    set category(text: string) {
        this.cardCategory.textContent = String(text);

        for (const key in categoryMap) {
            this.cardCategory.classList.toggle(
                categoryMap[key as CategoryKey],
                key === text
            );
        }
    };

    set image(image: string) {
        this.setImage(this.cardImage, image, this.title);
    };

    render(data: TCardCatalog): HTMLElement {
        this.id = data.id;
        return super.render(data);
    }
}