import { ensureElement } from "../../../utils/utils";
import { Card, ICard } from "./Card";
import { categoryMap } from "../../../utils/constants";
import { ICardActions } from "../../../types";

type CategoryKey = keyof typeof categoryMap;

type CardButtonText = "В корзину" | "Удалить из корзины" | "Недоступно";

export class CardPreview extends Card<ICard> {
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

        if (actions?.onClick) {
            this.cardButton?.addEventListener("click", actions.onClick);
        }
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

    set buttonText(value: CardButtonText) {
        if (this.cardButton) {
            this.cardButton.textContent = value;
            this.cardButton.disabled = value === "Недоступно";
        }
    }
}