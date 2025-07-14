import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { WithContext as ReactTags } from "react-tag-input";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import useSecureAxios from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";

const KeyCodes = { comma: 188, enter: 13 };
const delimiters = [KeyCodes.comma, KeyCodes.enter];

const AddProduct = () => {
  const { user } = useAuth();
  const axiosSecure = useSecureAxios();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      ownerName: "",
      ownerEmail: "",
      ownerImage: "",
      image: "",
    },
  });

  const [tags, setTags] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    if (user) {
      setValue("ownerName", user.displayName || "");
      setValue("ownerEmail", user.email || "");
      setValue("ownerImage", user.photoURL || "");
    }
  }, [user, setValue]);

  const handleDelete = (i) => setTags(tags.filter((_, index) => index !== i));
  const handleAddition = (tag) => setTags([...tags, tag]);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageUpload(e.dataTransfer.files[0]);
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleImageUpload(e.target.files[0]);
    }
  };

  const handleImageUpload = async (file) => {
    if (!file || file.size > 5 * 1024 * 1024 || !file.type.startsWith("image/")) {
      showToast("error", "Invalid image. Max 5MB, must be an image.");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
    formData.append("cloud_name", import.meta.env.VITE_CLOUDINARY_CLOUD_NAME);

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: "POST", body: formData }
      );
      const data = await res.json();
      if (data.secure_url) {
        setValue("image", data.secure_url);
        setPreviewImage(data.secure_url);
        showToast("success", "Image uploaded successfully");
      } else throw new Error("Upload failed");
    } catch (error) {
      showToast("error", "Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const showToast = (type, message) => {
    Swal.fire({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      background: "#1f2937",
      color: "#f9fafb",
      timerProgressBar: true,
      icon: type,
      title: message,
      iconColor: type === "success" ? "#10b981" : "#ef4444",
    });
  };

  const onSubmit = async (data) => {
    if (!data.image) return showToast("error", "Please upload a product image");
    if (tags.length === 0) return showToast("error", "Please add at least one tag");

    const productData = {
      name: data.name,
      image: data.image,
      description: data.description,
      tags: tags.map((t) => t.text),
      externalLink: data.externalLink || null,
      owner: {
        name: data.ownerName,
        email: data.ownerEmail,
        image: data.ownerImage,
      },
      ownerEmail: data.ownerEmail,
      createdAt: new Date(),
      upvotes: 0,
      status: "pending",
      reported: false,
    };

    try {
      const res = await axiosSecure.post("/products", productData);
      if (res.data.insertedId || res.data.acknowledged) {
        showToast("success", "Product added successfully");
        reset();
        setTags([]);
        setPreviewImage(null);
        navigate("/dashboard/user/my-products");
      } else throw new Error("Failed to add product");
    } catch (err) {
      showToast("error", err.response?.data?.message || "Submission failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-extrabold text-white sm:text-4xl">
            Add New Product
          </h1>
          <p className="mt-3 text-xl text-gray-300">
            Share your product with our community
          </p>
        </div>

        <div className="bg-gray-800 rounded-xl shadow-2xl overflow-hidden border border-gray-700">
          <form onSubmit={handleSubmit(onSubmit)} className="divide-y divide-gray-700">

            {/* Product Info */}
            <div className="p-6 sm:p-8">
              <h2 className="text-lg font-medium text-white mb-6">
                Product Information
              </h2>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">

                <div className="sm:col-span-2">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                    Product Name *
                  </label>
                  <input
                    id="name"
                    type="text"
                    {...register("name", {
                      required: "Product name is required",
                      minLength: { value: 3, message: "Minimum 3 characters" },
                      maxLength: { value: 100, message: "Maximum 100 characters" },
                    })}
                    className="block w-full px-4 py-3 rounded-md border border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    placeholder="Awesome Product Name"
                  />
                  {errors.name && <p className="mt-1 text-sm text-red-400">{errors.name.message}</p>}
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Product Image *
                  </label>
                  <div
                    className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md transition-colors ${
                      dragActive 
                        ? "border-blue-500 bg-blue-900/20" 
                        : "border-gray-600 bg-gray-700 hover:border-gray-500"
                    }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  >
                    <div className="space-y-1 text-center">
                      {previewImage || watch("image") ? (
                        <div className="flex flex-col items-center">
                          <img
                            src={previewImage || watch("image")}
                            alt="Preview"
                            className="mx-auto h-32 w-32 object-contain rounded-md border border-gray-600"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setValue("image", "");
                              setPreviewImage(null);
                            }}
                            className="mt-3 text-sm text-white bg-red-600 hover:bg-red-700 px-3 py-1 rounded transition-colors"
                          >
                            Change Image
                          </button>
                        </div>
                      ) : (
                        <>
                          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 48 48">
                            <path stroke="currentColor" d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.2-3.2a4 4 0 00-5.6 0L28 28M8 32l9.2-9.2a4 4 0 015.6 0L28 28l4 4m4-24h8m-4-4v8m-12 4h.02" />
                          </svg>
                          <label htmlFor="image-upload" className="cursor-pointer text-blue-400 hover:text-blue-300 transition-colors">
                            <span>Upload a file</span>
                            <input
                              id="image-upload"
                              type="file"
                              className="sr-only"
                              accept="image/*"
                              onChange={handleImageChange}
                            />
                          </label>
                          <p className="text-xs text-gray-400">PNG, JPG, GIF up to 5MB</p>
                        </>
                      )}
                    </div>
                  </div>
                  {uploading && <p className="mt-2 text-blue-400">Uploading...</p>}
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">
                    Description *
                  </label>
                  <textarea
                    id="description"
                    rows={4}
                    {...register("description", {
                      required: "Description is required",
                      minLength: { value: 20, message: "Minimum 20 characters" },
                      maxLength: { value: 1000, message: "Maximum 1000 characters" },
                    })}
                    className="block w-full px-4 py-3 rounded-md border border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    placeholder="Describe your product in detail..."
                  />
                  {errors.description && (
                    <p className="mt-1 text-sm text-red-400">{errors.description.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Tags */}
            <div className="p-6 sm:p-8">
              <h2 className="text-lg font-medium text-white mb-6">Product Tags</h2>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Tags * (Press Enter or Comma to add)
              </label>
              <ReactTags
                tags={tags}
                delimiters={delimiters}
                handleDelete={handleDelete}
                handleAddition={handleAddition}
                inputFieldPosition="bottom"
                autocomplete
                placeholder="Add tags (e.g. SaaS, AI, Marketing)"
                classNames={{
                  tags: "flex flex-wrap gap-2",
                  tagInputField: "w-full p-2 border border-gray-600 bg-gray-700 text-white placeholder-gray-400 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500",
                  tag: "bg-blue-600 text-white px-2 py-1 rounded",
                  remove: "ml-2 text-red-400 hover:text-red-300 cursor-pointer",
                }}
              />
              {tags.length === 0 && (
                <p className="mt-2 text-sm text-yellow-400">Please add at least one tag</p>
              )}
            </div>

            {/* Owner Info */}
            <div className="p-6 sm:p-8 bg-gray-700/50">
              <h2 className="text-lg font-medium text-white mb-6">Owner Information</h2>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                <div>
                  <input 
                    {...register("ownerName", { required: "Owner name is required" })} 
                    className="w-full px-4 py-3 rounded-md border border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    placeholder="Name *" 
                  />
                </div>
                <div>
                  <input 
                    {...register("ownerEmail", { required: "Owner email is required" })} 
                    className="w-full px-4 py-3 rounded-md border border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    placeholder="Email *" 
                  />
                </div>
                <div>
                  <input 
                    {...register("ownerImage", { required: "Owner image URL is required" })} 
                    className="w-full px-4 py-3 rounded-md border border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    placeholder="Image URL *" 
                  />
                </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-gray-800 text-right">
              <button
                type="submit"
                disabled={isSubmitting || uploading}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {isSubmitting || uploading ? "Processing..." : "Add Product"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
