import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SearchBar from './components/SearchBar/SearchBar';
import ImageGallery from './components/ImageGallery/ImageGallery';
import Loader from './components/Loader/Loader';
import ErrorMessage from './components/ErrorMessage/ErrorMessage';
import LoadMoreBtn from './components/LoadMoreBtn/LoadMoreBtn';
import ImageModal from './components/ImageModal/ImageModal';
import styles from './App.module.css';
import { Toaster } from 'react-hot-toast';

const ACCESS_KEY = "FIkoNNs2i6c9-9FZmAZTiUqeQasAf-wsBHMmb1DzB-8";

const App = () => {
  const [query, setQuery] = useState('');
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const fetchImages = async (searchQuery, pageNumber) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('https://api.unsplash.com/search/photos', {
        params: { query: searchQuery, page: pageNumber, per_page: 12 },
        headers: {
          Authorization: `Client-ID ${ACCESS_KEY}`,
        },
      });
      const { results, total_pages } = response.data;
      if (pageNumber === 1) {
        setImages(results);
      } else {
        setImages(prevImages => [...prevImages, ...results]);
      }
      setTotalPages(total_pages);
    } catch (err) {
      setError('Щось пішло не так. Спробуйте пізніше.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = searchQuery => {
    if (searchQuery !== query) {
      setQuery(searchQuery);
      setPage(1);
      setImages([]);
      setTotalPages(null);
    }
  };

  const handleLoadMore = () => {
    setPage(prevPage => prevPage + 1);
  };

  const handleImageClick = image => {
    setSelectedImage(image);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
  };

  useEffect(() => {
    if (query !== '') {
      fetchImages(query, page);
    }
  }, [query, page]);

  return (
    <div className={styles.app}>
      <Toaster />
      <SearchBar onSubmit={handleSearchSubmit} />
      {error && <ErrorMessage message={error} />}
      <ImageGallery images={images} onImageClick={handleImageClick} />
      {loading && <Loader />}
      {images.length > 0 && page < totalPages && !loading && (
        <LoadMoreBtn onClick={handleLoadMore} />
      )}
      <ImageModal isOpen={isModalOpen} onClose={handleCloseModal} image={selectedImage} />
    </div>
  );
};

export default App;
