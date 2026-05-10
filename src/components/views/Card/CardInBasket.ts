import { ensureElement } from "../../../utils/utils";
import { Card, ICard } from "./Card";
import { IEvents } from "../../base/Events";
import { IProduct } from "../../../types";


export class CardInBasket extends Card<ICard> {
    protected cardIndex: HTMLElement;
    protected deleteButtonForCard: HTMLButtonElement;

    constructor(container: HTMLElement, protected events?: IEvents) {
        super(container);

        this.cardIndex = ensureElement<HTMLElement>('.basket__item-index', this.container);
        this.deleteButtonForCard = ensureElement<HTMLButtonElement>('.basket__item-delete', this.container);

        this.deleteButtonForCard.addEventListener('click', () => {
            this.events?.emit('card:remove-product', { id: this.id});
            this.events?.emit('basket:open');
        });
    };

    set index(idx: number) {
        this.cardIndex.textContent = String(idx);
    };

    render(data: IProduct) {
        this.id = data.id;
        return super.render(data);
    }
}