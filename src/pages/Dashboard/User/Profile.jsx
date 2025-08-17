import React, { useContext, useState, useEffect, useRef } from 'react';
import { AuthContext } from '../../../context/AuthContext';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaEdit, FaSave, FaTimes, FaCamera, FaLink, FaCalendarAlt, FaShieldAlt, FaStar } from 'react-icons/fa';
import Swal from 'sweetalert2';

const Profile = () => {
  const { user } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();
  const fileInputRef = useRef(null);
  
  const [profileData, setProfileData] = useState({
    displayName: user?.displayName || '',
    email: user?.email || '',
    photoURL: user?.photoURL || '',
    phone: '',
    address: '',
    city: '',
    country: '',
    bio: '',
    website: '',
    company: '',
    position: '',
    skills: [],
    socialLinks: {
      linkedin: '',
      twitter: '',
      github: '',
      portfolio: ''
    }
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState('');

  useEffect(() => {
    fetchUserProfile();
  }, [user]);

  const fetchUserProfile = async () => {
    if (!user?.email) return;
    try {
      const { data } = await axiosSecure.get(`/users/profile/${user.email}`);
      if (data) {
        setProfileData(prev => ({
          ...prev,
          ...data,
          phone: data.phone || '',
          address: data.address || '',
          city: data.city || '',
          country: data.country || '',
          bio: data.bio || '',
          website: data.website || '',
          company: data.company || '',
          position: data.position || '',
          skills: data.skills || [],
          socialLinks: {
            linkedin: data.socialLinks?.linkedin || '',
            twitter: data.socialLinks?.twitter || '',
            github: data.socialLinks?.github || '',
            portfolio: data.socialLinks?.portfolio || ''
          }
        }));
      }
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setProfileData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setProfileData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSkillsChange = (e) => {
    const skills = e.target.value.split(',').map(skill => skill.trim()).filter(skill => skill);
    setProfileData(prev => ({
      ...prev,
      skills
    }));
  };

  const handleFileSelect = (file) => {
    if (!file) return;

    const maxSize = 2 * 1024 * 1024; // 2MB
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

    if (!allowedTypes.includes(file.type)) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid File Type',
        text: 'Please select a valid image file (JPG, PNG, GIF, WebP)',
        background: '#1f2937',
        color: '#f9fafb',
        confirmButtonColor: '#ef4444',
      });
      return;
    }

    if (file.size > maxSize) {
      Swal.fire({
        icon: 'error',
        title: 'File Too Large',
        text: 'Image size must be less than 2MB',
        background: '#1f2937',
        color: '#f9fafb',
        confirmButtonColor: '#ef4444',
      });
      return;
    }

    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    handleFileSelect(file);
  };

  const removePhoto = () => {
    setPhotoFile(null);
    setPhotoPreview('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
    formData.append('cloud_name', import.meta.env.VITE_CLOUDINARY_CLOUD_NAME);

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      return { url: data.secure_url };
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      throw new Error('Failed to upload image to Cloudinary');
    }
  };

  const handleProfileUpdate = async () => {
    setIsUpdating(true);
    try {
      let photoUrl = profileData.photoURL;

      if (photoFile) {
        setIsUploading(true);
        try {
          const uploadResult = await uploadToCloudinary(photoFile);
          photoUrl = uploadResult.url;
        } catch (uploadError) {
          Swal.fire({
            icon: 'error',
            title: 'Upload Failed',
            text: uploadError.message || 'Failed to upload image. Please try again.',
            background: '#1f2937',
            color: '#f9fafb',
            confirmButtonColor: '#ef4444',
          });
          setIsUpdating(false);
          setIsUploading(false);
          return;
        }
        setIsUploading(false);
      }

      await axiosSecure.patch(`/users/profile/${user.email}`, {
        ...profileData,
        photoURL: photoUrl
      });

      setProfileData(prev => ({ ...prev, photoURL: photoUrl }));
      setIsEditing(false);
      
      Swal.fire({
        icon: 'success',
        title: 'Profile Updated!',
        text: 'Your profile information has been updated successfully.',
        background: '#1f2937',
        color: '#f9fafb',
        confirmButtonColor: '#10b981',
      });
    } catch (error) {
      console.error('Profile update error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Update Failed',
        text: 'Failed to update profile. Please try again.',
        background: '#1f2937',
        color: '#f9fafb',
        confirmButtonColor: '#ef4444',
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const cancelEdit = () => {
    setIsEditing(false);
    fetchUserProfile(); // Reset to original data
    removePhoto();
  };

  if (!user) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-900">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mb-4"></div>
          <p className="text-lg text-gray-300">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">My Profile</h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Manage your personal information and profile details
          </p>
        </div>

        {/* Profile Card */}
        <div className="bg-gray-800 rounded-2xl shadow-xl border border-gray-700 overflow-hidden">
          {/* Cover Photo Section */}
          <div className="h-48 bg-gradient-to-r from-purple-600 to-indigo-600 relative">
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="absolute bottom-4 left-8">
              <div className="relative">
                <img
                  src={photoPreview || profileData.photoURL || "https://i.ibb.co/SsZ9LgB/user.png"}
                  alt="Profile"
                  className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
                />
                {isEditing && (
                  <div className="absolute -bottom-2 -right-2">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white hover:bg-indigo-700 transition-colors shadow-lg"
                    >
                      <FaCamera className="w-5 h-5" />
                    </button>
                    {photoPreview && (
                      <button
                        onClick={removePhoto}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white hover:bg-red-600 transition-colors"
                      >
                        <FaTimes className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileInputChange}
                  className="hidden"
                />
              </div>
            </div>
          </div>

          {/* Profile Info Section */}
          <div className="px-8 pb-8 pt-20">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  {profileData.displayName || 'Anonymous User'}
                </h2>
                <p className="text-gray-400">{profileData.position} {profileData.company && `at ${profileData.company}`}</p>
              </div>
              <div className="flex gap-3">
                {isEditing ? (
                  <>
                    <button
                      onClick={handleProfileUpdate}
                      disabled={isUpdating || isUploading}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 disabled:opacity-50"
                    >
                      <FaSave className="w-4 h-4" />
                      {isUpdating || isUploading ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                    >
                      <FaTimes className="w-4 h-4" />
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                  >
                    <FaEdit className="w-4 h-4" />
                    Edit Profile
                  </button>
                )}
              </div>
            </div>

            {/* Bio Section */}
            {profileData.bio && (
              <div className="mb-8">
                <p className="text-gray-300 leading-relaxed">{profileData.bio}</p>
              </div>
            )}

            {/* Profile Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Personal Information */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-white border-b border-gray-700 pb-2">
                  Personal Information
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2 flex items-center gap-2">
                      <FaUser className="w-4 h-4" />
                      Full Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="displayName"
                        value={profileData.displayName}
                        onChange={handleInputChange}
                        className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    ) : (
                      <p className="text-white">{profileData.displayName || 'Not provided'}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2 flex items-center gap-2">
                      <FaEnvelope className="w-4 h-4" />
                      Email Address
                    </label>
                    <p className="text-white">{profileData.email}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2 flex items-center gap-2">
                      <FaPhone className="w-4 h-4" />
                      Phone Number
                    </label>
                    {isEditing ? (
                      <input
                        type="tel"
                        name="phone"
                        value={profileData.phone}
                        onChange={handleInputChange}
                        placeholder="Enter your phone number"
                        className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    ) : (
                      <p className="text-white">{profileData.phone || 'Not provided'}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2 flex items-center gap-2">
                      <FaMapMarkerAlt className="w-4 h-4" />
                      Address
                    </label>
                    {isEditing ? (
                      <textarea
                        name="address"
                        value={profileData.address}
                        onChange={handleInputChange}
                        placeholder="Enter your address"
                        rows="3"
                        className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    ) : (
                      <p className="text-white">{profileData.address || 'Not provided'}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">City</label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="city"
                          value={profileData.city}
                          onChange={handleInputChange}
                          placeholder="City"
                          className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      ) : (
                        <p className="text-white">{profileData.city || 'Not provided'}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Country</label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="country"
                          value={profileData.country}
                          onChange={handleInputChange}
                          placeholder="Country"
                          className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      ) : (
                        <p className="text-white">{profileData.country || 'Not provided'}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Professional Information */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-white border-b border-gray-700 pb-2">
                  Professional Information
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Company</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="company"
                        value={profileData.company}
                        onChange={handleInputChange}
                        placeholder="Enter your company name"
                        className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    ) : (
                      <p className="text-white">{profileData.company || 'Not provided'}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Position</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="position"
                        value={profileData.position}
                        onChange={handleInputChange}
                        placeholder="Enter your job title"
                        className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    ) : (
                      <p className="text-white">{profileData.position || 'Not provided'}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Bio</label>
                    {isEditing ? (
                      <textarea
                        name="bio"
                        value={profileData.bio}
                        onChange={handleInputChange}
                        placeholder="Tell us about yourself"
                        rows="4"
                        className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    ) : (
                      <p className="text-white">{profileData.bio || 'No bio provided'}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Skills</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={profileData.skills.join(', ')}
                        onChange={handleSkillsChange}
                        placeholder="Enter skills separated by commas"
                        className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {profileData.skills.length > 0 ? (
                          profileData.skills.map((skill, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-indigo-600 text-white text-sm rounded-full"
                            >
                              {skill}
                            </span>
                          ))
                        ) : (
                          <p className="text-gray-500">No skills listed</p>
                        )}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2 flex items-center gap-2">
                      <FaLink className="w-4 h-4" />
                      Website
                    </label>
                    {isEditing ? (
                      <input
                        type="url"
                        name="website"
                        value={profileData.website}
                        onChange={handleInputChange}
                        placeholder="Enter your website URL"
                        className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    ) : (
                      <p className="text-white">
                        {profileData.website ? (
                          <a href={profileData.website} target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-indigo-300">
                            {profileData.website}
                          </a>
                        ) : (
                          'Not provided'
                        )}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Social Links Section */}
            <div className="mt-8 pt-8 border-t border-gray-700">
              <h3 className="text-xl font-semibold text-white mb-6">Social Links</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(profileData.socialLinks).map(([platform, url]) => (
                  <div key={platform}>
                    <label className="block text-sm font-medium text-gray-400 mb-2 capitalize">
                      {platform}
                    </label>
                    {isEditing ? (
                      <input
                        type="url"
                        name={`socialLinks.${platform}`}
                        value={url}
                        onChange={handleInputChange}
                        placeholder={`Enter your ${platform} URL`}
                        className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    ) : (
                      <p className="text-white">
                        {url ? (
                          <a href={url} target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-indigo-300">
                            {url}
                          </a>
                        ) : (
                          'Not provided'
                        )}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Account Status */}
            <div className="mt-8 pt-8 border-t border-gray-700">
              <h3 className="text-xl font-semibold text-white mb-6">Account Status</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-700 rounded-lg p-4 border border-gray-600">
                  <div className="flex items-center gap-3 mb-2">
                    <FaShieldAlt className="w-5 h-5 text-green-400" />
                    <span className="text-sm font-medium text-gray-400">Verification Status</span>
                  </div>
                  <p className="text-white font-semibold">Verified</p>
                </div>
                
                <div className="bg-gray-700 rounded-lg p-4 border border-gray-600">
                  <div className="flex items-center gap-3 mb-2">
                    <FaCalendarAlt className="w-5 h-5 text-blue-400" />
                    <span className="text-sm font-medium text-gray-400">Member Since</span>
                  </div>
                  <p className="text-white font-semibold">
                    {user.metadata?.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short'
                    }) : 'N/A'}
                  </p>
                </div>
                
                <div className="bg-gray-700 rounded-lg p-4 border border-gray-600">
                  <div className="flex items-center gap-3 mb-2">
                    <FaStar className="w-5 h-5 text-yellow-400" />
                    <span className="text-sm font-medium text-gray-400">Account Type</span>
                  </div>
                  <p className="text-white font-semibold">Premium</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
