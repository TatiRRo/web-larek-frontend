import { createElement, ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';

interface IBasketActions {
	onClick: () => void;
}

interface BasketData {
	totalPrice: number;
	list: HTMLElement[];
}

export class Basket extends Component<BasketData> {
	protected _list: HTMLElement;
	protected _totalPrice: HTMLElement;
	protected _orderButton: HTMLButtonElement;

	constructor(container: HTMLElement, actions?: IBasketActions) {
		super(container);

		this._list = ensureElement<HTMLElement>('.basket__list', container);
		this._totalPrice = ensureElement<HTMLElement>('.basket__price', container);

		this._orderButton = container.querySelector(`.button.basket__button`);

		if (actions?.onClick) {
			this._orderButton.addEventListener('click', actions.onClick);
		}

		this.setDisabled(this._orderButton, true);
	}

	set totalPrice(value: number) {
		this.setText(this._totalPrice, `${value} синапсов`);
	}

	set list(list: HTMLElement[]) {
		if (list.length > 0) {
			this._list.innerHTML = '';
			this._list.replaceChildren(...list);
			this.setDisabled(this._orderButton, false);

			return;
		}

		this._list.replaceChildren(
			createElement<HTMLParagraphElement>('p', {
				textContent: 'Корзина пуста',
			})
		);
		this.setDisabled(this._orderButton, true);
	}
}
