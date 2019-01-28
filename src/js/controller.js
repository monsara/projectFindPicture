export default class Controller {
  constructor(model, view) {
    this._view = view;
    this._model = model;

    this._view.form.addEventListener(
      'submit',
      this.handleFormSubmit.bind(this));

    this._view.showMoreBtn.addEventListener(
      'click',
      this.handleShowMore.bind(this));

    this._view.pictList.addEventListener(
      'click',
      this.popUpOpen.bind(this));

    this._view.modalBackdrop.addEventListener(
      'click',
      this.popUpClose.bind(this));

    this._view.next.addEventListener(
      'click',
      this.popUpNext.bind(this));

    this._view.prev.addEventListener(
      'click',
      this.popUpPrev.bind(this));

    this._view.select.addEventListener(
      'click',
      this.popUpSelect.bind(this));

    this._view.headerLogo.addEventListener(
      'click',
      this.handleHeaderLogo.bind(this));

    this._view.btnFavourite.addEventListener(
      'click',
      this.handleFavouriteList.bind(this));

    this._view.listFavorites.addEventListener(
        'click',
        this.favoriteItemDelete.bind(this));
  }

  handleFormSubmit(e) {
    e.preventDefault();
    this._view.page.classList.remove('favorites--active');
    const input = this._view.input;
    if (input.value===this._model.lastRequest) {return};

    this._model.getRequest(input.value).then(createdItems => {
      if (createdItems === undefined) return;
      this._view.init(createdItems);
      if (createdItems.length !== 0) {
        this._view.showMoreBtn.classList.add('active');
      } else {
        this._view.showMoreBtn.classList.remove('active');
      }
    });
  }

  handleShowMore(e) {
    e.preventDefault();
    const val = this._view.input.value;
    this._model.getRequest(val).then(createdItems => {
      if (createdItems === undefined) return;
      this._view.addPicture(createdItems);
      if (createdItems.length !== 0) {
        this._view.showMoreBtn.classList.add('active');
      } else {
        this._view.showMoreBtn.classList.remove('active');
      }
    });
  }

  popUpOpen(e) {
    const target = e.target;
    const targetImg = target.querySelector('img');
    if (target.nodeName !== 'LI') return;
    this._view.page.classList.add('modale-open');
    this._view.modaleImage.setAttribute('src', targetImg.dataset.fullview);
    this._view.modaleImage.setAttribute('alt', targetImg.getAttribute('alt'));
    const activeImgUrl = this._view.modaleImage.getAttribute('src');
    const itemList = this._view.pictList.querySelectorAll('img');
    Array.from(itemList).map(img => {
      if (img.dataset.fullview === activeImgUrl) {
        const currentNumber = Array.from(itemList).indexOf(img);
        if (currentNumber + 1 === itemList.length) {
          this._view.next.setAttribute('disabled', 'disabled');
        }
        if (currentNumber === 0) {
          this._view.prev.setAttribute('disabled', 'disabled');
        }
      }
    });
    document.addEventListener('keydown', this.popUpClose.bind(this));
    const currentId =  this.getId(activeImgUrl)
    this.inFavoriteIs(currentId);
  }

  inFavoriteIs(id){
      const inFavorit = this._model.getFavoriteList().find(item => item.id == id);
        if(inFavorit) {
           this._view.select.setAttribute('disabled', 'disabled');
        }else {
           this._view.select.removeAttribute('disabled');
        }
  }

  popUpClose(e) {
    if (
      e.target === this._view.modalBackdrop ||
      e.target === this._view.close || e.key === 'Escape'
    ) {
      this._view.page.classList.remove('modale-open');
      this._view.prev.removeAttribute('disabled');
      this._view.next.removeAttribute('disabled');
    }
    document.removeEventListener('keydown', this.popUpClose.bind(this));
  }

  popUpNext() {
    const activeImgUrl = this._view.modaleImage.getAttribute('src');
    const itemList = this._view.pictList.querySelectorAll('img');
      const currentId =  this.getId(activeImgUrl)

    Array.from(itemList).map(img => {
      if (img.dataset.fullview === activeImgUrl) {
        const currentNumber = Array.from(itemList).indexOf(img);
        const next = Array.from(itemList)[currentNumber + 1];

          const currentId =  this.getId(next.dataset.fullview)
          this.inFavoriteIs(currentId);

        if (currentNumber + 1 < itemList.length) {
          this._view.next.removeAttribute('disabled');
          this._view.prev.removeAttribute('disabled');
          this._view.modaleImage.setAttribute('src', next.dataset.fullview);
        }
        if (currentNumber + 1 === itemList.length - 1) {
          this._view.next.setAttribute('disabled', 'disabled');
        }
      }
    });
  }

  popUpPrev() {
    const activeImgUrl = this._view.modaleImage.getAttribute('src');
    const itemList = this._view.pictList.querySelectorAll('img');
    Array.from(itemList).map(img => {
      if (img.dataset.fullview === activeImgUrl) {
        const currentNumber = Array.from(itemList).indexOf(img);
        const next = Array.from(itemList)[currentNumber - 1];

          const currentId =  this.getId(next.dataset.fullview)
          this.inFavoriteIs(currentId);

        this._view.modaleImage.setAttribute('src', next.dataset.fullview);
        if (currentNumber - 1 > 0) {
          this._view.next.removeAttribute('disabled');
          this._view.modaleImage.setAttribute('src', next.dataset.fullview);
        } else if (currentNumber - 1 === 0) {
          this._view.prev.setAttribute('disabled', 'disabled');
        }
      }
    });
  }

  getId(link) {
    const itemList = this._view.pictList.querySelectorAll('li');
    let currentId;
    Array.from(itemList).map(item => {
      if (link === item.querySelector('img').dataset.fullview) {
        currentId = item.dataset.idItem;
      }
    });
    return currentId;
  }

  popUpSelect(e) {
    const currentId = this.getId(this._view.modaleImage.getAttribute('src'));
    this._model.addToFavorite(currentId);
    this.inFavoriteIs(currentId);
  }

  favoriteItemDelete(e) {
    const target = e.target;
    if (target.nodeName !== "BUTTON") return;
    const currentItem = target.closest('li');
    const currentId = target.closest('li').dataset.idItem;
    this._model.removeFromFavorite(currentId);
    currentItem.remove();
  }

  handleHeaderLogo(e) {
    e.preventDefault();
    this._view.init([]);
    this._view.input.value = '';
    this._view.showMoreBtn.classList.remove('active');
    this._view.page.classList.remove('favorites--active');
    this._view.btnFavourite.innerHTML = '<span class="header-star">&#x2605;</span>Избранное';
    this._view.btnFavourite.classList.remove('js-home');
    this._model.lastRequest="";
  }

  handleFavouriteList(e) {
    e.preventDefault();
      this._view.addFavoritesPicture(this._model.getFavoriteList() )
    if (this._view.btnFavourite.classList.contains('js-home')) {
      this._view.btnFavourite.classList.remove('js-home');
      this._view.page.classList.remove('favorites--active');
      this._view.btnFavourite.innerHTML = '<span class="header-star">&#x2605;</span>Избранное';
      return;
    }

    this._view.page.classList.add('favorites--active');
    this._view.btnFavourite.textContent = 'На главную';
    this._view.btnFavourite.classList.add('js-home');
  }
}
