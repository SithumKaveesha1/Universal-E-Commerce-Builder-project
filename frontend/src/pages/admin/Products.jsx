import React, { useState, useEffect, useContext } from 'react';
import { ProductContext } from '../../context/ProductContext';

const Products = () => {
  const { products, fetchProducts, categories, fetchCategories, createProduct, deleteProduct } = useContext(ProductContext);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    category: '',
    countInStock: 0,
    images: ''
  });

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const submitData = { ...formData, images: formData.images.split(',') }; // Mock simple split for images
    await createProduct(submitData);
    setShowAddForm(false);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Manage Products</h2>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          {showAddForm ? 'Cancel' : 'Add Product'}
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleSubmit} className="mb-8 p-4 border rounded bg-gray-50 grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input type="text" name="name" onChange={handleChange} required className="w-full px-3 py-2 border rounded" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <select name="category" onChange={handleChange} required className="w-full px-3 py-2 border rounded">
              <option value="">Select Category</option>
              {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Price</label>
            <input type="number" name="price" onChange={handleChange} required className="w-full px-3 py-2 border rounded" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Stock</label>
            <input type="number" name="countInStock" onChange={handleChange} required className="w-full px-3 py-2 border rounded" />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea name="description" onChange={handleChange} required className="w-full px-3 py-2 border rounded"></textarea>
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium mb-1">Image URLs (comma separated)</label>
            <input type="text" name="images" onChange={handleChange} required className="w-full px-3 py-2 border rounded" />
          </div>
          <div className="col-span-2 text-right mt-2">
            <button type="submit" className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700">Save Product</button>
          </div>
        </form>
      )}

      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-50 border-b border-t">
            <th className="py-3 px-4">Name</th>
            <th className="py-3 px-4">Price</th>
            <th className="py-3 px-4">Stock</th>
            <th className="py-3 px-4">Category</th>
            <th className="py-3 px-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p._id} className="border-b">
              <td className="py-3 px-4 flex items-center space-x-3">
                <img src={p.images[0] || 'https://via.placeholder.com/40'} alt="" className="w-10 h-10 object-cover rounded" />
                <span>{p.name}</span>
              </td>
              <td className="py-3 px-4">${p.price}</td>
              <td className="py-3 px-4">{p.countInStock}</td>
              <td className="py-3 px-4">{p.category?.name}</td>
              <td className="py-3 px-4 text-right">
                <button onClick={() => deleteProduct(p._id)} className="text-red-600 hover:text-red-800 text-sm">Delete</button>
              </td>
            </tr>
          ))}
          {products.length === 0 && (
            <tr><td colSpan="5" className="py-4 text-center text-gray-500">No products found.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Products;
