import './scss/styles.scss';
import {IBuyer, type IProduct, IOrder} from './types';

import { Catalog } from './components/models/Catalog';
import { Basket } from './components/models/Basket';
import { Buyer } from './components/models/Buyer';

import { API_URL, CDN_URL } from './utils/constants';
import { ApiModel } from './components/models/ApiModel'

import { EventEmitter } from './components/base/Events';
import { ensureElement, cloneTemplate } from './utils/utils';

import { GalleryView } from './components/views/GalleryView';
import { HeaderView } from './components/views/HeaderView';
import { ModalView } from './components/views/ModalView';
import { BasketView } from './components/views/BasketView';
import { SuccessView } from './components/views/SuccessView';

import { CardInBasket } from './components/views/Card/CardInBasket.ts';
import { CardCatalog } from './components/views/Card/CardCatalog';
import { CardPreview } from './components/views/Card/CardPreview';

import { FormOrder } from './components/views/Form/FormOrder';
import { FormContacts } from './components/views/Form/FormContacts';

const events = new EventEmitter();
const api = new ApiModel(API_URL);

const catalogModel = new Catalog(events);
const basketModel = new Basket(events);
const buyerModel = new Buyer(events);

const header = new HeaderView(ensureElement<HTMLElement>('.header'), events);
const gallery = new GalleryView(ensureElement<HTMLElement>('.page__wrapper'));
const modal = new ModalView(ensureElement<HTMLElement>('.modal'), events);

const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const formOrderTemplate = ensureElement<HTMLTemplateElement>('#order');
const formContactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

const cardPreview = new CardPreview(cloneTemplate(cardPreviewTemplate), events);
const basket = new BasketView(cloneTemplate(basketTemplate), events);
const orderForm = new FormOrder(cloneTemplate(formOrderTemplate), events);
const contactsForm = new FormContacts(cloneTemplate(formContactsTemplate), events);
const successView = new SuccessView(cloneTemplate(successTemplate), {
    onOrdered: () => {
        modal.close();
    },
});

events.on('catalog:changed', () => {
    const itemCards = catalogModel.catalogData.map((item: IProduct) => {
        const card = new CardCatalog(cloneTemplate(cardCatalogTemplate), events);
        return card.render(item);
    });
    gallery.render({ catalog: itemCards });
});


events.on('card:select', (event: { id: string }) => {
    catalogModel.selectedProductData = event.id;
});

events.on('product:changed', (event: { id: string }) => {
    const product = catalogModel.findProductById(event.id);
    if (!product) {
        return;
    }

    const productInBasket = basketModel.hasProductInBasket(event.id);

    modal.render({
        content: cardPreview.render(product, productInBasket),
    });
    modal.open();
});

events.on('card:add-product', (event: { id: string }) => {
    const product: IProduct | undefined = catalogModel.findProductById(event.id);
    if (!product) {
        return;
    }

    basketModel.addItemInBasket(product);
});

events.on('card:remove-product', (event: { id: string }) => {
    const product = catalogModel.findProductById(event.id);
    if (!product) {
        return;
    }

    basketModel.deleteProductInBasket(product.id);
});

events.on('basket:change', () => {
    const basketList = basketModel.productsBasket;

    const basketItems = basketList.map((item, index) => {
        const basketProduct = new CardInBasket(cloneTemplate(cardBasketTemplate), events);

        basketProduct.index = index + 1;
        basketProduct.title = item.title;
        basketProduct.price = item.price;

        return basketProduct.render(item);
    });

    basket.basket = basketItems;
    basket.total = basketModel.amountBasket;
    header.counter = basketModel.basketLength;
});

events.on('basket:open', () => {
    modal.render({ content: basket.render() });
    modal.open();
});

events.on('buyer:change', (data: Partial<IBuyer>) => {
    buyerModel.buyerData = data;
});

events.on('buyer:changed', () => {
    const buyerData = buyerModel;

    orderForm.address = buyerData.buyerData?.address ?? '';
    if (buyerData.buyerData?.payment === null) {
        buyerData.buyerData.payment = 'card';
    } else {
        orderForm.payment = buyerData.buyerData?.payment ?? 'card';
    }
    orderForm.isAddressValid(buyerData.validateAddress());

    contactsForm.email = buyerData.buyerData?.email ?? '';
    contactsForm.phone = buyerData.buyerData?.phone ?? '';
    contactsForm.isContactsValid(buyerData.validateContacts());
});

events.on('basket:order', () => {
    const buyerData = buyerModel;
    orderForm.payment = buyerData.buyerData?.payment ?? 'card';
    orderForm.address = buyerData.buyerData?.address ?? '';

    const addressErrors = buyerData.validateAddress();
    orderForm.isAddressValid(addressErrors);

    modal.render({ content: orderForm.render() });
    modal.open();
});

events.on('order:submit', () => {
    modal.render({ content: contactsForm.render() });
    modal.open();
});

events.on('basket:contacts', () => {
    const buyerData = buyerModel;

    contactsForm.email = buyerData.buyerData?.email ?? '';
    contactsForm.phone = buyerData.buyerData?.phone ?? '';
    contactsForm.isContactsValid(buyerData.validateContacts());

    modal.render({ content: contactsForm.render() });
    modal.open();
});

events.on('contacts:submit', async () => {
    const buyerData = buyerModel.buyerData;

    if (!buyerData) {
        return;
    }

    const orderData: IOrder = {
        payment: buyerData.payment,
        email: buyerData.email,
        phone: buyerData.phone,
        address: buyerData.address,
        total: basketModel.amountBasket,
        items: basketModel.productsBasket.map((p) => p.id),
    };

    try {
        const result = await api.postOrder(orderData);
        events.emit('basket:success', result);
    } catch (err) {
        console.error(err);
    }
});

function cleanupAfterSuccess() {
    basketModel.clearBasket();
    header.counter = basketModel.amountBasket;
    buyerModel.clearBuyerData();
}

events.on('basket:success', (result: { total: number }) => {
    successView.total = result.total;

    modal.render({ content: successView.render() });
    modal.open();

    cleanupAfterSuccess();
});

api.getCatalogProducts()
    .then(catalog => catalog.items.map(product => (
        { ...product, image: `${CDN_URL}/${product.image}`.replace('svg', 'png') }
    )))
    .then(productsWithImages => {
        catalogModel.catalogData = productsWithImages;
    })
    .catch(error => console.error('Ошибка загрузки каталога', error));