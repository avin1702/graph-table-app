import React, { useState } from 'react';
import { Product } from '../types/product';

const SearchBar: React.FC<{ products: Product[], setFilteredProducts: React.Dispatch<React.SetStateAction<Product[]>>, itemsPerPage: number }> = ({ products, setFilteredProducts, itemsPerPage }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    if(term.length>0){
    const filteredProducts = products.filter(product => (
      product.title.toLowerCase().includes(term) || product.description.toLowerCase().includes(term)
    ));
    setFilteredProducts(filteredProducts);
  }else{
    // setFilteredProducts(products.slice(0, itemsPerPage))
  };
}

  return (
    <div className="flex justify-center my-4">
      <input
        type="text"
        placeholder="Search by title or description"
        value={searchTerm}
        onChange={handleSearch}
        className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
      />
    </div>
  );
};

export default SearchBar;
