import React, { useState, useEffect, useContext } from 'react';
import { ProductContext } from '../../context/ProductContext';

const Categories = () => {
  const { categories, fetchCategories, createCategory } = useContext(ProductContext);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createCategory(name, slug);
    setName('');
    setSlug('');
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <h2 className="text-2xl font-bold mb-6">Manage Categories</h2>

      <form onSubmit={handleSubmit} className="mb-8 flex space-x-4 items-end">
        <div className="flex-1">
          <label className="block text-sm font-medium mb-1">Category Name</label>
          <input 
            type="text" 
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''));
            }}
            required
            className="w-full px-4 py-2 border rounded-md"
          />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium mb-1">Slug</label>
          <input 
            type="text" 
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-md"
          />
        </div>
        <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          Add Category
        </button>
      </form>

      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-50 border-b border-t">
            <th className="py-3 px-4">Name</th>
            <th className="py-3 px-4">Slug</th>
            <th className="py-3 px-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((cat) => (
            <tr key={cat._id} className="border-b">
              <td className="py-3 px-4">{cat.name}</td>
              <td className="py-3 px-4">{cat.slug}</td>
              <td className="py-3 px-4 text-right text-sm text-blue-600 cursor-pointer">Edit</td>
            </tr>
          ))}
          {categories.length === 0 && (
            <tr>
              <td colSpan="3" className="py-4 text-center text-gray-500">No categories found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Categories;
