import { IEvents } from '../base/events';
import { Form } from '../common/Form';
import { IOrderContactsData, PaymentMethod } from '../../types';
import { ensureElement } from '../../utils/utils';

type ContactsFormData = Omit<IOrderContactsData, 'address' | 'payment'>;

export class ContactsForm extends Form<ContactsFormData> {
	protected _inputEmail: HTMLInputElement;
	protected _inputPhone: HTMLInputElement;

	constructor(protected container: HTMLFormElement, protected events: IEvents) {
		super(container, events);

		this._inputEmail = ensureElement<HTMLInputElement>(
			'input[name=email]',
			this.container
		);

		this._inputPhone = ensureElement<HTMLInputElement>(
			'input[name=phone]',
			this.container
		);
	}

	set email(value: string) {
		this._inputEmail.value = value;
	}

	set phone(value: string) {
		this._inputPhone.value = value;
	}
}
