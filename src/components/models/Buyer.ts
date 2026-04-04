import type { IBuyer, TErrorsBayer } from "../../types";

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

    set buyerData(Buyer: IBuyer) {
        this.buyer = Buyer;
    }

    clearBuyerData(): void {
        this.buyer = {...emptyBuyerData};
    }

    validateForm(): TErrorsBayer {
        const errors: TErrorsBayer = {...emptyBuyerData};
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