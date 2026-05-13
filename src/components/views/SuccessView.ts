import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';
import { ISuccessActions } from '../../types';

interface IChanged {
    total: number;
}

export class SuccessView extends Component<IChanged>{
    protected buttonWindow: HTMLButtonElement;
    protected descriptionWindow: HTMLElement;

    constructor(container: HTMLElement, actions?: ISuccessActions) {
        super(container);

        this.descriptionWindow = ensureElement<HTMLElement>('.order-success__description', this.container);
        this.buttonWindow =  ensureElement<HTMLButtonElement>('.order-success__close', this.container);

        if (actions?.successButtonClickHandler) {
            this.buttonWindow.addEventListener('click', actions.successButtonClickHandler);
        }
    };

    set total(price: number) {
        this.descriptionWindow.textContent = `Списано ${price} синапсов`;
    };
}