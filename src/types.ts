// Методы оплаты заказа

export enum PaymentMethod {
	Online = 'card',
	Offline = 'cash',
}

// Интерфейс продукта

export interface IProduct {
	id: string;
	category: string;
	title: string;
	image: string;
	description: string;
	price: number;
}

// Интерфейс формы при оформлении заказа

export interface IOrderContactsData {
	payment: PaymentMethod;
	address: string;
	email: string;
	phone: string;
}

// Интерфейс заказа

export interface IOrderForm extends IOrderContactsData {
	total?: string | number;
	items?: string[];
}

// Интерфейс итогового заказа

export interface IOrderResult {
	id: string;
	total: number;
}

// интерфейсы данных заказа
export interface IOrderLot {
	payment: string;
	email: string;
	phone: string;
	address: string;
	total: number;
	items: string[];
}

// Ошибка формы
export type FormErrors = Record<keyof IOrderContactsData, boolean>;
