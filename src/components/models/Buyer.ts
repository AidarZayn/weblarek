import type { IBuyer, IErrorsBayer } from "../../types";

const emptyBuyerData = {
    payment: null,
    address: '',
    phone: '',
    email: ''
}

export class Buyer {
    private buyer: IBuyer;

    constructor() {
        this.buyer = {...emptyBuyerData};
    }

    get buyerData(): IBuyer {
        return this.buyer;
    }

    set buyerData(Buyer: Partial<IBuyer>) {
        this.buyer = { ...this.buyer, ...Buyer };
    }

    clearBuyerData(): void {
        this.buyer = {...emptyBuyerData};
    }

    validateForm(): IErrorsBayer {
        const errors: IErrorsBayer = {};
        if (this.buyer.address === '') {
            errors.address = 'Поле \'Адрес\' не может быть пустым'
        }
        if (this.buyer.phone === '') {
            errors.phone = 'Поле \'Телефон\' не может быть пустым'
        }
        if (this.buyer.email === '') {
            errors.email = 'Поле \'Эл. почта\' не может быть пустым'
        }
        if (this.buyer.payment === null) {
            errors.payment = 'Поле \'Способ оплаты\' не может быть пустым'
        }

        return errors;
    }
}