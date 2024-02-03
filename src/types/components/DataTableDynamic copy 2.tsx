import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Product, SelectedRows } from '../types/product';
import Chart from './Chart';

const DataTableDynamic: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [tableTemplate, setTableTemplate] = useState<string[]>([]);
  const [selectedRows, setSelectedRows] = useState<SelectedRows>([]);

  const isRowChecked = (event: React.ChangeEvent<HTMLInputElement>, productId: number) => {
    const isChecked = event.target.checked;
    let newSelected: SelectedRows = [];

    if (isChecked) {
      newSelected = [...selectedRows, productId];
    } else {
      newSelected = selectedRows.filter(id => id !== productId);
    }
    setSelectedRows(newSelected);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('https://dummyjson.com/products/?limit=100');
        const val: any = response.data.products;
        setProducts(val);
        if (val.length > 0) {
          // Extract keys from the first product to create table headers
          const keys = Object.keys(val[0]);
          setTableTemplate(keys.filter(header => header !== 'thumbnail' && header !== 'images'));
        }
        setSelectedRows([1,2,3,4,5])
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = products.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const resetSelection = () => {
    setSelectedRows([]);
  };

  const numericValues = selectedRows.map((rowId) => {
    const selectedProduct = products.find((product) => product.id === rowId);
    return selectedProduct;
  });

  return (
    <div className="container mx-auto">
      <div className="flex">
        <div className="w-1/2 pr-4">
          <Chart numericValues={numericValues} />
        </div>
        <div className="w-1/2 pl-4">
          <div className="rounded-lg overflow-hidden shadow-lg">
          <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Product List</h1>
        <button onClick={resetSelection} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
          Reset Selection
        </button>
      </div>
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
                {currentItems.map((product:any) => (
                  <tr key={product.id} className={selectedRows.includes(product.id) ? 'bg-blue-200' : ''}>
                    <td className="px-4 py-2">
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(product.id)}
                        onChange={(e) => isRowChecked(e, product.id)}
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
              {Array.from({ length: Math.ceil(products.length / itemsPerPage) }).map((_, index) => (
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
  );
};

export default DataTableDynamic;
