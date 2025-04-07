import './scss/styles.scss';

export enum PaymentMethod {
	Online = 'online',
	Offline = 'offline',
}

export interface IProduct {
	id: string;
	category: string;
	title: string;
	image: string;
	description: string;
	price: number | string;
}

export interface IOrder {
	payment: PaymentMethod;
	address: string;
	email: string;
	phone: string;
	total: number;
	items: IProductInBasket[];
}

export interface IProductsData {
	products: IProduct[];
	preview: string | null;
	getCard(cardId: string): IProduct | undefined;
}

export interface IOrderData {
	getOrderInfo(): IBasket;
	setOrderInfo(orderData: IOrder): void;
	deleteProduct(basketId: string, payload: Function | null): void;
	updateOrder(order: IBasket, payload: Function | null): void;
	checkOrderValidation(
		data: Record<keyof IPaymentPage, IContactsCustomer>
	): boolean;
}

export type IProductItemList = Pick<
	IProduct,
	'category' | 'title' | 'image' | 'price'
>;

export type IProductPopup = Pick<
	IProduct,
	'category' | 'title' | 'image' | 'description' | 'price'
>;

export type IProductInBasket = Pick<IProduct, 'title' | 'price'>;

export type IBasket = Pick<IOrder, 'items' | 'total'>;

export type IPaymentPage = Pick<IOrder, 'payment' | 'address'>;

export type IContactsCustomer = Pick<IOrder, 'email' | 'phone'>;

export type IConfirmationOrder = Pick<IOrder, 'total'>;
