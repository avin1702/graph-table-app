import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Product, SelectedRows } from '../types/product';
import Chart from './Chart';
import SearchBar from './SearchBar';

const DataTableDynamic: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [tableTemplate, setTableTemplate] = useState<string[]>([]);
  const [selectedRows, setSelectedRows] = useState<SelectedRows>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  const isRowChecked = (productId: number) => {
    return selectedRows.includes(productId);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('https://dummyjson.com/products/?limit=100');
        const val: any = response.data.products;
        setProducts(val);

        if (val.length > 0) {
          const keys = Object.keys(val[0]);
          setTableTemplate(keys.filter(header => header !== 'thumbnail' && header !== 'images'));
        }

        setSelectedRows(val.slice(0, 5).map((product: Product) => product.id));
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    setFilteredProducts(products);
  }, [products]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  
  // Update currentItems to display filtered products
  const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const toggleRowSelection = (productId: number) => {
    if (isRowChecked(productId)) {
      setSelectedRows(selectedRows.filter(id => id !== productId));
    } else {
      const productIndex = currentItems.findIndex(product => product.id === productId);
      if (productIndex >= 0) {
        setSelectedRows([...selectedRows, productId]);
      }
    }
  };

  const resetSelection = () => {
    // Reset selection to the first five elements
    setSelectedRows(filteredProducts.slice(0, 5).map(product => product.id));
  };

  const emptySelection = () => {
    // Reset selection to the first five elements
    setSelectedRows([]);
  };
  const handleFilteredProducts:any = (filteredProducts: Product[]) => {
    setFilteredProducts(filteredProducts);
    if (filteredProducts.length > 0) {
      // Select the first five filtered elements
      setSelectedRows(filteredProducts.slice(0, 5).map(product => product.id));
    } else {
      // If no filtered elements, reset to first five elements
      resetSelection();
    }
  };

  return (
    <div className="container mx-auto">
      <SearchBar products={products} setFilteredProducts={handleFilteredProducts} />
      <div className="flex flex-col md:flex-row">
        <div className="w-full md:w-1/2 pr-0 md:pr-4 mb-4 md:mb-0">
          <Chart numericValues={selectedRows.map((rowId) => products.find((product) => product.id === rowId))} />
        </div>
        <div className="w-full md:w-1/2 pl-0 md:pl-4">
          <div className="rounded-lg overflow-hidden shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-bold">Product List</h1>
              <button onClick={resetSelection} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">Reset Selection</button>
              <button onClick={emptySelection} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">Empty Selection</button>
            </div>
            <div className="table-container overflow-x-auto">
              <table className="table-auto w-full">
                <thead>
                  <tr className="bg-blue-500 text-white">
                    <th className="px-4 py-2">Select Rows</th>
                    {tableTemplate.map((header, index) => (
                      <th key={index} className="px-4 py-2">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((product: any) => (
                    <tr key={product.id} className={isRowChecked(product.id) ? 'bg-blue-200' : ''}>
                      <td className="px-4 py-2">
                        <input
                          type="checkbox"
                          checked={isRowChecked(product.id)}
                          onChange={() => toggleRowSelection(product.id)}
                        />
                      </td>
                      {tableTemplate.map((header, index) => (
                        <td key={index} className="px-4 py-2">
                          {product[header]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4">
              <ul className="flex justify-center">
                {Array.from({ length: Math.ceil(filteredProducts.length / itemsPerPage) }).map((_, index) => (
                  <li
                    key={index}
                    className={`cursor-pointer px-4 py-2 ${currentPage === index + 1 ? 'bg-blue-600 text-white' : 'bg-gray-300'}`}
                    onClick={() => paginate(index + 1)}
                  >
                    {index + 1}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataTableDynamic;
