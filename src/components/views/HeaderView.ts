import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';
import { EventEnum, IEvents } from "../base/Events";

interface BasketCounter {
    counter: number;
}

export class HeaderView extends Component<BasketCounter> {
    protected count: HTMLElement;
    protected basketButton: HTMLButtonElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);

        this.count = ensureElement<HTMLElement>('.header__basket-counter', this.container);
        this.basketButton = ensureElement<HTMLButtonElement>('.header__basket', this.container);

        this.basketButton.addEventListener('click', () => {
            this.events.emit(EventEnum.BasketOpen);
        });
    };

    set counter(item: number) {
        this.count.textContent = String(item);
    };
}