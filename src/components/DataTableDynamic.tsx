import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Product, SelectedRows } from '../types/product';
import Chart from './Chart';
import SearchBar from './SearchBar';

const DataTableDynamic: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10); // State for items per page
  const [tableTemplate, setTableTemplate] = useState<string[]>([]);
  const [selectedRows, setSelectedRows] = useState<SelectedRows>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [totalValues, setTotalValues] = useState<number>(0);
  const [previousSelectedRows, setPreviousSelectedRows] = useState<SelectedRows>([]);

  const isRowChecked = (productId: number) => {
    return selectedRows.includes(productId);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`https://dummyjson.com/products/?limit=${itemsPerPage}`);
        const val: any = response.data.products;
        setTotalValues(response.data.total);
        setProducts(val);

        if (val.length > 0) {
          const keys = Object.keys(val[0]);
          setTableTemplate(keys.filter(header => header !== 'thumbnail' && header !== 'images'));
        }

        setSelectedRows(val.slice(0, 5).map((product: Product) => product.id));
        setFilteredProducts(val.slice(0, itemsPerPage));
        setPreviousSelectedRows(val.slice(0, 5).map((product: Product) => product.id));
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, [itemsPerPage]);

  const paginate = async (pageNumber: number) => {
    setCurrentPage(pageNumber);
    const skip = (pageNumber - 1) * itemsPerPage;

    if (skip < products.length) {
      const newCurrentItems = products.slice(skip, skip + itemsPerPage);
      setFilteredProducts(newCurrentItems);
    } else {
      try {
        const response = await axios.get(`https://dummyjson.com/products/?skip=${skip}&limit=${itemsPerPage}`);
        const { products: newProducts } = response.data;
        setProducts(prevProducts => [...prevProducts, ...newProducts]);
        setFilteredProducts(newProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    }
  };

  const toggleRowSelection = (productId: number) => {
    if (isRowChecked(productId)) {
      setSelectedRows(selectedRows.filter(id => id !== productId));
    } else {
      setSelectedRows([...selectedRows, productId]);
    }
  };

  const resetSelection = () => {
    setSelectedRows(filteredProducts.slice(0, 5).map(product => product.id));
  };

  const emptySelection = () => {
    setSelectedRows([]);
  };

  const handleFilteredProducts: any = (filteredProducts: Product[]) => {
    setFilteredProducts(filteredProducts);
    if (filteredProducts.length > 0) {
      // const selectedIds = filteredProducts.slice(0, 5).map(product => product.id);
      // setSelectedRows(selectedIds);
    } else {
      setSelectedRows(previousSelectedRows);
    }
  };

  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setItemsPerPage(parseInt(e.target.value));
  };

  const itemsPerPageOptions = [5, 10, 15, 20];

  return (
    <div className="container mx-auto">
      <SearchBar products={products} setFilteredProducts={handleFilteredProducts} itemsPerPage={itemsPerPage} />
      <div className="flex flex-col md:flex-row">
        <div className="overflow-hidden w-1/2 md:w-1/2 pr-0 md:pr-4 mb-4 md:mb-0">
          <Chart numericValues={selectedRows.map((rowId) => products.find((product) => product.id === rowId))} />
        </div>
        <div className="w-full md:w-1/2 pl-0 md:pl-4">
          <div className="rounded-lg overflow-hidden shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-bold">Product List</h1>
              <button onClick={resetSelection} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">Reset Selection</button>
              <div className="flex items-center justify-end mb-4">
                <label htmlFor="itemsPerPage" className="mr-2">
                  Items Per Page:
                </label>
                <select
                  id="itemsPerPage"
                  name="itemsPerPage"
                  value={itemsPerPage}
                  onChange={handleItemsPerPageChange}
                  className="px-2 py-1 border border-gray-300 rounded-md"
                >
                  {itemsPerPageOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
              <button onClick={emptySelection} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">Empty Selection</button>
            </div>
            <div className="table-container overflow-auto">
              <table className="table-auto w-full">
                <thead>
                  <tr className="bg-blue-500 text-white">
                    <th className="border px-4 py-2">Select Rows</th>
                    {tableTemplate.map((header, index) => (
                      <th key={index} className="border px-4 py-2">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product: any) => (
                    <tr key={product.id} className={isRowChecked(product.id) ? 'bg-blue-200' : ''}>
                      <td className="border px-4 py-2">
                        <input
                          type="checkbox"
                          checked={isRowChecked(product.id)}
                          onChange={() => toggleRowSelection(product.id)}
                        />
                      </td>
                      {tableTemplate.map((header, index) => (
                        <td key={index} className="border px-4 py-2">
                          {product[header]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4">
            <ul className={`overflow-auto flex ${Math.ceil(totalValues / itemsPerPage) > 10 ? 'justify-normal' : 'justify-center'}`}>
                {Array.from({ length: Math.ceil( totalValues / itemsPerPage) }).map((_, index) => (
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
