import { ensureElement } from "../../../utils/utils";
import { Card, ICard } from "./Card";
import { ICardActions } from "../../../types";


export class CardInBasket extends Card<ICard> {
    protected cardIndex: HTMLElement;

    constructor(container: HTMLElement, actions?: ICardActions) {
        super(container);

        this.cardIndex = ensureElement<HTMLElement>('.basket__item-index', this.container);
        if (actions?.onClick) {
            this.container.addEventListener("click", actions.onClick);
        }
    };

    set index(idx: number) {
        this.cardIndex.textContent = String(idx);
    };
}