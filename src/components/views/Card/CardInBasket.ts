import { ensureElement } from "../../../utils/utils";
import { Card, ICard } from "./Card";
import { ICardActions } from "../../../types";


export class CardInBasket extends Card<ICard> {
    protected cardIndex: HTMLElement;
    protected cardDelete: HTMLButtonElement;

    constructor(container: HTMLElement, actions?: ICardActions) {
        super(container);

        this.cardIndex = ensureElement<HTMLElement>('.basket__item-index', this.container);
        this.cardDelete = ensureElement<HTMLButtonElement>('.card__button', this.container);

        if(actions?.deleteButtonClickHandler) {
            this.cardDelete.addEventListener('click', actions.deleteButtonClickHandler);
        }
    };

    set index(idx: number) {
        this.cardIndex.textContent = String(idx);
    };
}