import './scss/styles.scss';

import { Basket } from "./components/models/Basket";
import { Buyer } from "./components/models/Buyer";
import { Catalog } from './components/models/Catalog';

import { CardCatalog } from "./components/views/Card/CardCatalog";
import { CardInBasket } from "./components/views/Card/CardInBasket";
import { CardPreview } from "./components/views/Card/CardPreview";

import { FormContacts } from "./components/views/Form/FormContacts";
import { FormOrder } from "./components/views/Form/FormOrder";

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

import type { IErrorsBayer, IProduct, TPayment } from "./types";

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
        const selectedProduct = catalogModel.selectedProductData;
        if(selectedProduct) {
            if(basketModel.hasProductInBasket(selectedProduct.id)) {
                events.emit(EventEnum.CardPreviewDelete, {product: selectedProduct});
            }else {
                events.emit(EventEnum.CardPreviewPurchase, {product: selectedProduct});
            }
        }
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

events.on<{products: IProduct[]}>(EventEnum.CatalogSetAllProducts, ({products}) => {
    const itemCards = products.map((item) => {
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

events.on<{product: IProduct}>(EventEnum.CatalogSetSelectedProduct, ({product}) => {
    const isInBasket = basketModel.hasProductInBasket(product.id);
    const preview = cardPreview.render({...product, isInBasket});
    modal.render({content: preview});
    modal.open();
});

events.on<{product: IProduct}>(EventEnum.CardPreviewPurchase, ({product}) =>{
    modal.close();
    basketModel.addItemInBasket(product);
});

events.on<{product: IProduct}>(EventEnum.BasketAddProduct, () =>{
    header.render({count: basketModel.basketLength});
});

events.on<{product: IProduct}>(EventEnum.CardPreviewDelete, ({product}) =>{
    modal.close();
    basketModel.deleteProductInBasket(product.id);
});

events.on<{product: IProduct}>(EventEnum.BasketDeleteProduct, () =>{
    header.render({count: basketModel.basketLength});
});

events.on(EventEnum.BasketOpen, () => {
    const cardBasketArray = basketModel.productsBasket.map((item, index) => {
        const cardBasket = new CardInBasket(cloneTemplate(cardBasketTemplate), {
            deleteButtonClickHandler: () => {
                events.emit(EventEnum.CardBasketDelete, {product: item});
            }
        });
        return cardBasket.render({...item, index: index + 1});
    });
    modal.render({content: basket.render({items: cardBasketArray, totalPrice: basketModel.amountBasket})});
    modal.open();
});

events.on<{product: IProduct}>(EventEnum.CardBasketDelete, ({product}) => {
    basketModel.deleteProductInBasket(product.id);
    const cardBasketArray = basketModel.productsBasket.map((item, index) => {
        const cardBasket = new CardInBasket(cloneTemplate(cardBasketTemplate), {
            deleteButtonClickHandler: () => {
                events.emit(EventEnum.CardBasketDelete, {product: item});
            }
        });
        return cardBasket.render({...item, index: index + 1});
    });
    modal.render({content: basket.render({items: cardBasketArray, totalPrice: basketModel.amountBasket})});
});

events.on(EventEnum.BasketOrderButtonClick, () => {
    buyerModel.clearBuyerData();
    modal.render({content: formOrder.render({
            payment: '',
            address: '',
            errors: {},
            isValid: false,
        })})
});

events.on<{payment: TPayment}>(EventEnum.BuyerChange, () => {
    const errors = buyerModel.validateForm();
    const requiredErrors = Object.fromEntries(Object.entries(errors).filter((error) => {
        const fieldsToCheck = ['payment', 'address'];
        return fieldsToCheck.includes(error[0]);
    }));
    events.emit(EventEnum.FormOrderValidated, {errors: requiredErrors});
});

events.on<{address: string}>(EventEnum.BuyerChange, () => {
    const errors = buyerModel.validateForm();
    const requiredErrors = Object.fromEntries(Object.entries(errors).filter((error) => {
        const fieldsToCheck = ['payment', 'address'];
        return fieldsToCheck.includes(error[0]);
    }));
    events.emit(EventEnum.FormOrderValidated, {errors: requiredErrors});
})

events.on<{errors: IErrorsBayer}>(EventEnum.FormOrderValidated, ({errors}) => {
    const isValid = !('payment' in errors) && !('address' in errors);
    modal.render({content: formOrder.render({
            payment: buyerModel.buyerData?.payment || undefined,
            address: buyerModel.buyerData?.address,
            errors,
            isValid,
        })})
});

events.on(EventEnum.FormOrderSubmit, () => {
    modal.render({content: formContacts.render({
            email: '',
            phone: '',
            errors: {},
            isValid: false,
        })})
});

events.on<{email: string}>(EventEnum.BuyerChange, () => {
    const errors = buyerModel.validateForm();
    const requiredErrors = Object.fromEntries(Object.entries(errors).filter((error) => {
        const fieldsToCheck = ['email', 'phone'];
        return fieldsToCheck.includes(error[0]);
    }));
    events.emit(EventEnum.FormContactsValidated, {errors: requiredErrors});
});

events.on<{phone: string}>(EventEnum.BuyerChange, () => {
    const errors = buyerModel.validateForm();
    const requiredErrors = Object.fromEntries(Object.entries(errors).filter((error) => {
        const fieldsToCheck = ['email', 'phone'];
        return fieldsToCheck.includes(error[0]);
    }));
    events.emit(EventEnum.FormContactsValidated, {errors: requiredErrors});
});

events.on<{errors: IErrorsBayer}>(EventEnum.FormContactsValidated, ({errors}) => {
    const isValid = !('email' in errors) && !('phone' in errors);
    modal.render({content: formContacts.render({
            email: buyerModel.buyerData?.email,
            phone: buyerModel.buyerData?.phone,
            errors,
            isValid,
        })})
});

events.on(EventEnum.FormContactsSubmit, () => {
    const data = buyerModel.buyerData;
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

// подписываемся на собитие отчистки корзины
events.on(EventEnum.BasketClear, () => {
    header.render({count: basketModel.amountBasket});
});

// подписываемся на событие изменения способа оплаты в форме заказа
events.on<{payment: TPayment}>(EventEnum.FormOrderSetPayment, ({payment}) => {
    buyerModel.buyerData = { payment };
});

// подписываемся на событие изменения адреса в форме заказа
events.on<{address: string}>(EventEnum.FormOrderSetAddress, ({address}) => {
    buyerModel.buyerData = { address };
});

// подписываемся на событие изменения почты в форме контакта
events.on<{email: string}>(EventEnum.FormContactsChangeEmail, ({email}) => {
    buyerModel.buyerData = { email };
});

// подписываемся на событие изменения телефона в форме контакта
events.on<{phone: string}>(EventEnum.FormContactsChangePhone, ({phone}) => {
    buyerModel.buyerData = { phone };
});

api.getCatalogProducts().then((data) =>{
    catalogModel.catalogData = data;
}).catch();

events.on(EventEnum.CloseModal, () => {
    modal.close();
})