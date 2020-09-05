const auth = "563492ad6f91700001000001f0006e02d1bc456f9cc413ae1e98b1ad";
const gallery = document.querySelector(".gallery");
const searchInput = document.querySelector(".search-input");
const form = document.querySelector(".search-form");
const more = document.querySelector(".buttonMore");

let page = 1;
let searchValue;
let currentSearch;
let fetchLink;

searchInput.addEventListener("input", updateInput);

function updateInput(e) {
  searchValue = e.target.value;
}

const fetchApi = async (url) => {
  const dataFetch = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: auth,
    },
  });
  const data = await dataFetch.json();
  console.log(data);
  return data;
};

const generateImages = (data) => {
  data.photos.forEach((photo) => {
    const galleryImg = document.createElement("div");
    galleryImg.classList.add("galleryImg");
    galleryImg.innerHTML = ` 
    <div class='galleryInfo'>
    <p>${photo.photographer}</p>
    <a href=${photo.src.original} target='blank' >Download</a>
    </div>
    <img src='${photo.src.portrait}'></img>`;
    gallery.appendChild(galleryImg);
  });
};

const curatedPhotos = async () => {
  fetchLink = "https://api.pexels.com/v1/curated?per_page=15&page=1";
  const data = await fetchApi(fetchLink);
  generateImages(data);
};

const searchPhoto = async (query) => {
  clear();
  fetchLink = `https://api.pexels.com/v1/search?query=${query}&per_page=15&page=1`;
  const data = await fetchApi(fetchLink);
  generateImages(data);
};

const loadMore = async () => {
  page++;
  if (currentSearch) {
    fetchLink = `https://api.pexels.com/v1/search?query=${currentSearch}&per_page=15&page=${page}`;
  } else {
    fetchLink = `https://api.pexels.com/v1/curated?per_page=15&page=${page}`;
  }
  const data = await fetchApi(fetchLink);
  generateImages(data);
};

function clear() {
  gallery.innerHTML = "";
  searchInput.value = "";
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  searchPhoto(searchValue);
  currentSearch = searchValue;
});

more.addEventListener("click", loadMore);

curatedPhotos();
