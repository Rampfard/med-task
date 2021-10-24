import { FAVORITE, UNFAVORITE } from './actionTypes.js';

const initialState = {
  favoritePhotos: [],
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case FAVORITE: {
      const newPhotos = state.favoritePhotos.slice();
      newPhotos.push(action.payload);

      return {
        ...state,
        favoritePhotos: newPhotos,
      };
    }
    case UNFAVORITE: {
      const newPhotos = state.favoritePhotos.filter(
        (photo) => photo.id !== action.payload
      );

      return {
        ...state,
        favoritePhotos: newPhotos,
      };
    }
    default:
      return state;
  }
};

class Store {
  constructor(reducer, initialState) {
    this.name = 'store';
    this.localStorage = window.localStorage;
    this.reducer = reducer;

    this.state = reducer(
      JSON.parse(
        this.localStorage.getItem('store') || JSON.stringify(initialState)
      ),
      {
        type: null,
      }
    );
  }

  setLocalStorage(newState) {
    this.localStorage.setItem(this.name, JSON.stringify(newState));
  }

  getState() {
    const localStore = this.localStorage.getItem(this.name);

    if (localStore) {
      return JSON.parse(localStore);
    } else {
      return this.state;
    }
  }

  dispatch(action) {
    this.state = this.reducer(this.state, action);
    this.setLocalStorage(this.state);
  }
}

export const store = new Store(reducer, initialState);
