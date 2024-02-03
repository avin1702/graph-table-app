import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Product,SelectedRows } from '../types/product';



const DataTable: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [tableTemplate,setTableTemplate] = useState([])

  const [selectedRows, setSelectedRows] = useState<SelectedRows>([1,2,3,4,5]);

  const isRowChecked = (event: React.ChangeEvent<HTMLInputElement>, productId: number) => {
    const isChecked = event.target.checked;
    let newSelected: SelectedRows = [];

    if (isChecked) {
      newSelected = [...selectedRows, productId];
    } else {
      newSelected = selectedRows.filter(id => id !== productId);
    }
    setSelectedRows(newSelected);

  }
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('https://dummyjson.com/products/?limit=100');
        let val:any = JSON.stringify(response.data.products)
        val = JSON.parse(val)
        // console.log(JSON.stringify(response.data.products))
        setProducts(val);

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
  

  const numericValues = selectedRows.map((rowId) => {
   
  const selectedProduct = products.find((product) => product.id === rowId);

  // console.log(selectedProduct)
  return selectedProduct 
})
console.log(numericValues)

  const resetSelection = ()=>{
    setSelectedRows([])
  }

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold mb-4">Product List</h1>
      <button onClick={resetSelection}>reset selection</button>
      <table className="table-auto w-full">
        <thead>
          <tr>
            <th>Select Rows</th>
            <th className="px-4 py-2">ID</th>
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Description</th>
            <th className="px-4 py-2">Price</th>
            <th className="px-4 py-2">Stock</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((product) => (
            <tr key={product.id}
            className={selectedRows.includes(product.id) ? 'bg-blue-200' : ''}>
              <td>
                <input
                  type="checkbox"
                  checked={products.indexOf(product) < 5 && selectedRows.includes(product.id)}
                  onChange={(e) => isRowChecked(e, product.id)}
                />
              </td>
              <td className="border px-4 py-2">{product.id}</td>
              <td className="border px-4 py-2">{product.title}</td>
              <td className="border px-4 py-2">{product.description}</td>
              <td className="border px-4 py-2">{product.price}</td>
              <td className="border px-4 py-2">{product.stock}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-4">
        <ul className="flex justify-center">
          {Array.from({ length: Math.ceil(products.length / itemsPerPage) }).map((_, index) => (
            <li
              key={index}
              className={`cursor-pointer px-4 py-2 ${
                currentPage === index + 1 ? 'bg-gray-600 text-white' : 'bg-gray-300'
              }`}
              onClick={() => paginate(index + 1)}
            >
              {index + 1}
            </li>
          ))}
        </ul>
      </div>
    </div>
    
  );
};

export default DataTable;
