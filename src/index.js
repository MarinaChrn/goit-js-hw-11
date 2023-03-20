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

axios.defaults.baseURL = `https://pixabay.com/api`;
const getInf= async (value,page, totalCards)=> {
    try{
        return await axios.get(`/?key=34548627-4253aa847fe52c38f81610ad9&q=${value}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=40`)
        .then(({data})=> {
            return data;
        });
    } catch(error) {
        console.log(error);
    }
  }

function findEl(value,page) {
    getInf(value,page).then((data)=>createCards(data.hits, data.totalHits))
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

    // totalCards+=40;
    // console.log(totalHits, totalCards);

  const gallery = new SimpleLightbox('.gallery a', {
    overlay: true,
    captionDelay: 250,
  });

  if (galleryItemsEl.length===0) {
    Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
  }
  else {
    loadMore.classList.remove("hidden");
  }

  totalHit = totalHits;
  return totalHit;
}

function render(e,page) {
  loadMore.classList.add("hidden");
  if (inputValue!=inputEl.value) {
    galleryEl.innerHTML = '';
    page=1;
    totalCards = 40;
    
  }
  e.preventDefault();
  inputValue = inputEl.value;
  totalCards+=40;
  findEl(inputValue,page);
  return totalCards;
}

formSubmit.addEventListener('submit', (e)=>{render(e ,page)})

loadMore.addEventListener('click', (e)=>{
  if (totalCards<=totalHit) {
    page += 1;
    render(e,page+1);
  }
  else {
    Notiflix.Notify.failure("We're sorry, but you've reached the end of search results.");
  }
})



