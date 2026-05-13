import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';
import { EventEnum, IEvents } from "../base/Events";

interface IBasket {
    basket: HTMLElement[];
    total: number;
    isValid: boolean;
}

export class BasketView extends Component<IBasket> {
    protected basketListContainer: HTMLElement;
    protected basketButton: HTMLButtonElement;
    protected totalPrice: HTMLElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);

        this.basketListContainer = ensureElement<HTMLElement>('.basket__list', this.container);
        this.basketButton = ensureElement<HTMLButtonElement>('.basket__button', this.container);
        this.totalPrice = ensureElement<HTMLElement>('.basket__price', this.container);

        this.basketButton.addEventListener('click', () => {
            this.events.emit(EventEnum.BasketOrderButtonClick);
        });
    };

    set basket(cards: HTMLElement[]) {
        this.basketListContainer.replaceChildren(...cards);
    };

    set total(price: number) {
        this.totalPrice.textContent = `${price} синапсов`;
    };

    set isValid(value: boolean) {
        this.basketButton.disabled = !value;
    };
}