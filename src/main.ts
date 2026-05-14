import './scss/styles.scss';

import { Basket } from "./components/models/Basket";
import { Buyer } from "./components/models/Buyer";
import { Catalog } from './components/models/Catalog';

import { CardCatalog } from "./components/views/Card/CardCatalog";
import { CardInBasket } from "./components/views/Card/CardInBasket";
import { CardPreview } from "./components/views/Card/CardPreview";

import { FormContacts, IContactsForm } from "./components/views/Form/FormContacts";
import { FormOrder, IOrderForm } from "./components/views/Form/FormOrder";

import { BasketView } from "./components/views/BasketView";
import { GalleryView } from "./components/views/GalleryView";
import { HeaderView } from "./components/views/HeaderView";
import { ModalView } from "./components/views/ModalView";
import { SuccessView } from "./components/views/SuccessView";

import { API_URL } from './utils/constants';
import { Api } from './components/base/Api';
import { ApiModel } from './components/models/ApiModel'

import { EventEmitter, EventEnum } from './components/base/Events';
import { cloneTemplate, ensureElement } from './utils/utils';

import type { IProduct, TPayment } from "./types";

const events = new EventEmitter();

const baseApi = new Api(API_URL);
const api = new ApiModel(baseApi);

const basketModel = new Basket(events);
const buyerModel = new Buyer(events);
const catalogModel = new Catalog(events);

const headerElement = ensureElement<HTMLElement>('.header');
const catalogElement = ensureElement<HTMLElement>('.gallery');
const modalElement = ensureElement<HTMLDivElement>('#modal-container');

const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderFormTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsFormTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

const gallery = new GalleryView(catalogElement, events);
const modal = new ModalView(modalElement, events);
const header = new HeaderView(headerElement, events);
const basket = new BasketView(cloneTemplate(basketTemplate), events);

const cardPreview = new CardPreview(cloneTemplate(cardPreviewTemplate), {
    purchaseButtonClickHandler: () => {
        events.emit(EventEnum.CardPreviewButtonClick);
    }});

const formOrder  = new FormOrder(cloneTemplate(orderFormTemplate), {
    paymentButtonClickHandler: (payment) => {
        events.emit(EventEnum.FormOrderSetPayment, {payment});
    },
    addressInputChangeHandler: (address) => {
        events.emit(EventEnum.FormOrderSetAddress, {address});
    },
    submitButtonClickHandler: () => {
        events.emit(EventEnum.FormOrderSubmit);
    }
});

const formContacts = new FormContacts(cloneTemplate(contactsFormTemplate), {
    emailInputChangeHandler: (email) => {
        events.emit(EventEnum.FormContactsChangeEmail, {email});
    },
    phoneInputChangeHandler: (phone) => {
        events.emit(EventEnum.FormContactsChangePhone, {phone});
    },
    submitButtonClickHandler: () => {
        events.emit(EventEnum.FormContactsSubmit);
    }
});

const successView = new SuccessView(cloneTemplate(successTemplate), {
    successButtonClickHandler: () => {
        events.emit(EventEnum.SuccessSubmit);
    }
});

api.getCatalogProducts().then((data) =>{
    catalogModel.catalogData = data;
}).catch();

events.on(EventEnum.CatalogSetAllProducts, () => {
    const itemCards = catalogModel.catalogData.map((item) => {
        const onClick = () => {
            events.emit(EventEnum.CardCatalogClick, {product: item});
        };
        const card = new CardCatalog(cloneTemplate(cardCatalogTemplate), {onClick});
        return card.render(item);
    })
    gallery.render({
        catalog: itemCards,
    });
});

events.on<{product: IProduct}>(EventEnum.CardCatalogClick, ({product}) => {
    catalogModel.selectedProductData = product.id;
});

function getCardButtonState(product: IProduct, isInBasket: boolean) {
    let buttonText = 'Купить';
    let isDisabled = false;

    if (product.price === null) {
        buttonText = 'Недоступно';
        isDisabled = true;
    } else if (isInBasket) {
        buttonText = 'Удалить из корзины';
    }

    return { buttonText, isDisabled };
}

events.on(EventEnum.CatalogSetSelectedProduct, () => {
    const product = catalogModel.selectedProductData;
    if (product) {
        const isInBasket = basketModel.hasProductInBasket(product.id);
        const { buttonText, isDisabled } = getCardButtonState(product, isInBasket);

        const preview = cardPreview.render({...product, buttonText, isDisabled});
        modal.render({content: preview});
        modal.open();
    }
});

events.on(EventEnum.CardPreviewButtonClick, () => {
    const product = catalogModel.selectedProductData;
    if (product) {
        if (basketModel.hasProductInBasket(product.id)) {
            basketModel.deleteProductInBasket(product.id);
        } else {
            basketModel.addItemInBasket(product);
        }
        modal.close();
    }
});

