import React, { useState, useEffect, useContext } from 'react';
import { useParams, useOutletContext } from 'react-router-dom';
import axios from 'axios';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { Star } from 'lucide-react';

const ProductDetails = () => {
  const { id } = useParams();
  const { store } = useOutletContext();
  const { addToCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewError, setReviewError] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState(false);

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

  const submitReview = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`/products/${id}/reviews`, { rating, comment });
      setReviewSuccess(true);
      setReviewError('');
      // Refetch product
      const { data } = await axios.get(`/products/${id}`);
      setProduct(data);
      setComment('');
    } catch (err) {
      setReviewError(err.response?.data?.message || 'Error submitting review');
    }
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
          
          <div className="flex items-center mb-4 space-x-1">
            {[1,2,3,4,5].map(star => (
              <Star key={star} size={18} fill={product.rating >= star ? "#fbbf24" : "none"} stroke={product.rating >= star ? "#fbbf24" : "#d1d5db"} />
            ))}
            <span className="text-sm text-gray-500 ml-2">({product.numReviews} reviews)</span>
          </div>

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

      {/* Reviews Section */}
      <div className="p-8 lg:p-12 border-t bg-gray-50">
        <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
        
        {product.reviews?.length === 0 ? (
          <div className="bg-white p-6 rounded-lg border text-gray-500 mb-8">No reviews yet. Be the first to review this product!</div>
        ) : (
          <div className="space-y-4 mb-8">
            {product.reviews?.map(review => (
              <div key={review._id} className="bg-white p-6 rounded-lg border shadow-sm">
                <div className="flex items-center mb-2">
                  <div className="font-bold mr-4">{review.name}</div>
                  <div className="flex text-yellow-400">
                    {[1,2,3,4,5].map(star => (
                      <Star key={star} size={14} fill={review.rating >= star ? "currentColor" : "none"} stroke="currentColor" />
                    ))}
                  </div>
                  <div className="text-xs text-gray-400 ml-auto">{new Date(review.createdAt).toLocaleDateString()}</div>
                </div>
                <p className="text-gray-600">{review.comment}</p>
              </div>
            ))}
          </div>
        )}

        <div className="bg-white p-6 rounded-lg border">
          <h3 className="text-xl font-bold mb-4">Write a Review</h3>
          {user ? (
            <form onSubmit={submitReview}>
              {reviewError && <p className="text-red-500 mb-4">{reviewError}</p>}
              {reviewSuccess && <p className="text-green-500 mb-4">Review submitted successfully!</p>}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Rating</label>
                <select 
                  value={rating} 
                  onChange={(e) => setRating(e.target.value)}
                  className="w-full md:w-1/3 px-4 py-2 border rounded-md"
                >
                  <option value="5">5 - Excellent</option>
                  <option value="4">4 - Very Good</option>
                  <option value="3">3 - Good</option>
                  <option value="2">2 - Fair</option>
                  <option value="1">1 - Poor</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Comment</label>
                <textarea 
                  rows="4"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  required
                  className="w-full px-4 py-2 border rounded-md"
                ></textarea>
              </div>
              <button 
                type="submit"
                className="px-6 py-2 text-white font-medium rounded-md hover:opacity-90 transition"
                style={{ backgroundColor: store.settings?.themeColor || '#3b82f6' }}
              >
                Submit Review
              </button>
            </form>
          ) : (
            <p className="text-gray-600">Please <a href="/login" className="text-blue-500 underline">login</a> to write a review.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
