import List from '../components/list.js';
import { showFullImg } from '../utils/utils.js';
import StatusElement from '../components/statusElement.js';
import { unfavorite } from '../store/actions.js';

export default class Favorite {
  constructor(elSelector, store) {
    this.favorite = document.querySelector(elSelector);
    this.store = store;
    this.emptyMessage = new StatusElement().createMessage({
      imgSrc: './assets/empty.png',
      title: 'Список избранного пуст',
      description: 'Добавляйте изображения, нажимая на звездочки',
      className: 'full',
    });

    this.removeItemHandler = this.removeItemHandler.bind(this);
  }

  removeItemHandler(e) {
    const target = e.target;
    const targetClass = target.classList;
    const parent = target.parentNode;

    if (targetClass.contains('favorite-btn')) {
      target.classList.remove('active');
      target.parentNode.remove();
      this.store.dispatch(unfavorite(+parent.dataset.id));

      const activeFavoriteBtn = document.querySelector(
        `[data-id="${parent.dataset.id}"] .favorite-btn`
      );

      if (activeFavoriteBtn) {
        activeFavoriteBtn.classList.remove('active');
      }

      this.updateView();
    }

    if (targetClass.contains('favorite-photo__img')) {
      const { favoritePhotos } = this.store.getState();

      const imgUrl = favoritePhotos.find(
        (img) => img.id === +parent.dataset.id
      ).url;
      showFullImg(target.parentNode.dataset.id, imgUrl);
    }
  }

  removeList() {
    this.favoriteList.remove();
  }

  renderList() {
    const { favoritePhotos } = this.store.getState();

    if (this.favoriteList) {
      this.removeList();
    }

    this.favoriteList = new List({
      dataArr: favoritePhotos,
      listClass: 'favorite-list',
      itemClass: 'favorite-photo',
      handler: this.removeItemHandler,
    }).createItemsList(
      'favorite',
      favoritePhotos.map((p) => +p.id)
    );

    this.favorite.append(this.favoriteList);
  }

  updateView() {
    const { favoritePhotos } = this.store.getState();

    if (!favoritePhotos.length) {
      this.favorite.append(this.emptyMessage);
    } else {
      this.emptyMessage.remove();
      this.renderList();
    }
  }
}
