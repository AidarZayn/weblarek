import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';
import { IEvents, EventEnum } from '../base/Events';

interface ModalContent {
    content: HTMLElement;
}

export class ModalView extends Component<ModalContent> {
    protected closeButton: HTMLButtonElement;
    protected modalContent: HTMLDivElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);

        this.modalContent = ensureElement<HTMLDivElement>('.modal__content', this.container);
        this.closeButton = ensureElement<HTMLButtonElement>('.modal__close', this.container);

        this.closeButton.addEventListener('click', () => {
            this.events.emit(EventEnum.CloseModal);
        })

        this.container.addEventListener('click', (event) => {
            if (event.target === this.container) {
                this.events.emit(EventEnum.CloseModal);
            }
        });
    };

    set content(content: HTMLElement | null) {
        if (content) {
            this.modalContent.replaceChildren(content);
        }
    }

    open(): void {
        this.container.classList.add('modal_active');
    };

    close(): void {
        this.container.classList.remove('modal_active');
        this.content = null;
    };
}