import { Model } from '../base/Model';
import { EventEmitter } from '../base/events';
import {
	IOrderContactsData,
	PaymentMethod,
	FormErrors,
	IOrderForm,
	IProduct,
} from '../../types';

// Тип события изменения каталога
export type CatalogChangeEvent = IProduct[];

// Интерфейс состояния приложения
export interface IAppState {
	catalog: IProduct[];
	basketItems: string[];
	basketTotal: number;
	preview: IProduct | null;
	order: IOrderForm | null;
}

// Класс состояния приложения
export class AppState extends Model<IAppState> {
	events;

	catalog: IProduct[] = [];
	basketItems: string[] = [];
	basketTotal: number = 0;
	preview: IProduct | null;
	contactsData: IOrderContactsData = {
		payment: PaymentMethod.Online,
		address: '',
		phone: '',
		email: '',
	};
	formErrors: FormErrors = {
		payment: false,
		address: true,
		phone: true,
		email: true,
	};

	constructor(data: {}, events: EventEmitter) {
		super(data, events);

		this.events = events;
	}

	// Установка каталога товаров
	updateCatalog(list: IProduct[]) {
		this.catalog = list;
		this.emitChanges('catalog:update', this.catalog);
	}

	//Превью карточки
	setPreview(item: IProduct) {
		this.preview = item;
		this.emitChanges('preview:change', item);
	}

	// Добавить в корзину
	addToBasket(productId: string) {
		if (!this.basketItems.includes(productId)) {
			this.basketItems.push(productId);
			this.calculateBasketTotal(); // пересчёт суммы, если нужно
			this.emitChanges('basket:changed', this.basketItems);
		}
	}

	// Пересчет суммы корзины
	calculateBasketTotal() {
		this.basketTotal = this.catalog
			.filter((product) => this.basketItems.includes(product.id))
			.reduce((sum, product) => sum + (product.price || 0), 0);
	}

	// Удаление из корзины
	removeFromBasket(productId: string) {
		this.basketItems = this.basketItems.filter((id) => id !== productId);
		this.calculateBasketTotal();
		this.emitChanges('basket:changed', this.basketItems);
	}

	// Продукт в корзине
	isInBasket(productId: string): boolean {
		return this.basketItems.some((id) => id === productId);
	}

	// Товары в корзине
	getBasketItems(): IProduct[] {
		return this.catalog.filter((item) => this.isInBasket(item.id));
	}

	// Очистить корзину
	clearBasket() {
		this.basketItems = [];
		this.calculateBasketTotal();
		this.emitChanges('basket:changed', []);
	}

	// Сброс формы и ошибок
	clearContactsData() {
		this.contactsData = {
			address: '',
			email: '',
			phone: '',
			payment: PaymentMethod.Online,
		};

		this.formErrors = {
			address: true,
			email: true,
			phone: true,
			payment: false,
		};
	}

	// Заполнение формы
	setFormData(data: Partial<IOrderContactsData>) {
		this.contactsData = { ...this.contactsData, ...data };

		for (const key in data) {
			if (Object.prototype.hasOwnProperty.call(data, key)) {
				const typedKey = key as keyof IOrderContactsData;
				this.formErrors[typedKey] = !Boolean(data[typedKey]);
			}
		}
	}
}
