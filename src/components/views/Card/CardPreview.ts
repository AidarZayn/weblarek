import { ensureElement } from "../../../utils/utils";
import { IProduct } from "../../../types";
import { Card, ICard } from "./Card";
import { categoryMap } from "../../../utils/constants";
import { IEvents } from "../../base/Events";

type CategoryKey = keyof typeof categoryMap;

export class CardPreview extends Card<ICard> {
    protected cardImage: HTMLImageElement;
    protected cardCategory: HTMLElement;
    protected cardDescription: HTMLElement;
    protected cardButton: HTMLButtonElement;
    protected hasInBasket: boolean = false;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);

        this.cardImage = ensureElement<HTMLImageElement>('.card__image', this.container);
        this.cardCategory = ensureElement<HTMLElement>('.card__category', this.container);
        this.cardDescription = ensureElement<HTMLElement>('.card__text', this.container);
        this.cardButton = ensureElement<HTMLButtonElement>('.card__button', this.container);

        this.cardButton.addEventListener('click', () => {
            if (!this.id) return;

            this.hasInBasket = !this.hasInBasket;
            this.cardButton.textContent = this.hasInBasket ? 'Удалить из корзины' : 'Купить';

            const eventInBasket = this.hasInBasket ? 'card:add-product' : 'card:remove-product';
            this.events.emit(eventInBasket, {id: this.id});
        });
    }

    set image(image: string) {
        this.setImage(this.cardImage, image, this.title);
    }

    set category(category: string) {
        this.cardCategory.textContent = String(category);

        for (const key in categoryMap) {
            this.cardCategory.classList.toggle(
                categoryMap[key as CategoryKey],
                key === category
            );
        }
    }

    set description(value: string) {
        this.cardDescription.textContent = String(value);
    }

    render(data: IProduct, inBasket = false): HTMLElement {
        this.id = data.id;
        this.hasInBasket = inBasket;
        this.title = data.title;
        this.price = data.price;
        this.category = data.category;
        this.image = data.image;
        this.description = data.description;

        if (data.price === null) {
            this.cardButton.disabled = true;
            this.cardButton.textContent = 'Недоступно';
        } else {
            this.cardButton.disabled = false;
            this.cardButton.textContent = this.hasInBasket ? 'Удалить из корзины' : 'Купить';
        }

        return super.render(data);
    }
}