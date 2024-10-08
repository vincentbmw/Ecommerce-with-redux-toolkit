import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import {
  addProduct,
  updateProduct,
  deleteProduct,
  fetchSellerProducts,
} from '../../features/slices/sellerSlice';
import { Product } from '../../features/slices/types';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SellerPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { products, status, error } = useAppSelector((state) => state.seller);
  const currentUser = useAppSelector((state) => state.auth.user);

  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    title: '',
    price: 0,
    description: '',
    category: '',
    image: '',
    quantity: 0,
  });
  const [isEditing, setIsEditing] = useState<number | null>(null);
  const [editProductState, setEditProductState] = useState<Partial<Product> | null>(null);

  useEffect(() => {
    if (currentUser?.role === 'seller') {
      dispatch(fetchSellerProducts());
    }
  }, [dispatch, currentUser]);

  const handleAddProduct = async () => {
    if (!newProduct.title || !newProduct.price || !newProduct.category) {
      toast.error('Title, price, and category are required');
      return;
    }
    try {
      await dispatch(addProduct(newProduct)).unwrap();
      toast.success('Product added successfully!');
      setNewProduct({ title: '', price: 0, description: '', category: '', image: '', quantity: 0 });
    } catch (error) {
      toast.error('Failed to add product');
    }
  };

  const handleEditProduct = async () => {
    if (editProductState && isEditing !== null) {
      try {
        await dispatch(updateProduct({ id: isEditing, productData: editProductState })).unwrap();
        toast.success('Product updated successfully!');
        setIsEditing(null);
        setEditProductState(null);
      } catch (error) {
        toast.error('Failed to update product');
      }
    }
  };

  const handleDeleteProduct = async (productId: number) => {
    try {
      await dispatch(deleteProduct(productId)).unwrap();
      toast.success('Product deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete product');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setNewProduct({ ...newProduct, [e.target.name]: e.target.value });
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (editProductState) {
      setEditProductState({ ...editProductState, [e.target.name]: e.target.value });
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="container mx-auto px-4 py-8 flex-grow">
        <h1 className="text-3xl font-bold mb-8">Seller Dashboard</h1>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Add New Product</h2>
          <div className="flex space-x-4">
            <input
              type="text"
              name="title"
              placeholder="Title"
              value={newProduct.title}
              onChange={handleInputChange}
              className="w-1/5 px-4 py-2 border border-gray-300 rounded-md"
            />
            <input
              type="number"
              name="price"
              placeholder="Price"
              value={newProduct.price}
              onChange={handleInputChange}
              className="w-1/5 px-4 py-2 border border-gray-300 rounded-md"
            />
            <input
              type="text"
              name="description"
              placeholder="Description"
              value={newProduct.description}
              onChange={handleInputChange}
              className="w-1/5 px-4 py-2 border border-gray-300 rounded-md"
            />
            <input
              type="text"
              name="category"
              placeholder="Category"
              value={newProduct.category}
              onChange={handleInputChange}
              className="w-1/5 px-4 py-2 border border-gray-300 rounded-md"
            />
            <input
              type="text"
              name="image"
              placeholder="Image URL"
              value={newProduct.image}
              onChange={handleInputChange}
              className="w-1/5 px-4 py-2 border border-gray-300 rounded-md"
            />
            <input
              type="number"
              name="quantity"
              placeholder="Quantity"
              value={newProduct.quantity}
              onChange={handleInputChange}
              className="w-1/5 px-4 py-2 border border-gray-300 rounded-md"
            />
            <button
              onClick={handleAddProduct}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-500"
            >
              Add Product
            </button>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Product List</h2>
          {status === 'loading' ? (
            <p>Loading products...</p>
          ) : status === 'failed' ? (
            <p>Error: {error}</p>
          ) : (
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b">Title</th>
                  <th className="py-2 px-4 border-b">Price</th>
                  <th className="py-2 px-4 border-b">Category</th>
                  <th className="py-2 px-4 border-b">Quantity</th>
                  <th className="py-2 px-4 border-b">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product: Product) => (
                  <tr key={product.id}>
                    {isEditing === product.id ? (
                      <>
                        <td className="py-2 px-4 border-b">
                          <input
                            type="text"
                            name="title"
                            value={editProductState?.title || ''}
                            onChange={handleEditInputChange}
                            className="px-4 py-2 border border-gray-300 rounded-md"
                          />
                        </td>
                        <td className="py-2 px-4 border-b">
                          <input
                            type="number"
                            name="price"
                            value={editProductState?.price || 0}
                            onChange={handleEditInputChange}
                            className="px-4 py-2 border border-gray-300 rounded-md"
                          />
                        </td>
                        <td className="py-2 px-4 border-b">
                          <input
                            type="text"
                            name="category"
                            value={editProductState?.category || ''}
                            onChange={handleEditInputChange}
                            className="px-4 py-2 border border-gray-300 rounded-md"
                          />
                        </td>
                        <td className="py-2 px-4 border-b">
                          <input
                            type="number"
                            name="quantity"
                            value={editProductState?.quantity || 0}
                            onChange={handleEditInputChange}
                            className="px-4 py-2 border border-gray-300 rounded-md"
                          />
                        </td>
                        <td className="py-2 px-4 border-b flex space-x-2">
                          <button
                            onClick={handleEditProduct}
                            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-500"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => {
                              setIsEditing(null);
                              setEditProductState(null);
                            }}
                            className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-500"
                          >
                            Cancel
                          </button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="py-2 px-4 border-b">{product.title}</td>
                        <td className="py-2 px-4 border-b">${product.price.toFixed(2)}</td>
                        <td className="py-2 px-4 border-b">{product.category}</td>
                        <td className="py-2 px-4 border-b">{product.quantity}</td>
                        <td className="py-2 px-4 border-b flex space-x-2">
                          <button
                            onClick={() => {
                              setIsEditing(product.id);
                              setEditProductState(product);
                            }}
                            className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-400"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product.id)}
                            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-500"
                          >
                            Delete
                          </button>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <footer className="bg-gray-800 text-white py-4 mt-auto">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2024 Cents29. All rights reserved.</p>
        </div>
      </footer>

      <ToastContainer />
    </div>
  );
};

export default SellerPage;