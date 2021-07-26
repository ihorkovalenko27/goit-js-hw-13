
import Notiflix from "notiflix";
import cardItems from '../templates/cards-item.hbs';
import ImageApiService from './fetch-images.js';

const imageApiService = new ImageApiService();

const refs = {
    searchForm: document.querySelector('.search-form'),
    cardList: document.querySelector('.gallery'),
    loadMoreButton: document.querySelector('.load-more'),
};

refs.searchForm.addEventListener('submit', onSearch);
refs.loadMoreButton.addEventListener('click', onLoadMore)
setVisuallyHidden(true);


async function onSearch(e){
    e.preventDefault();

    imageApiService.searchQuery = e.currentTarget.elements.searchQuery.value;

    if(imageApiService.searchQuery === ''){
        return;
    }
    
    updateCardList('');
    setVisuallyHidden(true);
    imageApiService.resetPage();

    try {
        const getCards = await imageApiService.getImages();
        if(getCards.totalHits === 0){
            showSearchMessage('empty');
        }
        if(getCards.totalHits > 0){
           createCards(getCards.hits)
           showSearchMessage(getCards.totalHits);
           setVisuallyHidden(false);
        };
    } catch (error) {
       console.log(error);
    }
}

async function onLoadMore() {
    try {
        const getCards = await imageApiService.getImages();
        createCards(getCards.hits)

        const { height: cardHeight } = refs.cardList
        .firstElementChild.getBoundingClientRect();

        window.scrollBy({
        top: cardHeight * 3,
        behavior: 'smooth',
        });

        if(refs.cardList.children.length === getCards.totalHits){
            showSearchMessage('end');
        }
    
      } catch (error) {
          console.log(error);
      }
}

function createCards(images){
  const markup = cardItems(images);
  refs.cardList.insertAdjacentHTML('beforeend', markup);
}

function updateCardList(markup) {
    refs.cardList.innerHTML = markup;
}

function setVisuallyHidden(value) {
  if (value === true){
    refs.loadMoreButton.classList.add('visually-hidden');
  } else { 
      refs.loadMoreButton.classList.remove('visually-hidden');
    }
}

function showSearchMessage(message) {
    if(message === 'end'){
    Notiflix.Notify.failure("We're sorry, but you've reached the end of search results.");
    } else if(message === 'empty') {
    Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
    } else if (message === Number(message)){
    Notiflix.Notify.info(`Hooray! We found ${message} images.`);
    }
  }
