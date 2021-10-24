import { Request } from '../api/api.js';
import { favorite, unfavorite } from '../store/actions.js';
import { showFullImg } from '../utils/utils.js';
import StatusElement from '../components/statusElement.js';
import Component from '../components/component.js';
import List from '../components/list.js';

export default class Catalog extends Component {
  constructor(idSelector, parentSelector, store) {
    super();
    this.state = {
      users: [],
      albums: [],
      photos: [],
      requestStatus: {
        loading: true,
        completed: false,
        error: null,
      },
    };

    this.catalog = document.querySelector(idSelector);
    this.container = document.querySelector(parentSelector) || document.body;
    this.store = store;

    this.userList = null;
    this.statusElementsCreator = new StatusElement();
    this.loader = this.statusElementsCreator.createLoading();
    this.errorMessage = this.statusElementsCreator.createMessage({
      imgSrc: './assets/error.png',
      title: 'Сервер не отвечает',
      description: 'Уже работаем над этим',
      className: 'wide',
    });

    this.usersListClickHandler = this.usersListClickHandler.bind(this);
    this.albumsListClickHandler = this.albumsListClickHandler.bind(this);
    this.photoListClickHandler = this.photoListClickHandler.bind(this);

    this.render();
    this.fetchUsers();
  }

  handleClick(target, handler) {
    if (target.classList.contains('active')) {
      target.classList.remove('active');
    } else {
      target.classList.add('active');
      handler(target);
    }
  }

  async updateListView(el, dataArr, requestFn, handler) {
    if (
      dataArr.length ||
      el.dataset.status === 'loaded' ||
      el.dataset.status === 'loading'
    ) {
      return;
    }

    if (el.dataset.status === 'error') {
      el.querySelector('.message').remove();
    }

    const loader = this.loader.cloneNode(true);
    const errorMessage = this.errorMessage.cloneNode(true);

    el.dataset.status = 'loading';
    el.append(loader);

    const { data, requestStatus } = await requestFn(el.dataset.id);

    if (requestStatus.error) {
      loader.remove();
      el.append(errorMessage);

      el.dataset.status = 'error';
      return;
    }

    if (data) {
      loader.remove();
      handler(data);
      el.dataset.status = 'loaded';
    }
  }

  usersListClickHandler(e) {
    const target = e.target.closest('.user-item');
    if (target) {
      this.handleClick(target, this.createAlbumsList.bind(this));
    }
  }

  photoListClickHandler(e) {
    e.stopPropagation();

    const target = e.target;
    const targetClass = target.classList;
    const img = this.state.photos.find(
      (p) => p.id === +target.parentNode.dataset.id
    );

    if (targetClass.contains('favorite-btn')) {
      if (target.classList.contains('active')) {
        target.classList.remove('active');

        this.store.dispatch(unfavorite(img.id));
      } else {
        target.classList.add('active');

        this.store.dispatch(favorite(img));
      }
    }

    if (targetClass.contains('photo-item__img')) {
      showFullImg(target.parentNode.dataset.id, img.url);
    }
  }

  albumsListClickHandler(e) {
    e.stopPropagation();

    const target = e.target.closest('.album-item');

    if (target) {
      this.handleClick(target, this.createPhotoList.bind(this));
    }
  }

  async createPhotoList(parent) {
    const loadedPhotos = this.state.photos.filter(
      (al) => al.albumId === +parent.dataset.id
    );

    const { favoritePhotos } = this.store.getState();

    const renderPhotoList = (data) => {
      parent.append(
        new List({
          dataArr: data,
          listClass: 'photo-list',
          itemClass: 'photo-item',
          handler: this.photoListClickHandler,
        }).createItemsList(
          'photo',
          favoritePhotos.map((p) => +p.id)
        )
      );
    };

    this.updateListView(
      parent,
      loadedPhotos,
      this.fetchPhotos.bind(this),
      renderPhotoList
    );
  }

  async createAlbumsList(parent) {
    const loadedAlbums = this.state.albums.filter(
      (al) => al.userId === +parent.id
    );

    const renderAlbumsList = (data) => {
      parent.append(
        new List({
          dataArr: data,
          listClass: 'user-albums',
          itemClass: 'album-item',
          handler: this.albumsListClickHandler,
        }).createItemsList()
      );
    };

    this.updateListView(
      parent,
      loadedAlbums,
      this.fetchAlbums.bind(this),
      renderAlbumsList
    );
  }

  async fetchUsers() {
    const { data, requestStatus } = await Request.fetchUsers();

    this.setState((state) => ({
      ...state,
      users: data,
      requestStatus,
    }));
  }

  async fetchAlbums(userId) {
    const { data, requestStatus } = await Request.fetchAlbums(userId);

    this.setState((state) => ({
      ...state,
      albums: [...state.albums, ...data],
    }));

    return { data, requestStatus };
  }

  async fetchPhotos(albumId) {
    const { data, requestStatus } = await Request.fetchPhotos(albumId);

    this.setState((state) => ({
      ...state,
      photos: data,
    }));

    return { data, requestStatus };
  }

  render() {
    if (this.state.requestStatus.loading) {
      this.catalog.append(this.loader);
    } else {
      this.loader.remove();
    }

    if (this.state.requestStatus.error) {
      this.catalog.append(this.errorMessage);
    } else {
      this.errorMessage.remove();
    }

    if (this.state.users.length && !this.userList) {
      this.userList = new List({
        dataArr: this.state.users,
        listClass: 'user-list',
        itemClass: 'user-item',
        handler: this.usersListClickHandler,
      }).createItemsList();

      this.catalog.append(this.userList);
    }
  }
}
