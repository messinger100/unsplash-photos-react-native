import { useState, useEffect } from 'react';
import axios from 'axios';

const apiUrl = 'https://api.unsplash.com/search/photos/';
const ACCESS_KEY = "fEx0f6fugNGVNZ2AwARl7_wG8gr8zWAoIQkLUOpmEmE";

const useImageSearch = () => {
  const [images, setImages] = useState([]);
  const [searchHistory, setSearchHistory] = useState([]);

  const fetchAPI = async (query) => {
    try {
      const queryString = `?query=${query}&client_id=${ACCESS_KEY}`;
      const fullUrl = apiUrl + queryString;
      const response = await axios.get(fullUrl);
      const imageData = response.data.results;
      const imageDetailsPromises = imageData.map(async (item) => {
        return {
          id: item.id,
          url: item.urls.regular,
          title: "Titulo: " + item.alt_description || 'Sin título',
          author: "Autor: " + item.user.name || 'Autor desconocido',
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