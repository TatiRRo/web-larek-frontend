import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';
import { IProduct } from '../../types';

// Категории продуктов
export const categories: Record<string, string> = {
	другое: 'card__category_other',
	'софт-скил': 'card__category_soft',
	дополнительное: 'card__category_additional',
	кнопка: 'card__category_button',
	'хард-скил': 'card__category_hard',
};

export type CardData = IProduct & {
	index?: number;
	button?: string;
};

// Карточка товара с сервера
export class Card extends Component<CardData> {
	protected _title: HTMLElement;
	protected _image?: HTMLImageElement;
	protected _description?: HTMLElement;
	protected _button?: HTMLButtonElement;
	protected _category?: HTMLElement;
	protected _price: HTMLElement;

	constructor(
		protected blockName: string,
		container: HTMLElement,
		actions?: ICardActions
	) {
		super(container);

		this._title = ensureElement<HTMLElement>(`.${blockName}__title`, container);
		this._image = ensureElement<HTMLImageElement>(
			`.${blockName}__image`,
			container
		);

		this._button = container.querySelector(`.${blockName}__button`);
		this._description = container.querySelector(`.${blockName}__text`);
		this._category = container.querySelector(`.${blockName}__category`);
		this._price = container.querySelector(`.${blockName}__price`);

		// Клик по карточке вызывает событие
		if (actions?.onClick) {
			if (this._button) {
				this._button.addEventListener('click', actions.onClick);
			} else {
				container.addEventListener('click', actions.onClick);
			}
		}
	}

	set id(value: string) {
		this.container.dataset.id = value;
	}

	get id(): string {
		return this.container.dataset.id || '';
	}

	set title(value: string) {
		this.setText(this._title, value);
	}

	get title(): string {
		return this._title.textContent || '';
	}

	set image(value: string) {
		this.setImage(this._image, value, this.title);
	}

	set button(value: string) {
		this.setText(this._button, value);
	}

	set description(value: string) {
		this.setText(this._description, value);
	}

	set category(value: string) {
		this.setText(this._category, value);
		this._category.classList.add(`${categories[value]}`);
	}

	set price(value: number) {
		this.setText(this._price, value ? `${String(value)} синапсов` : 'Бесценно');
		if (this._button) {
			this._button.disabled = !value;
		}
	}
}

// Интерфейс действий пользователя
export interface ICardActions {
	onClick: (event: MouseEvent) => void;
}

// Продукт в корзине
export class BasketItem extends Component<CardData> {
	protected _title: HTMLElement;
	protected _price: HTMLElement;
	protected _index: HTMLElement;
	protected _deleteFromBasketButton: HTMLButtonElement;

	constructor(container: HTMLElement, actions?: ICardActions) {
		super(container);

		this._title = ensureElement<HTMLElement>('.card__title', container);
		this._price = ensureElement<HTMLElement>('.card__price', container);

		this._index = container.querySelector(`.basket__item-index`);
		this._deleteFromBasketButton =
			container.querySelector(`.basket__item-delete`);

		// Удаление из корзины
		if (actions?.onClick) {
			this._deleteFromBasketButton.addEventListener('click', actions.onClick);
		}
	}

	set title(value: string) {
		this.setText(this._title, value);
	}

	set price(value: number) {
		this.setText(this._price, `${value} синапсов`);
	}

	set index(value: number) {
		if (this._index) {
			this._index.textContent = String(value);
		}
	}
}
