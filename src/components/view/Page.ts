import { Component } from '../base/Component';
import { IEvents } from '../base/events';
import { ensureElement } from '../../utils/utils';

export interface IPage {
	counter: number;
	gallery: HTMLElement[];
	locked: boolean;
}

export class Page extends Component<IPage> {
	protected _counter: HTMLElement;
	protected _gallery: HTMLElement;
	protected _wrapper: HTMLElement;
	protected _basket: HTMLElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);

		this._counter = ensureElement<HTMLElement>('.header__basket-counter');
		this._gallery = ensureElement<HTMLElement>('.gallery');
		this._wrapper = ensureElement<HTMLElement>('.page__wrapper');
		this._basket = ensureElement<HTMLElement>('.header__basket');

		this._basket.addEventListener('click', () => {
			this.events.emit('basket:open');
		});
	}

	set counter(value: number) {
		this.setText(this._counter, String(value));
	}

	set catalog(items: HTMLElement[]) {
		this._gallery.replaceChildren(...items);
	}

	set isLocked(status: boolean) {
		this._wrapper.classList.toggle('page__wrapper_locked', status);
	}
}
