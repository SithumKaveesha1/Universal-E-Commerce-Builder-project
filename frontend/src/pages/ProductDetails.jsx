import React, { useState, useEffect, useContext } from 'react';
import { useParams, useOutletContext } from 'react-router-dom';
import axios from 'axios';
import { CartContext } from '../context/CartContext';

const ProductDetails = () => {
  const { id } = useParams();
  const { store } = useOutletContext();
  const { addToCart } = useContext(CartContext);
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`/products/${id}`);
        setProduct(data);
      } catch (error) {
        console.error('Error fetching product', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    setAdding(true);
    await addToCart(product._id, quantity);
    setAdding(false);
    alert('Added to cart!'); // Replace with toast later
  };

  if (loading) return <div className="py-12 text-center text-gray-500">Loading product...</div>;
  if (!product) return <div className="py-12 text-center text-red-500">Product not found</div>;

  return (
    <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
      <div className="md:flex">
        {/* Product Images */}
        <div className="md:w-1/2 p-8 flex items-center justify-center bg-gray-50 border-r">
          <img 
            src={product.images[0] || 'https://via.placeholder.com/400'} 
            alt={product.name} 
            className="w-full max-w-md object-contain rounded-lg shadow-sm"
          />
        </div>
        
        {/* Product Info */}
        <div className="md:w-1/2 p-8 lg:p-12">
          <div className="mb-2 text-sm text-gray-500 uppercase tracking-wide font-semibold">
            {product.category?.name}
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
          
          <p className="text-2xl font-bold mb-6" style={{ color: store.settings?.themeColor || '#3b82f6' }}>
            {store.settings?.currency === 'USD' ? '$' : (store.settings?.currency === 'EUR' ? '€' : '')} 
            {product.price}
          </p>
          
          <div className="prose prose-sm text-gray-600 mb-8">
            <p>{product.description}</p>
          </div>
          
          <div className="mb-6 flex items-center text-sm">
            <span className={product.countInStock > 0 ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
              {product.countInStock > 0 ? `In Stock (${product.countInStock} available)` : "Out of Stock"}
            </span>
          </div>
          
          {product.countInStock > 0 && (
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <div className="flex items-center border rounded-md">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-3 text-gray-600 hover:bg-gray-100"
                >-</button>
                <input 
                  type="number" 
                  value={quantity}
                  readOnly
                  className="w-16 text-center focus:outline-none"
                />
                <button 
                  onClick={() => setQuantity(Math.min(product.countInStock, quantity + 1))}
                  className="px-4 py-3 text-gray-600 hover:bg-gray-100"
                >+</button>
              </div>
              
              <button 
                onClick={handleAddToCart}
                disabled={adding}
                className="flex-1 py-3 px-8 text-white font-medium rounded-md hover:opacity-90 transition flex justify-center items-center"
                style={{ backgroundColor: store.settings?.themeColor || '#3b82f6' }}
              >
                {adding ? 'Adding...' : 'Add to Cart'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
