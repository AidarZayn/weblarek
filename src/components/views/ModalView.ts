import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/Events';

interface ModalContent {
    content: HTMLElement;
}

export class ModalView extends Component<ModalContent> {
    protected closeButton: HTMLButtonElement;
    protected overlayContainer: HTMLElement;
    protected contentContainer: HTMLElement;
    isOpen: boolean = false;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);

        this.closeButton = ensureElement<HTMLButtonElement>('.modal__close', this.container);
        this.overlayContainer = ensureElement<HTMLElement>('.modal__content', this.container);
        this.contentContainer = ensureElement<HTMLElement>('.page__wrapper');

        this.closeButton.addEventListener('click', () => {
            this.close();
        });

        this.container.addEventListener('click', (event) => {
            if (event.target === this.container) {
                this.close();
            }
        });
    };

    protected handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Escape' || event.key === 'Enter') {
            this.close();
        }
    };

    set content(content: HTMLElement) {
        this.overlayContainer.replaceChildren(content);
    }

    open(): void {
        this.contentContainer.classList.add('page__wrapper_locked');
        this.container.classList.add('modal_active');
        this.isOpen = true;

        document.addEventListener('keydown', this.handleKeyDown);

        this.events.emit('modal:open');
    };

    close(): void {
        if (!this.isOpen) {
            return;
        }

        this.contentContainer.classList.remove('page__wrapper_locked');
        this.container.classList.remove('modal_active');
        this.isOpen = false;

        document.removeEventListener('keydown', this.handleKeyDown);

        this.events.emit('modal:close');
    };
}