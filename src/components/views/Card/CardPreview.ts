import { ensureElement } from "../../../utils/utils";
import { Card } from "./Card";
import { categoryMap, CDN_URL } from "../../../utils/constants";
import { ICardActions, IProduct } from "../../../types";

export type TCardPreview = Pick<IProduct, 'image' | 'category' | 'description'> & {isInBasket: boolean}

type CategoryKey = keyof typeof categoryMap;

type CardButtonText = "В корзину" | "Удалить из корзины" | "Недоступно";

export class CardPreview extends Card<TCardPreview> {
    protected cardImage: HTMLImageElement;
    protected cardCategory: HTMLElement;
    protected cardDescription: HTMLElement;
    protected cardButton: HTMLButtonElement;

    constructor(container: HTMLElement, actions?: ICardActions) {
        super(container);

        this.cardImage = ensureElement<HTMLImageElement>('.card__image', this.container);
        this.cardCategory = ensureElement<HTMLElement>('.card__category', this.container);
        this.cardDescription = ensureElement<HTMLElement>('.card__text', this.container);
        this.cardButton = ensureElement<HTMLButtonElement>('.card__button', this.container);

        if (actions?.purchaseButtonClickHandler) {
            this.cardButton?.addEventListener("click", actions.purchaseButtonClickHandler);
        }
    }

    set image(image: string) {
        this.setImage(this.cardImage, CDN_URL + image, this.title);
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
        this.cardDescription.textContent = value;
    }

    set buttonText(value: CardButtonText) {
        if (this.cardButton) {
            this.cardButton.textContent = value;
            this.cardButton.disabled = value === "Недоступно";
        }
    }

    override set price(value: number | null) {
        if (value) {
            this.cardButton.disabled = false;
        }else {
            this.cardButton.textContent = 'Недоступно';
            this.cardButton.disabled = true;
        }
        super.price = value;
    }

    set isInBasket(value: boolean) {
        if (!this.cardButton.disabled) {
            if (value) {
                this.cardButton.textContent = 'Удалить из корзины';
            }else {
                this.cardButton.textContent = 'Купить';
            }
        }
    }
}