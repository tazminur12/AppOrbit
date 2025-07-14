import React, { useEffect, useState } from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { format } from "date-fns";
import Swal from "sweetalert2";
import { FiEdit2, FiTrash2, FiPlus, FiSave, FiX } from "react-icons/fi";

const ManageCoupons = () => {
  const axiosSecure = useAxiosSecure();
  const [coupons, setCoupons] = useState([]);
  const [form, setForm] = useState({
    code: "",
    discountAmount: "",
    discountType: "flat",
    expiryDate: "",
    description: "",
  });
  const [editId, setEditId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    setIsLoading(true);
    try {
      const res = await axiosSecure.get("/coupons");
      setCoupons(res.data);
    } catch {
      Swal.fire("Error", "Failed to load coupons", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { code, discountAmount, expiryDate, description } = form;

    if (!code || !discountAmount || !expiryDate || !description) {
      return Swal.fire("Warning", "Please fill all required fields", "warning");
    }

    setIsLoading(true);
    try {
      if (editId) {
        await axiosSecure.put(`/coupons/${editId}`, form);
        Swal.fire("Updated", "Coupon updated successfully", "success");
      } else {
        await axiosSecure.post("/coupons", form);
        Swal.fire("Created", "Coupon created successfully", "success");
      }

      resetForm();
      fetchCoupons();
    } catch {
      Swal.fire("Error", editId ? "Failed to update coupon" : "Failed to create coupon", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (coupon) => {
    setEditId(coupon._id);
    setForm({
      code: coupon.code,
      discountAmount: coupon.discountAmount,
      discountType: coupon.discountType || "flat",
      expiryDate: coupon.expiryDate?.split("T")[0],
      description: coupon.description,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This coupon will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it!",
    });

    if (!confirm.isConfirmed) return;

    setIsLoading(true);
    try {
      await axiosSecure.delete(`/coupons/${id}`);
      Swal.fire("Deleted", "Coupon deleted successfully", "success");
      fetchCoupons();
    } catch {
      Swal.fire("Error", "Failed to delete coupon", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setForm({ code: "", discountAmount: "", discountType: "flat", expiryDate: "", description: "" });
    setEditId(null);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 text-white">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white">Manage Coupons</h1>
            <p className="text-sm text-gray-400">
              {editId ? "Edit selected coupon" : "Create and manage discount coupons"}
            </p>
          </div>
          {editId && (
            <button
              onClick={resetForm}
              className="flex items-center bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded text-sm"
            >
              <FiPlus className="mr-2" /> Add New Coupon
            </button>
          )}
        </div>

        {/* Form */}
        <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm mb-1">Coupon Code <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="code"
                value={form.code}
                onChange={handleInputChange}
                className="w-full rounded bg-gray-800 text-white border border-gray-600 px-3 py-2"
                placeholder="E.g. SAVE20"
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Discount Amount <span className="text-red-500">*</span></label>
              <input
                type="number"
                name="discountAmount"
                value={form.discountAmount}
                min="1"
                onChange={handleInputChange}
                className="w-full rounded bg-gray-800 text-white border border-gray-600 px-3 py-2"
                placeholder="E.g. 20 or 10"
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Discount Type</label>
              <select
                name="discountType"
                value={form.discountType}
                onChange={handleInputChange}
                className="w-full rounded bg-gray-800 text-white border border-gray-600 px-3 py-2"
              >
                <option value="flat">Flat</option>
                <option value="percent">Percent</option>
              </select>
            </div>

            <div>
              <label className="block text-sm mb-1">Expiry Date <span className="text-red-500">*</span></label>
              <input
                type="date"
                name="expiryDate"
                value={form.expiryDate}
                onChange={handleInputChange}
                className="w-full rounded bg-gray-800 text-white border border-gray-600 px-3 py-2"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm mb-1">Description <span className="text-red-500">*</span></label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleInputChange}
                className="w-full rounded bg-gray-800 text-white border border-gray-600 px-3 py-2"
                rows="3"
                placeholder="E.g. 20% off on all products, valid until end of month"
              />
            </div>

            <div className="md:col-span-2 flex justify-end gap-3 mt-2">
              {editId && (
                <button
                  onClick={resetForm}
                  type="button"
                  className="flex items-center bg-gray-600 hover:bg-gray-500 px-4 py-2 rounded text-sm"
                >
                  <FiX className="mr-2" /> Cancel
                </button>
              )}
              <button
                type="submit"
                disabled={isLoading}
                className="flex items-center bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-sm"
              >
                {isLoading ? "Processing..." : editId ? <><FiSave className="mr-2" /> Update</> : <><FiPlus className="mr-2" /> Add</>}
              </button>
            </div>
          </form>
        </div>

        {/* Table */}
        <div className="bg-gray-900 rounded-lg border border-gray-700">
          <div className="flex justify-between px-6 py-4 border-b border-gray-700">
            <h2 className="text-lg font-semibold">Coupons List</h2>
            <span className="text-sm bg-blue-800 text-blue-100 px-2 py-1 rounded-full">
              {coupons.length} {coupons.length === 1 ? "Coupon" : "Coupons"}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-800 text-gray-300 uppercase">
                <tr>
                  <th className="px-6 py-3 text-left">Code</th>
                  <th className="px-6 py-3 text-left">Type</th>
                  <th className="px-6 py-3 text-left">Amount</th>
                  <th className="px-6 py-3 text-left">Expires</th>
                  <th className="px-6 py-3 text-left">Description</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {coupons.map((coupon) => {
                  const isExpired = new Date(coupon.expiryDate) < new Date();
                  return (
                    <tr key={coupon._id} className={isExpired ? "bg-red-900/20" : ""}>
                      <td className="px-6 py-4">{coupon.code}</td>
                      <td className="px-6 py-4 capitalize">{coupon.discountType || "flat"}</td>
                      <td className="px-6 py-4">{coupon.discountAmount}</td>
                      <td className="px-6 py-4 text-gray-400">
                        {format(new Date(coupon.expiryDate), "MMM d, yyyy")}
                      </td>
                      <td className="px-6 py-4">{coupon.description}</td>
                      <td className="px-6 py-4 text-right">
                        <button onClick={() => handleEdit(coupon)} className="text-blue-400 hover:text-blue-200 mr-4">
                          <FiEdit2 />
                        </button>
                        <button onClick={() => handleDelete(coupon._id)} className="text-red-400 hover:text-red-200">
                          <FiTrash2 />
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {coupons.length === 0 && !isLoading && (
                  <tr>
                    <td colSpan="6" className="text-center text-gray-500 px-6 py-6">
                      No coupons found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageCoupons;
