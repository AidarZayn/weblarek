import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';
import { ISuccessActions } from '../../types';

export interface IChanged {
    total: number;
}

export class SuccessView extends Component<IChanged>{
    protected buttonWindow: HTMLButtonElement;
    protected totalPriceWindow: HTMLElement;

    constructor(container: HTMLElement, actions?: ISuccessActions) {
        super(container);

        this.totalPriceWindow = ensureElement<HTMLElement>('.order-success__description', this.container);
        this.buttonWindow =  ensureElement<HTMLButtonElement>('.order-success__close', this.container);

        if (actions?.onOrdered) {
            this.buttonWindow.addEventListener('click', actions.onOrdered);
        }
    };

    set total(price: number) {
        this.totalPriceWindow.textContent = `Списано ${price} синапсов`;
    };
}