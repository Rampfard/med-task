import { FAVORITE, UNFAVORITE } from './actionTypes.js';

export const favorite = (img) => ({ type: FAVORITE, payload: img });

export const unfavorite = (imgId) => ({ type: UNFAVORITE, payload: imgId });
