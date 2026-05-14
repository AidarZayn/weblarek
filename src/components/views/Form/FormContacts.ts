import { ensureElement } from '../../../utils/utils';
import { Form } from './Form';
import { IFormActions } from "../../../types";

export interface IContactsForm {
    email: string;
    phone: string;
}

export class FormContacts extends Form<IContactsForm> {
    protected emailInput: HTMLInputElement;
    protected phoneInput: HTMLInputElement;

    constructor(container: HTMLElement, actions?: IFormActions) {
        super(container, actions);

        this.emailInput = ensureElement<HTMLInputElement>('input[name="email"]', this.container);
        this.phoneInput = ensureElement<HTMLInputElement>('input[name="phone"]', this.container);

        this.emailInput.addEventListener('input', () => {
            if (actions?.emailInputChangeHandler) {
                actions.emailInputChangeHandler(this.emailInput.value);
            }
        });
        this.phoneInput.addEventListener('input', () => {
            if (actions?.phoneInputChangeHandler) {
                actions.phoneInputChangeHandler(this.phoneInput.value);
            }
        });
    };

    set email(value: string) {
        this.emailInput.value = value;
    }

    set phone(value: string) {
        this.phoneInput.value = value;
    }
}