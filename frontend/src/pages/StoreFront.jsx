import React, { useState, useEffect } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import axios from 'axios';

const StoreFront = () => {
  const { store } = useOutletContext();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          axios.get(`/products/store/${store._id}`),
          axios.get(`/categories/store/${store._id}`)
        ]);
        setProducts(prodRes.data);
        setCategories(catRes.data);
      } catch (error) {
        console.error('Error fetching data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchHomeData();
  }, [store._id]);

  useEffect(() => {
    const fetchFilteredProducts = async () => {
      try {
        const { data } = await axios.get(`/products/store/${store._id}?category=${selectedCategory}&search=${search}`);
        setProducts(data);
      } catch (error) {
        console.error('Error filtering products', error);
      }
    };
    // Debounce search slightly in a real app, calling directly here for simplicity
    if (!loading) {
      fetchFilteredProducts();
    }
  }, [selectedCategory, search]);

  if (loading) return <div className="py-12 text-center text-gray-500">Loading products...</div>;

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold text-gray-800">Featured Products</h1>
        
        <div className="flex space-x-4 w-full md:w-auto">
          <input 
            type="text" 
            placeholder="Search products..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-2 border rounded-md focus:outline-none focus:ring-1 w-full md:w-64"
            style={{ '--tw-ring-color': store.settings?.themeColor }}
          />
          <select 
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border rounded-md focus:outline-none focus:ring-1"
            style={{ '--tw-ring-color': store.settings?.themeColor }}
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat._id} value={cat._id}>{cat.name}</option>
            ))}
          </select>
        </div>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-lg border">
          <p className="text-gray-500 text-lg">No products found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map(product => (
            <Link to={`/${store.slug}/product/${product._id}`} key={product._id} className="group flex flex-col bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-md transition">
              <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden bg-gray-200 xl:aspect-w-7 xl:aspect-h-8">
                <img
                  src={product.images[0] || 'https://via.placeholder.com/300'}
                  alt={product.name}
                  className="h-48 w-full object-cover object-center group-hover:opacity-75 transition-opacity"
                />
              </div>
              <div className="p-4 flex flex-col flex-1">
                <h3 className="text-sm text-gray-700 mb-1">{product.category?.name}</h3>
                <p className="text-lg font-medium text-gray-900 mb-2 truncate">{product.name}</p>
                <div className="mt-auto flex justify-between items-center">
                  <p className="text-lg font-bold" style={{ color: store.settings?.themeColor || '#000' }}>
                    {store.settings?.currency === 'USD' ? '$' : (store.settings?.currency === 'EUR' ? '€' : '')} 
                    {product.price}
                  </p>
                  <button 
                    className="p-2 rounded-full text-white"
                    style={{ backgroundColor: store.settings?.themeColor || '#3b82f6' }}
                    onClick={(e) => {
                      e.preventDefault(); // Prevent navigating to product details
                      // Handle Add to cart (will implement via context)
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default StoreFront;
