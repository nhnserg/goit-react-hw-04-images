import React, { useState, useEffect } from 'react';
import SearchBar from './SearchBar/SearchBar';
import ImageGallery from './ImageGallery/ImageGallery';
import Button from './Button/Button';
import Loader from './Loader/Loader';
import Modal from './Modal/Modal';
import fetchImages from '../Services/api';
import styles from './App.module.css';

export const App = () => {
  const [query, setQuery] = useState('');
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');
  const [hasMoreImages, setHasMoreImages] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const getImages = async () => {
      try {
        setIsLoading(true);

        const newImages = await fetchImages({ query, page });

        setImages((prevImages) => [...prevImages, ...newImages]);
        setHasMoreImages(newImages.length > 0);
      } catch (error) {
        console.error('Error fetching images:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (query) {
      getImages();
    }
  }, [query, page]);

  const handleSearchSubmit = (newQuery) => {
    setQuery(newQuery);
    setImages([]);
    setPage(1);
    setHasMoreImages(true);
  };

  const handleLoadMore = () => {
    if (hasMoreImages) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const handleImageClick = (clickedImage) => {
    setShowModal(true);
    setSelectedImage(clickedImage);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedImage('');
  };

  return (
    <div className={styles.App}>
      <SearchBar onSubmit={handleSearchSubmit} />
      <ImageGallery images={images} onImageClick={handleImageClick} />
      {isLoading && <Loader />}
      {hasMoreImages && images.length > 0 && <Button onClick={handleLoadMore} />}
      {showModal && <Modal image={selectedImage} onClose={handleCloseModal} />}
    </div>
  );
};

export default App;
