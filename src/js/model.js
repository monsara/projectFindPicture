import {
  keyLS,
  isActiveLS,
  getLS,
  setLS,
  removeLS
} from './services/apiLocalStorage';
import { getImages } from './services/api_pixabay';

export default class Model {
  constructor() {
    this.images = [];
    this.page = 1;
    this.lastRequest = "";
    this.totalHits=0;
  }

  getRequest(request) {
    if (request == "") {
      return new Promise(function() {});
    }
    if (this.lastRequest === request) {
      this.page++;
      if ((this.images.length+12)>=this.totalHits) {
        return new Promise(function() {});
      }
      return getImages(request, this.page).then(data => {
        this.images = [...new Set([...this.images, ...data.hits])];
        return data.hits;
      });
    } else {
      this.page = 1;
      this.lastRequest = request;
      this.images = [];

      return getImages(request, this.page).then(data => {
        this.totalHits=data.totalHits;
        return (this.images = data.hits);
      });
    }
  }

  getFavoriteList() {
    return keyLS();
  }

  addToFavorite(imageID) {
    const favoriteElement = this.images.find(elem => {
      return String(elem.id) === String(imageID);
    });
    if (!getLS(imageID)) setLS(imageID, favoriteElement);
  }

  removeFromFavorite(imageID) {
    removeLS(imageID);
  }
}