events.on(EventEnum.BasketChange, () =>{
    header.render({counter: basketModel.basketLength});
    const selectedProduct = catalogModel.selectedProductData;
    if (selectedProduct) {
        const isInBasket = basketModel.hasProductInBasket(selectedProduct.id);
        const { buttonText, isDisabled } = getCardButtonState(selectedProduct, isInBasket);
        cardPreview.render({buttonText, isDisabled});
    }

    const cardBasketArray = basketModel.productsBasket.map((item, index) => {
        const cardBasket = new CardInBasket(cloneTemplate(cardBasketTemplate), {
            deleteButtonClickHandler: () => {
                events.emit(EventEnum.CardBasketDelete, {product: item});
            }
        });
        return cardBasket.render({...item, index: index + 1});
    });

    basket.render({
        basket: cardBasketArray,
        total: basketModel.amountBasket,
        isValid: basketModel.basketLength > 0
    });
});

events.on(EventEnum.BasketOpen, () => {
    modal.render({content: basket.render({isValid: basketModel.basketLength > 0})});
    modal.open();
});

events.on<{product: IProduct}>(EventEnum.CardBasketDelete, ({product}) => {
    basketModel.deleteProductInBasket(product.id);
    modal.render({content: basket.render()});
});

events.on(EventEnum.BasketOrderButtonClick, () => {
    if (!buyerModel.buyerData) {
        buyerModel.buyerData = {};
    }
    const data = buyerModel.buyerData || { payment: null, address: '', email: '', phone: '' };
    const errors = buyerModel.validateForm();
    const orderErrors: Partial<Record<keyof IOrderForm, string>> = Object.fromEntries(Object.entries(errors).filter((error) => {
        return ['payment', 'address'].includes(error[0]);
    }));

    const isValid = Object.keys(orderErrors).length === 0;

    modal.render({
        content: formOrder.render({
            payment: data.payment,
            address: data.address,
            errors: orderErrors,
            isValid: isValid,
        })
    })
});

events.on(EventEnum.FormOrderSetPayment, ({payment}: {payment: TPayment}) => {
    buyerModel.buyerData = { payment };
});

events.on(EventEnum.FormOrderSetAddress, ({address}: {address: string}) => {
    buyerModel.buyerData = { address };
});

events.on(EventEnum.FormContactsChangeEmail, ({email}: {email: string}) => {
    buyerModel.buyerData = { email };
});

events.on(EventEnum.FormContactsChangePhone, ({phone}: {phone: string}) => {
    buyerModel.buyerData = { phone };
});

events.on(EventEnum.BuyerChange, () => {
    const data = buyerModel.buyerData || { payment: null, address: '', email: '', phone: '' };
    const errors = buyerModel.validateForm();
    
    const orderErrors: Partial<Record<keyof IOrderForm, string>> = Object.fromEntries(Object.entries(errors).filter((error) => {
        return ['payment', 'address'].includes(error[0]);
    }));

    const orderIsValid = Object.keys(orderErrors).length === 0;
    
    formOrder.render({
        payment: data.payment,
        address: data.address,
        errors: orderErrors,
        isValid: orderIsValid,
    });

    const contactsErrors: Partial<Record<keyof IContactsForm, string>> = Object.fromEntries(Object.entries(errors).filter((error) => {
        return ['email', 'phone'].includes(error[0]);
    }));

    const contactsIsValid = Object.keys(contactsErrors).length === 0;

    formContacts.render({
        email: data.email,
        phone: data.phone,
        errors: contactsErrors,
        isValid: contactsIsValid,
    });
});

events.on(EventEnum.FormOrderSubmit, () => {
    const data = buyerModel.buyerData || { payment: null, address: '', email: '', phone: '' };
    const errors = buyerModel.validateForm();
    const contactsErrors: Partial<Record<keyof IContactsForm, string>> = Object.fromEntries(Object.entries(errors).filter((error) => {
        return ['email', 'phone'].includes(error[0]);
    }));

    const isValid = Object.keys(contactsErrors).length === 0;

    modal.render({
        content: formContacts.render({
            email: data.email,
            phone: data.phone,
            errors: contactsErrors,
            isValid: isValid,
        })
    })
});

events.on(EventEnum.FormContactsSubmit, () => {
    const errors = buyerModel.validateForm();
    
    if (Object.keys(errors).length > 0) {
        return;
    }
    const data = buyerModel.buyerData || { payment: null, address: '', email: '', phone: '' };
    const ids = basketModel.productsBasket.map(item => item.id);
    api.postOrder({
        ...data,
        total: basketModel.amountBasket,
        items: ids,
    }).then((res) => {
        buyerModel.clearBuyerData();
        basketModel.clearBasket();
        modal.close();
        if('total' in res) {
            modal.render({content: successView.render({total: res.total})});
            modal.open();
        }
    }).catch();
});

events.on(EventEnum.SuccessSubmit, () => {
    modal.close();
});

events.on(EventEnum.CloseModal, () => {
    modal.close();
})