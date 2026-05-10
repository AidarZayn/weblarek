import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/Events';

interface BasketData {
    products: HTMLElement[];
    total: number;
}

export class BasketView extends Component<BasketData> {
    protected basketTitle: HTMLElement;
    protected basketListContainer: HTMLElement;
    protected basketButton: HTMLButtonElement;
    protected totalPrice: HTMLElement;

    constructor(container: HTMLElement, protected events?: IEvents) {
        super(container);

        this.basketTitle = ensureElement<HTMLElement>('.modal__title', this.container);
        this.basketListContainer = ensureElement<HTMLElement>('.basket__list', this.container);
        this.basketButton = ensureElement<HTMLButtonElement>('.basket__button', this.container);
        this.totalPrice = ensureElement<HTMLElement>('.basket__price', this.container);

        this.basket = [];

        this.basketButton.addEventListener('click', () => {
            this.events?.emit('basket:order');
        });
    };

    set buttonText(text: string) {
        this.basketButton.textContent = String(text);
    };

    set buttonStateDisabled(state: boolean) {
        this.basketButton.disabled = state;
    };

    set basket(cards: HTMLElement[]) {
        if (cards.length > 0) {
            this.buttonStateDisabled = false;
            this.buttonText = 'Оформить';
            this.basketListContainer.replaceChildren(...cards);
        } else {
            const emptyBasket = document.createElement('p');
            emptyBasket.textContent = 'Корзина пуста';
            this.buttonStateDisabled = true;
            this.buttonText = 'Оформить';
            this.basketListContainer.replaceChildren(emptyBasket);
        }
    };

    set total(price: number) {
        this.totalPrice.textContent = `${price} синапсов`;
    };
}