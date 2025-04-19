import './scss/styles.scss';

import { WebLarekAPI } from './components/model/WebLarekAPI';
import { API_URL, CDN_URL } from './utils/constants';
import { EventEmitter } from './components/base/events';
import { Page } from './components/view/Page';
import { Modal } from './components/common/Modal';
import { cloneTemplate, ensureElement } from './utils/utils';
import { Card, BasketItem } from './components/view/Card';
import {
	IOrderContactsData,
	IOrderResult,
	IProduct,
	PaymentMethod,
} from './types';
import { AppState, CatalogChangeEvent } from './components/presenter/AppState';
import { Basket } from './components/view/Basket';
import { Success } from './components/view/Success';
import { OrderForm } from './components/view/OrderForm';
import { ContactsForm } from './components/view/ContactsForm';

const eEmitter = new EventEmitter();
const api = new WebLarekAPI(CDN_URL, API_URL);

// Все шаблоны
const catalogItemTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const cardInBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const modalTemplate = ensureElement<HTMLTemplateElement>('#modal-container');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

// Модель данных приложения
const globalAppState = new AppState({}, eEmitter);

// Глобальные контейнеры
const page = new Page(document.body, eEmitter);
const modal = new Modal(modalTemplate, eEmitter);
const basket = new Basket(cloneTemplate(basketTemplate), {
	onClick: () => eEmitter.emit('order:data'),
});

const orderForm = new OrderForm(cloneTemplate(orderTemplate), eEmitter);
const contactsForm = new ContactsForm(
	cloneTemplate(contactsTemplate),
	eEmitter
);

// Получаем каталог карточек товаров с сервера
api
	.getProductList()
	.then((data) => {
		globalAppState.updateCatalog(data);
	})
	.catch((err) => {
		console.error(err);
	});

// Изменились элементы каталога
eEmitter.on<CatalogChangeEvent>('catalog:update', (catalog) => {
	page.catalog = catalog.map((item) => {
		//создание экземпляра карточки товара
		const card = new Card('card', cloneTemplate(catalogItemTemplate), {
			//Установка подписки на событие выбора карточки товара при клике на нее
			onClick: () => {
				globalAppState.setPreview(item);
			},
		});

		return card.render({
			image: item.image,
			title: item.title,
			category: item.category,
			price: item.price,
			description: item.description,
		});
	});
});

// Открытие модального окна карточки
eEmitter.on('preview:change', (product: IProduct) => {
	const isInBasket = globalAppState.isInBasket(product.id);

	modal.content = new Card('card', cloneTemplate(cardPreviewTemplate), {
		onClick: isInBasket
			? () => eEmitter.emit('basket:open')
			: () => {
					globalAppState.addToBasket(product.id); // добавляем товар
					modal.close(); // закрываем модалку
					page.isLocked = false; // разблокируем прокрутку
			  },
	}).render({ ...product, ...(isInBasket && { button: 'Уже в корзине' }) });

	modal.open();
});

// Закрытие модального окна
eEmitter.on('modal:close', () => {
	page.isLocked = false;
});

eEmitter.on('modal:open', () => {
	page.isLocked = true;
});

//Создание элементов корзины
const createBasketItems = (): HTMLElement[] => {
	const products = globalAppState.getBasketItems();

	return products.map((product, index) =>
		new BasketItem(cloneTemplate(cardInBasketTemplate), {
			onClick: () => {
				globalAppState.removeFromBasket(product.id);
			},
		}).render({
			index: index + 1,
			price: product.price,
			title: product.title,
		})
	);
};

//Подписываемся на события открытия корзины - открытие корзины со списком товаров
eEmitter.on('basket:open', () => {
	modal.render({
		content: basket.render({
			list: createBasketItems(),
			totalPrice: globalAppState.basketTotal,
		}),
	});

	page.isLocked = true;
});

// Удаление из корзины
eEmitter.on('basket:changed', () => {
	page.counter = globalAppState.basketItems.length;

	basket.render({
		list: createBasketItems(),
		totalPrice: globalAppState.basketTotal,
	});
});

// Открытые формы адреса и платежа
eEmitter.on('order:data', () => {
	modal.render({
		content: orderForm.render({
			payment: PaymentMethod.Online,
			address: '',
			valid: false,
			errors: 'Введите адрес',
		}),
	});
});

eEmitter.on('order:submit', () => {
	modal.render({
		content: contactsForm.render({
			email: '',
			phone: '',
			valid: false,
			errors: 'Введите почту и телефон',
		}),
	});
});

eEmitter.on('contacts:submit', () => {
	api
		.postOrder({
			...globalAppState.contactsData,
			items: globalAppState.basketItems,
			total: globalAppState.basketTotal,
		})
		.then((data) => {
			globalAppState.clearContactsData();
			globalAppState.clearBasket();

			eEmitter.emit('submit:success', data);
		})
		.catch((err) => {
			globalAppState.clearContactsData();
			console.error(err);
		});
});

eEmitter.on(
	/^order\..*:change/,
	(data: { field: keyof IOrderContactsData; value: string }) => {
		globalAppState.setFormData({ [data.field]: data.value });

		orderForm.render({
			valid: !globalAppState.formErrors.address,
			errors: globalAppState.formErrors.address ? 'Введите адрес' : '',
		});
	}
);

eEmitter.on(
	/^contacts\..*:change/,
	(data: { field: keyof IOrderContactsData; value: string }) => {
		globalAppState.setFormData({ [data.field]: data.value });

		let errors = (() => {
			if (globalAppState.formErrors.email && globalAppState.formErrors.phone) {
				return 'Введите почту и телефон';
			}
			if (globalAppState.formErrors.email) {
				return 'Введите почту';
			}
			if (globalAppState.formErrors.phone) {
				return 'Введите телефон';
			}
			return '';
		})();

		contactsForm.render({
			valid:
				!globalAppState.formErrors.email && !globalAppState.formErrors.phone,
			errors: errors,
		});
	}
);

eEmitter.on('submit:success', (data: IOrderResult) => {
	page.counter = globalAppState.basketItems.length;
	modal.render({
		content: new Success(cloneTemplate(successTemplate), {
			onClick: () => {
				modal.close();
			},
		}).render({ totalPrice: data.total }),
	});
});
