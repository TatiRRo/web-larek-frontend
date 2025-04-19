import { IEvents } from '../base/events';
import { Form } from '../common/Form';
import { IOrderContactsData, PaymentMethod } from '../../types';
import { ensureElement } from '../../utils/utils';

type OrderFormData = Omit<IOrderContactsData, 'email' | 'phone'>;

export class OrderForm extends Form<OrderFormData> {
	protected _cardButton: HTMLButtonElement;
	protected _cashButton: HTMLButtonElement;
	protected _input: HTMLInputElement;

	constructor(protected container: HTMLFormElement, protected events: IEvents) {
		super(container, events);

		this._input = ensureElement<HTMLInputElement>('input', this.container);

		this._cardButton = ensureElement<HTMLButtonElement>(
			'button[name=card]',
			this.container
		);

		this._cashButton = ensureElement<HTMLButtonElement>(
			'button[name=cash]',
			this.container
		);

		const onPaymentMethodButtonClick = (e: Event) => {
			e.stopPropagation();
			let target = e.target as HTMLButtonElement;

			this.toggleClass(this._cardButton, 'button_alt-active');
			this.toggleClass(this._cashButton, 'button_alt-active');

			this.events.emit(`${this.container.name}.payment:change`, {
				field: 'payment',
				value: target.name,
			});
		};

		this._cardButton.addEventListener('click', onPaymentMethodButtonClick);
		this._cashButton.addEventListener('click', onPaymentMethodButtonClick);
	}

	set payment(value: PaymentMethod) {
		this._cardButton.classList.remove('button_alt-active');
		this._cashButton.classList.remove('button_alt-active');

		this.toggleClass(
			value === PaymentMethod.Online ? this._cardButton : this._cashButton,
			'button_alt-active'
		);
	}

	set address(value: string) {
		this._input.value = value;
	}
}
