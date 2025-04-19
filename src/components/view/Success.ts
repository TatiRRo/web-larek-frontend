import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';

interface ISuccessActions {
	onClick: () => void;
}

interface SuccessData {
	totalPrice: number;
}

export class Success extends Component<SuccessData> {
	protected _totalPrice: HTMLElement;
	protected _button: HTMLButtonElement;

	constructor(container: HTMLElement, actions?: ISuccessActions) {
		super(container);

		this._totalPrice = ensureElement<HTMLElement>(
			'.order-success__description',
			container
		);

		this._button = container.querySelector(`.button.order-success__close`);

		if (actions?.onClick) {
			this._button.addEventListener('click', actions.onClick);
		}
	}
	set totalPrice(value: number) {
		this.setText(this._totalPrice, `Списано ${value} синапсов`);
	}
}
