import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import Swal from 'sweetalert2';

const UpdateProduct = () => {
  const { id } = useParams();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    name: '',
    description: '',
    image: '',
    tags: '',
    price: '',
    status: 'pending'
  });

  // Fetch product
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axiosSecure.get(`/products/${id}`);
        const data = res.data;
        setForm({
          name: data.name || '',
          description: data.description || '',
          image: data.image || '',
          tags: (data.tags || []).join(', '),
          price: data.price || '',
          status: data.status || 'pending',
        });
      } catch {
        setError('Failed to load product.');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, axiosSecure]);

  // Handle Input Change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle File Upload
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);

      const res = await fetch(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (data.secure_url) {
        setForm(prev => ({ ...prev, image: data.secure_url }));
      } else {
        setError('Image upload failed.');
      }
    } catch {
      setError('Image upload failed.');
    }
  };

  // Handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setUpdating(true);

    if (!form.name || !form.description || !form.image || !form.price) {
      setError('Please fill in all required fields.');
      setUpdating(false);
      return;
    }

    const payload = {
      name: form.name,
      description: form.description,
      image: form.image,
      tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
      price: form.price,
      status: form.status || 'pending'
    };

    try {
      const res = await axiosSecure.put(`/products/${id}`, payload);
      if (res.data.success) {
        Swal.fire({
          icon: 'success',
          title: 'Product Updated',
          text: 'Your product has been updated successfully!',
          background: '#1f2937',
          color: '#f9fafb',
          confirmButtonColor: '#10b981'
        });
        navigate('/dashboard/user/my-products');
      } else {
        setError(res.data.message || 'Update failed.');
      }
    } catch {
      setError('Failed to update product.');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return <div className="text-center py-20 text-white">Loading product...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-20 text-red-400">
        <p>{error}</p>
        <button onClick={() => navigate('/dashboard/user/my-products')} className="mt-4 px-4 py-2 bg-gray-700 rounded">
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto mt-8 bg-gray-900 p-6 rounded-xl shadow-lg text-white">
      <h2 className="text-2xl font-bold mb-6">Update Product</h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block mb-1">Name *</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded bg-gray-800 border border-gray-700"
            required
          />
        </div>

        <div>
          <label className="block mb-1">Description *</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={4}
            className="w-full px-4 py-2 rounded bg-gray-800 border border-gray-700"
            required
          />
        </div>

        <div>
          <label className="block mb-1">Image *</label>
          <div className="flex gap-3 items-center">
            <input
              type="text"
              name="image"
              value={form.image}
              onChange={handleChange}
              className="flex-1 px-4 py-2 rounded bg-gray-800 border border-gray-700"
              required
            />
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />
            <button type="button" onClick={() => fileInputRef.current.click()} className="bg-indigo-600 px-3 py-2 rounded">
              Upload
            </button>
          </div>
          {form.image && <img src={form.image} alt="Preview" className="mt-2 w-32 h-32 object-cover rounded border" />}
        </div>

        <div>
          <label className="block mb-1">Tags (comma separated)</label>
          <input
            type="text"
            name="tags"
            value={form.tags}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded bg-gray-800 border border-gray-700"
            placeholder="e.g. SaaS, AI"
          />
        </div>

        <div>
          <label className="block mb-1">Price ($) *</label>
          <input
            type="number"
            name="price"
            value={form.price}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded bg-gray-800 border border-gray-700"
            required
            min={0}
          />
        </div>

        <div>
          <label className="block mb-1">Status *</label>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded bg-gray-800 border border-gray-700"
            required
          >
            <option value="pending">Pending</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        {error && <p className="text-red-400">{error}</p>}

        <div className="flex justify-between">
          <button
            type="button"
            onClick={() => navigate('/dashboard/user/my-products')}
            className="px-4 py-2 bg-gray-700 rounded"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={updating}
            className="px-6 py-2 bg-green-600 hover:bg-green-700 rounded font-semibold"
          >
            {updating ? 'Updating...' : 'Update Product'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateProduct;
