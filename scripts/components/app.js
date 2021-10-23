import Catalog from '../pages/catalog.js';
import Header from './header.js';
import Component from './component.js';
import Favorite from '../pages/favorite.js';

export default class App extends Component {
	constructor(store) {
		super();
		this.store = store;

		this.location = window.location;

		this.activeRoute = this.location.hash || '#catalog';
		this.location.href = this.activeRoute;

		this.changeUrl = this.changeUrl.bind(this);

		this.header = new Header('.header', this.changeUrl);
		this.catalog = new Catalog('.catalog', '.container', store);
		this.favorite = new Favorite('.favorite', store);

		this.catalogEl = this.catalog.catalog;
		this.favoriteEl = this.favorite.favorite;

		this.updateView();
	}

	changeUrl(e) {
		const href = e.currentTarget.getAttribute('href');
		this.activeRoute = href;
		this.location.hash = href;

		this.updateView();
	}

	updateView() {
		if (this.activeRoute === '#catalog' || this.activeRoute === '') {
			this.catalogEl.classList.remove('hide');
		} else {
			this.catalogEl.classList.add('hide');
		}

		if (this.activeRoute === '#favorite') {
			this.favorite.updateView();
			this.favoriteEl.classList.remove('hide');
		} else {
			this.favoriteEl.classList.add('hide');
		}
	}
}
