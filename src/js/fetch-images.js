const axios = require('axios');

const key = '22609546-eb8daebfdd1e346a58a9b181d';

const BASE_URL = 'https://pixabay.com/api/';


export default class ImageApiService {
  constructor() {
    console.log(this);
    this.searchQuery = '';
    this.page = 1;
  }

    async getImages() {
      try {
        const url = `${BASE_URL}?key=${key}&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${this.page}&per_page=40`;
        const response = await axios.get(url);
        console.log(response);
        this.page += 1;
        console.log(this);
        return response.data;
      } catch (error) {
        console.log(error);
      }
   }

   resetPage() {
    this.page = 1;
   }

}

 