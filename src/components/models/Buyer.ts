import type { IBuyer, IErrorsBayer } from "../../types";
import { IEvents, EventEnum } from "../base/Events";

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
        this.events.emit(EventEnum.BuyerChange);
    }

    clearBuyerData(): void {
        this.buyer = {...emptyBuyerData};
        this.events.emit(EventEnum.BuyerClearData);
    }

    validateForm(): IErrorsBayer {
        const errors: IErrorsBayer = {};
        if (this.buyer?.address === '') {
            errors.address = 'Поле \'Адрес\' не может быть пустым'
        }
        if (this.buyer?.phone === '') {
            errors.phone = 'Поле \'Телефон\' не может быть пустым'
        }
        if (this.buyer?.email === '') {
            errors.email = 'Поле \'Эл. почта\' не может быть пустым'
        }
        if (this.buyer?.payment === null) {
            errors.payment = 'Поле \'Способ оплаты\' не может быть пустым'
        }
        return errors;
    }
}