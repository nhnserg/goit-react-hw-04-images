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
  const [hasMoreImages, setHasMoreImages] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (query) {
      getImages();
    }
  }, [query]);

  const getImages = async () => {
    try {
      setIsLoading(true);

      const newImages = await fetchImages({ query, page });

      setImages((prevImages) => [...prevImages, ...newImages]);
      setPage((prevPage) => prevPage + 1);
      setHasMoreImages(newImages.length > 0);
    } catch (error) {
      console.error('Error fetching images:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchSubmit = (newQuery) => {
    setQuery(newQuery);
    setImages([]);
    setPage(1);
    setHasMoreImages(true);
  };

  const handleLoadMore = () => {
    if (hasMoreImages) {
      getImages();
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
      <Button onClick={handleLoadMore} isVisible={hasMoreImages && images.length > 0} />
      {showModal && <Modal image={selectedImage} onClose={handleCloseModal} />}
    </div>
  );
};

