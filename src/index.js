
import Notiflix from "notiflix";
import cardItems from './templates/cards-item.hbs';
import ImageApiService from './fetch-images.js';



const imageApiService = new ImageApiService();

const refs = {
    searchForm: document.querySelector('.search-form'),
    cardList: document.querySelector('.gallery'),
    loadMoreButton: document.querySelector('.load-more'),
};

refs.searchForm.addEventListener('submit', onSearch);
refs.loadMoreButton.addEventListener('click', onLoadMore)

refs.loadMoreButton.classList.add('visually-hidden');


async function onSearch(e){
    e.preventDefault();
    imageApiService.searchQuery = e.currentTarget.elements.searchQuery.value;
    if(imageApiService.searchQuery === ''){
        return;
    }
    refs.cardList.innerHTML ='';
    refs.loadMoreButton.classList.add('visually-hidden');
    imageApiService.resetPage();
    try {
        const getCards = await imageApiService.getImages();
        if(getCards.totalHits === 0){
            getErrorMessage();
        }
        if(getCards.totalHits > 0){
        createCards(getCards.hits)
        Notiflix.Notify.info(`Hooray! We found ${getCards.totalHits} images.`);
        refs.loadMoreButton.classList.remove('visually-hidden');
        };
    } catch (error) {
       console.log(error);
    }
}

async function onLoadMore() {
    try {
        const getCards = await imageApiService.getImages();
        createCards(getCards.hits)
        const { height: cardHeight } = document
        .querySelector('.gallery')
        .firstElementChild.getBoundingClientRect();
        window.scrollBy({
        top: cardHeight * 2.9,
        behavior: 'smooth',
        });
        if(refs.cardList.children.length === getCards.totalHits){
            getErrorMessage()
        }
    
      } catch (error) {
          console.log(error);
      }
}

function createCards(images){
  const markup = cardItems(images);
  refs.cardList.insertAdjacentHTML('beforeend', markup);
}

function showMessage(message){
    if(message === info){
        Notiflix.Notify.info('');
    } else if (message === error){
      Notiflix.Notify.info(message);
    }
  }


  function getErrorMessage() {
    Notiflix.Notify.failure("We're sorry, but you've reached the end of search results.")
  }