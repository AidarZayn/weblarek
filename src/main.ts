import { Busket } from './components/models/Busket'
import { Catalog } from './components/models/Catalog'
import { Buyer } from './components/models/Buyer'
import { CatalogService } from "./components/models/CatalogService";
import { apiProducts } from "./utils/data.ts";
import type { IBuyer } from "./types";
import { API_URL } from "./utils/constants.ts";
import { Api } from './components/base/Api.ts'
import './scss/styles.scss';

console.log('---Пример работы с каталогом---');

const catalog = new Catalog();

console.log('---Заполнение каталога его товарами---')
catalog.catalogData = apiProducts.items;

console.log('Проверка заполнения данных')
console.log(catalog.catalogData);

console.log('------------------------------------------------');

console.log('---Выбор товара---')
catalog.selectedProductData = catalog.catalogData[0]

console.log('Вывод выбранного товара')
console.log(catalog.selectedProductData);

console.log('------------------------------------------------');

console.log('Вывод в консоль элемента по его ID')
console.log(catalog.findProductById(catalog.catalogData[0].id));

console.log('------------------------------------------------');

console.log('---Пример работы с корзиной---');

const busket  = new Busket();

console.log('------------------------------------------------');

console.log('---Пример добавления элемента в корзину---');
busket.addItemInBusket(catalog.selectedProductData);
busket.addItemInBusket(catalog.catalogData[1]);
busket.addItemInBusket(catalog.catalogData[2]);
console.log('Проверка корзины');
console.log(busket.productsBusket)

console.log('------------------------------------------------');

console.log('Проверка длины массива');
console.log(busket.busketLength)

console.log('------------------------------------------------');
console.log('---Удаление товара из корзина по его ID---');
busket.deleteProductInBusket(catalog.catalogData[1].id)
console.log('Проверка корзины');
console.log(busket.productsBusket)

console.log('------------------------------------------------');
console.log('Общая стоимость корзины');
console.log(busket.amountBusket);

console.log('------------------------------------------------');
console.log('Проверка наличия товара');
console.log(busket.hasProductInBasket(catalog.catalogData[0].id));

console.log('------------------------------------------------');
console.log('---Очистка корзины---');
busket.clearBusket();
console.log('Проверка корзины после очистки');
console.log(busket.productsBusket);
console.log('------------------------------------------------');

console.log('---Пример работы юзера---');

const buyer = new Buyer();
const classForNotCompleteBuyer = new Buyer();

const exampleUser: IBuyer = {
    payment: 'card',
    address: 'Адоратского 13',
    phone: '89872846800',
    email: 'aidar-dev@mail.ru'
};

const exampleNotCompleteUser: Partial<IBuyer> = {
    payment: 'cash',
    address: 'Рафаэля Сафиуллина 36'
}

console.log('------------------------------------------------');

console.log('Проверка заполнения неполных данных во второго юзера');
classForNotCompleteBuyer.buyerData = exampleNotCompleteUser;
console.log(classForNotCompleteBuyer.buyerData);

console.log('Проверка метода с валидацией неполных данных второго юзера')
const errorsNotCompleteBuyer = classForNotCompleteBuyer.validateForm();
console.log(errorsNotCompleteBuyer);

console.log('------------------------------------------------');

console.log('---Закидываем полного юзера---');
buyer.buyerData = exampleUser;
console.log('Проверка полного юзера');
console.log(buyer.buyerData);

console.log('------------------------------------------------');

console.log('Проверка ошибок');
const errors = buyer.validateForm()
console.log(errors);

console.log('------------------------------------------------');

console.log('---Очистка данных юзера---');
buyer.clearBuyerData();

console.log('------------------------------------------------');
console.log('Проверка юзера');
console.log(buyer.buyerData);

console.log('------------------------------------------------');

console.log('Получения данных с сервера');
const api = new Api(API_URL);
const catalogService = new CatalogService(api);

try {
    const catalogResponse = await catalogService.getCatalogProducts();
    catalog.catalogData = catalogResponse.items;
    console.log(catalog.catalogData);
} catch (e) {
    console.error("Не удалось получить каталог с сервера:", e);
}

/*Оставил на 2 часть проектной работы*/
/*
busket.addItemInBusket(catalog.catalogData[1]);
busket.addItemInBusket(catalog.catalogData[2]);

buyer.buyerData = exampleUser;

const createOrderValue: IOrder = {
    ...buyer.buyerData,
    total: busket.amountBusket,
    items: busket.productsBusket.filter(item => item.id).map(item => item.id)
}

const orderResult = await catalogService.postOrder(createOrderValue);
console.log("Заказ оформлен:", orderResult);
*/


