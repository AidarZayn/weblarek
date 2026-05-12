import { Component } from '../../base/Component';
import { ensureElement } from '../../../utils/utils';
import { IFormActions } from "../../../types";

interface IForm<T> {
    errors: {[key in keyof T]?: string};
    isValid: boolean;
}

export class Form<T extends object> extends Component<IForm<T> & T> {
    protected error: HTMLElement;
    protected button: HTMLButtonElement;

    constructor(
        container: HTMLElement,
        actions?: IFormActions
    ) {
        super(container);

        const modalActionsContainer = ensureElement<HTMLDivElement>('.modal__actions', this.container);
        this.error = ensureElement<HTMLElement>('.form__errors', modalActionsContainer);
        this.button = ensureElement<HTMLButtonElement>('button', modalActionsContainer);

        this.button.addEventListener('click', (event) => {
            event.preventDefault();
            if (actions?.submitButtonClickHandler) {
                actions.submitButtonClickHandler();
            }
        });
    };

    set errors(value: {[key in keyof T]: string}) {
        this.error.textContent = Object.values(value).join(', ');
    }

    set isValid(value: boolean) {
        this.button.disabled = !value;
    }
}