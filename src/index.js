import axios from "axios";
import SimpleLightbox from "simplelightbox";
import Notiflix from 'notiflix';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const formSubmit = document.querySelector('.search-form');
const inputEl = document.querySelector('.search-input');
const galleryEl = document.querySelector('.gallery');
const loadMore = document.querySelector('.load-more');
loadMore.classList.add("hidden");

let inputValue;
let page=1;
let totalCards = 0;
let totalHit;
let data;

axios.defaults.baseURL = `https://pixabay.com/api`;
const getInf= async (value,page, totalCards)=> {
    try{
      data = await axios.get(`/?key=34548627-4253aa847fe52c38f81610ad9&q=${value}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=40`);
      return data.data;
    } catch(error) {
        console.log(error);
    }
  }

function findEl(value,page) {
    getInf(value,page).then(data=>createCards(data.hits, data.totalHits))
    .catch((error)=>console.log(error));
}

function createCards(array, totalHits) {
    const galleryItemsEl = array.map(({webformatURL, largeImageURL, tags, likes, views, comments, downloads})=>{
        return `<a class="photo-card" href="${largeImageURL}">
        <img src="${webformatURL}" alt="${tags}" loading="lazy" class="gallery__image"/>
        <div class="info">
          <p class="info-item">
            <b>Likes</b>
            <b class="grey">${likes}</b>
          </p>
          <p class="info-item">
            <b>Views</b>
            <b class="grey">${views}</b>
          </p>
          <p class="info-item">
            <b>Comments</b>
            <b class="grey">${comments}</b>
          </p>
          <p class="info-item">
            <b>Comments</b>
            <b class="grey">${downloads}</b>
          </p>
        </div>
      </a>`
    }).join('');
    galleryEl.insertAdjacentHTML('beforeend', galleryItemsEl);

  const gallery = new SimpleLightbox('.gallery a', {
    overlay: true,
    captionDelay: 250,
  });

  totalCards+=array.length;
  totalHit = totalHits;

  if (galleryItemsEl.length===0) {
    Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
    loadMore.classList.add("hidden");
  }
  else {
    if (totalCards===totalHit) {
      loadMore.classList.add("hidden");
      Notiflix.Notify.failure("We're sorry, but you've reached the end of search results.");
    } else{
    loadMore.classList.remove("hidden");}
  }
}

function render(e,page) {
  e.preventDefault();
    if (inputValue!=inputEl.value || (document.querySelector('.load-more.hidden') !== null)) {
      galleryEl.innerHTML = '';
      page=1;
      totalCards = 0;
    }
    inputValue = inputEl.value;
    if (inputValue.match(/[^\s]/g)===null) {
      loadMore.classList.add("hidden");
      galleryEl.innerHTML = '';
    } else {
      findEl(inputValue,page);
    }
}

formSubmit.addEventListener('submit', (e)=>{render(e ,page)})

loadMore.addEventListener('click', (e)=>{
  page ++;
  console.log(page);
    render(e,page);
})



