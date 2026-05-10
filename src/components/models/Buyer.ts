import type { IBuyer } from "../../types";
import { IEvents } from "../base/Events";

const emptyBuyerData = {
    payment: null,
    address: '',
    phone: '',
    email: ''
}

export class Buyer {
    private buyer: IBuyer | null = null;

    constructor(protected events: IEvents) {}

    get buyerData(): IBuyer | null {
        return this.buyer;
    }

    set buyerData(Buyer: Partial<IBuyer>) {
        if (!this.buyer) {
            this.buyer = {
                payment: null,
                email: '',
                phone: '',
                address: ''
            };
        }
        Object.assign(this.buyer, Buyer);
        this.events.emit('buyer:changed');
    }

    clearBuyerData(): void {
        this.buyer = {...emptyBuyerData};
    }

    validateAddress(): {[key: string]: string} {
        const error: {[key: string]: string} = {};

        if (!this.buyer?.address || this.buyer?.address.trim() === '') {
            error.address = 'Необходимо указать адрес';
        }

        return error;
    }

    validateContacts(): {[key: string]: string} {
        const error: {[key: string]: string} = {};

        if (!this.buyer?.email || !this.buyer?.email.includes('@')) {
            error.email = 'Введите корректный email';
        }

        if (!this.buyer?.phone || this.buyer?.phone.trim() === '') {
            error.phone = 'Введите телефон';
        }

        return error;
    }
}