import { Busket } from './components/models/Busket'
import { Catalog } from './components/models/Catalog'
import { Buyer } from './components/models/Buyer'
import { CatalogService } from "./components/models/CatalogService";
import { apiProducts } from "./utils/data.ts";
import type { IBuyer } from "./types";

console.log('Пример работы с каталогом');

const catalog = new Catalog();

// Заполнение каталога его товарами
catalog.catalogData = apiProducts.items;

// Проверка данных в консоль
console.log(catalog.catalogData);

console.log('------------------------------------------------');

// Имитация выбора товара
catalog.selectedProductData = catalog.catalogData[0]

// Вывод имитационного товара
console.log(catalog.selectedProductData);

console.log('------------------------------------------------');

// Вывод в консоль элемента по его ID
console.log(catalog.findProductById(catalog.catalogData[0].id));

console.log('------------------------------------------------');

console.log('Пример работы с корзиной');

const busket  = new Busket();

console.log('------------------------------------------------');

console.log('Пример добавления элемента в корзину');
busket.addItemInBusket(catalog.selectedProductData);
busket.addItemInBusket(catalog.catalogData[1]);
busket.addItemInBusket(catalog.catalogData[2]);

console.log('------------------------------------------------');

console.log('Проверка корзины');
console.log(busket.productsBusket)

console.log('------------------------------------------------');

console.log('Проверка длины массива');
console.log(busket.busketLength)

console.log('------------------------------------------------');
busket.deleteProductInBusket(catalog.catalogData[1])

console.log('------------------------------------------------');
console.log('Проверка корзины');
console.log(busket.productsBusket)

console.log('------------------------------------------------');
console.log('Общая стоимость корзины');
console.log(busket.amountBusket);

console.log('------------------------------------------------');
console.log('Проверка наличия товара');
console.log(busket.hasProductInBasket(catalog.catalogData[0]));

console.log('------------------------------------------------');
console.log('Очистка корзины');
busket.clearBusket();
console.log(busket.productsBusket);
console.log('------------------------------------------------');

console.log('Пример работы юзера');

const buyer = new Buyer();

const exampleUser: IBuyer = {
    payment: 'card',
    address: 'Адоратского 13',
    phone: '89872846800',
    email: 'aidar-dev@mail.ru'
};

console.log('------------------------------------------------');

console.log('Закидываем юзера');
buyer.buyerData = exampleUser;

console.log('------------------------------------------------');
console.log('Проверка юзера');
console.log(buyer.buyerData);

console.log('------------------------------------------------');
console.log('Проверка ошибок');
const errors = buyer.validateForm()
console.log(errors);

console.log('------------------------------------------------');

console.log('Очистка данных юзера');
buyer.clearBuyerData();

console.log('------------------------------------------------');
console.log('Проверка юзера');
console.log(buyer.buyerData);

console.log('------------------------------------------------');

console.log('Пример получения данных с сервера');

const catalogService = new CatalogService();

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


