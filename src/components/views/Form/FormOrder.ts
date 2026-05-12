import { IFormActions, TPayment } from "../../../types";
import { ensureAllElements, ensureElement } from "../../../utils/utils";
import { Form } from "./Form";

export interface IOrderForm {
    payment: 'card' | 'cash' | '';
    address: string;
}

export class FormOrder extends Form<IOrderForm> {
    protected paymentButtons: HTMLButtonElement[];
    protected addressInput: HTMLInputElement;

    constructor(container: HTMLElement, actions?: IFormActions) {
        super(container, actions);

        const paymentButtonsContainer = ensureElement<HTMLDivElement>('.order__buttons', this.container);
        this.paymentButtons = ensureAllElements<HTMLButtonElement>('.button', paymentButtonsContainer);
        this.addressInput = ensureElement<HTMLInputElement>('input[name="address"]', this.container);

        this.paymentButtons.forEach((button) => {
            button.addEventListener('click', () => {
                if (actions?.paymentButtonClickHandler) {
                    actions.paymentButtonClickHandler(button.name as TPayment);
                }
            })
        })

        this.addressInput.addEventListener('change', () => {
            if (actions?.addressInputChangeHandler) {
                actions.addressInputChangeHandler(this.addressInput.value);
            }
        });
    };

    set payment(value: 'card' | 'cash' | '') {
        this.paymentButtons.forEach((button) => {
            button.classList.toggle('button_alt-active', button.name === value);
        })
    }

    set address(address: string) {
        this.addressInput.value = address;
    };
}