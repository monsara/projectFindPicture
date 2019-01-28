import template from "./../templates/card.hbs";

export default class View {
  constructor() {
    this.form = document.querySelector('.js-form');
    this.input = this.form.querySelector('.js-input');
    this.pictList = document.querySelector('.picture__list');
    this.showMoreBtn = document.querySelector('.js-more');
    this.page = document.querySelector('body');

    this.listFavorites = document.querySelector('.favorites__list');
    this.btnFavourite = document.querySelector('.js-favourites');
    this.modalBackdrop = document.querySelector('.modal-backdrop');
    this.modaleImage = document.querySelector('.modal__img');
    this.home = document.querySelector('.js-home');
    this.prev = document.querySelector('.js-prev');
    this.next = document.querySelector('.js-next');
    this.select = document.querySelector('.js-select');
    this.close = document.querySelector('.js-close');
    this.headerLogo = document.querySelector('.header__logo');
  }

  init(items) {
    const markup = items.reduce((acc, item) => {
      return acc + this.createCard(item);
    }, '');
    this.pictList.innerHTML = markup;
  }

  addPicture(items) {
    const markup = items.reduce((acc, item) => {
      return acc + this.createCard(item);
    }, '');
    this.pictList.insertAdjacentHTML('beforeend', markup);
  }

  addFavoritesPicture(items) {
      const markup = items.reduce((acc, item) => {
          return acc + this.createCard(item);
      }, '');
      this.listFavorites.innerHTML = markup;
  }

  createCard(item) {
    const markup = template(item);
    return markup;
  }

}