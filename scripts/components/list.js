export default class List {
	constructor({ dataArr, listClass, itemClass, handler, type }) {
		this.data = dataArr;
		this.listClass = listClass;
		this.itemClass = itemClass;
		this.handler = handler;
		this.type = type;
	}

	createListItem(el) {
		const title = el.name ? el.name : el.title;

		const item = document.createElement('li');

		item.classList.add('list-item', this.itemClass);
		item.dataset.id = el.id;

		item.innerHTML = `
        <div class="list-item__info">
          <span class="circle"></span>
          <p>${title}</p>
        </div>
      `;

		return item;
	}

	createPhotoListItem(el, isFavorite, type) {
		const item = document.createElement('li');
		const img = document.createElement('img');
		const favoriteBtn = document.createElement('button');

		favoriteBtn.classList.add('favorite-btn', isFavorite ? 'active' : null);

		img.src = el.thumbnailUrl;
		img.alt = el.title;
		img.title = el.title;
		img.classList.add(`${this.itemClass}__img`);

		item.classList.add('list-item', this.itemClass);
		item.dataset.id = el.id;

		item.append(img, favoriteBtn);

		if (type === 'favorite') {
			const descr = document.createElement('p');
			descr.classList.add(this.itemClass + '__descr');

			descr.textContent = el.title;

			item.append(descr);
		}

		return item;
	}

	createItemsList(type, favoriteItemsIds = []) {
		const list = document.createElement('ul');
		list.classList.add('list', this.listClass);
		list.addEventListener('click', this.handler);

		const items = this.data.map((el) => {
			const isFavorite = favoriteItemsIds.includes(el.id);

			if (type === 'photo') {
				return this.createPhotoListItem(el, isFavorite);
			}

			if (type === 'favorite') {
				return this.createPhotoListItem(el, isFavorite, type);
			}

			return this.createListItem(el);
		});

		list.append(...items);

		return list;
	}
}
