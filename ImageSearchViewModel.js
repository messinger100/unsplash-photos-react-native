import { useState, useEffect } from 'react';
import axios from 'axios';

const ACCESS_KEY = "fEx0f6fugNGVNZ2AwARl7_wG8gr8zWAoIQkLUOpmEmE";

const useImageSearch = () => {
  const [images, setImages] = useState([]);
  const [searchHistory, setSearchHistory] = useState([]);

  const fetchAPI = async (query) => {
    try {
      const response = await axios.get(`https://api.unsplash.com/search/photos/?query=${query}&client_id=${ACCESS_KEY}`);
      const imageData = response.data.results;

      const imageDetailsPromises = imageData.map(async (item) => {
        const detailsResponse = await axios.get(`https://api.unsplash.com/photos/${item.id}?client_id=${ACCESS_KEY}`);
        return {
          id: item.id,
          url: item.urls.regular,
          title: "Titulo: " + detailsResponse.data.alt_description || 'Sin título',
          author: "Autor: " + detailsResponse.data.user.name || 'Autor desconocido',
        };
      });
      const imageDetails = await Promise.all(imageDetailsPromises);
      setImages(imageDetails);
      setSearchHistory((prevHistory) => [query, ...prevHistory]);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchAPI();
  }, []);

  return {
    images,
    searchHistory,
    fetchAPI,
  };
};

export default useImageSearch;