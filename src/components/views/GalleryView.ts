import { Component } from '../base/Component';
import { IEvents } from "../base/Events";

interface CatalogData {
    catalog: HTMLElement[];
}

export class GalleryView extends Component<CatalogData> {
    protected catalogElement: HTMLElement;

    constructor(container: HTMLElement, protected events: IEvents,) {
        super(container);

        this.catalogElement = this.container;
    };

    set catalog(items: HTMLElement[]) {
        this.catalogElement.replaceChildren(...items);
    };
}