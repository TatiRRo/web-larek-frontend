import './scss/styles.scss';

// Методы оплаты заказа

export enum PaymentMethod {
	Online = 'online',
	Offline = 'offline',
}

// Интерфейс продукта

export interface IProduct {
	id: string;
	category: string;
	title: string;
	image: string;
	description: string;
	price: number | string;
}

// Интерфейс формы при оформлении заказа

export interface IOrderContactsData {
	payment: PaymentMethod;
	address: string;
	email: string;
	phone: string;
}

// Интерфейс заказа

export interface IOrder extends IOrderContactsData {
	total: string | number;
	items: string[];
}

// Интерфейс итогового заказа

export interface IOrderSuccess {
	id: string;
	total: number;
}

// Ошибка формы
export type FormErrors = Partial<Record<keyof IOrder, string>>;
