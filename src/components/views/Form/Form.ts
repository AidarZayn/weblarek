import { Component } from '../../base/Component';
import { ensureElement } from '../../../utils/utils';
import { IEvents } from '../../base/Events';

export abstract class Form extends Component<{}> {
    protected error: HTMLElement;
    protected button: HTMLButtonElement;

    constructor(
        container: HTMLElement,
        protected events: IEvents,
        protected buttonName: string
    ) {
        super(container);

        this.error = ensureElement<HTMLElement>('.form__errors', this.container);
        this.button = ensureElement<HTMLButtonElement>('button[type="submit"]', this.container);

        this.container.addEventListener('submit', (event: SubmitEvent) => {
            event.preventDefault();
            this.events.emit(this.buttonName);
        });
    };

    set buttonStateDisabled(value: boolean) {
        this.button.disabled = value;
    }

    set errors(value: string) {
        this.error.textContent = String(value);
    };

    removeErrors() {
        this.error.textContent = '';
    }

    isCheckErrors(errors: { [key: string]: string }): void {
        const errorsList = Object.values(errors).filter(Boolean);
        if (errorsList.length > 0) {
            this.errors = errorsList.join(', ');
            this.button.disabled = true;
        } else {
            this.removeErrors();
            this.button.disabled = false;
        }
    }
}