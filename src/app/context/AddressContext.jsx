'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';

const AddressContext = createContext();

export const useAddress = () => {
  const context = useContext(AddressContext);
  if (!context) {
    throw new Error('useAddress must be used within AddressProvider');
  }
  return context;
};

export const AddressProvider = ({ children }) => {
  const [addressData, setAddressData] = useState({
    address: '',
    confirmedAddress: null,
    propertyId: null,
    propertyData: null,
    scoreData: null,
    queryId: null
  });
  
  const [searchHistory, setSearchHistory] = useState([]);

  // Persist to localStorage
  useEffect(() => {
    const savedData = localStorage.getItem('propmatch-address-data');
    const savedHistory = localStorage.getItem('propmatch-search-history');
    if (savedData) {
      setAddressData(JSON.parse(savedData));
    }
    if (savedHistory) {
      setSearchHistory(JSON.parse(savedHistory));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('propmatch-address-data', JSON.stringify(addressData));
  }, [addressData]);
  
  useEffect(() => {
    localStorage.setItem('propmatch-search-history', JSON.stringify(searchHistory));
  }, [searchHistory]);

  const updateAddressData = (newData) => {
    setAddressData(prev => ({ ...prev, ...newData }));
    
    // Add to search history if confirmedAddress is provided
    if (newData.confirmedAddress) {
      addToSearchHistory({
        address: newData.confirmedAddress,
        timestamp: new Date().toISOString(),
        propertyData: newData.propertyData,
        scoreData: newData.scoreData,
        queryId: newData.queryId || prev.queryId
      });
    }
  };

  const addToSearchHistory = (searchEntry) => {
    setSearchHistory(prev => {
      // Remove any existing entry for this address
      const filtered = prev.filter(item => item.address !== searchEntry.address);
      // Add new entry at the beginning and limit to 10 entries
      return [searchEntry, ...filtered].slice(0, 10);
    });
  };

  const clearAddressData = () => {
    setAddressData({
      address: '',
      confirmedAddress: null,
      propertyId: null,
      propertyData: null,
      scoreData: null,
      queryId: null
    });
    localStorage.removeItem('propmatch-address-data');
  };

  return (
    <AddressContext.Provider value={{
      addressData,
      searchHistory,
      updateAddressData,
      clearAddressData,
      addToSearchHistory
    }}>
      {children}
    </AddressContext.Provider>
  );
};