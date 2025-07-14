import { useEffect, useState } from 'react';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import Swal from 'sweetalert2';

const ManageUsers = () => {
  const axiosSecure = useAxiosSecure();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axiosSecure.get('/users').then((res) => setUsers(res.data));
  }, [axiosSecure]);

  const updateRole = (id, role) => {
    Swal.fire({
      title: `Are you sure?`,
      text: `Make this user a ${role}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3b82f6',
      cancelButtonColor: '#ef4444',
      confirmButtonText: `Yes, make ${role}`,
      background: '#1f2937',
      color: '#f9fafb',
    }).then((result) => {
      if (result.isConfirmed) {
        axiosSecure.patch(`/users/role/${id}`, { role }).then(() => {
          setUsers((prev) =>
            prev.map((user) =>
              user._id === id ? { ...user, role } : user
            )
          );
          Swal.fire({
            icon: 'success',
            title: `Updated!`,
            text: `User is now a ${role}.`,
            timer: 2000,
            showConfirmButton: false,
            background: '#1f2937',
            color: '#f9fafb',
          });
        });
      }
    });
  };

  // Badge color helper based on role
  const roleBadge = (role) => {
    switch (role) {
      case 'admin':
        return 'bg-blue-600 text-white';
      case 'moderator':
        return 'bg-green-600 text-white';
      case 'user':
      default:
        return 'bg-gray-500 text-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-100 mb-2">Manage Users</h2>
        <p className="text-gray-400">Manage user roles and permissions</p>
      </div>
      
      <div className="bg-gray-800 rounded-xl shadow-2xl border border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-200">Name</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-200">Email</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-200">Role</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-200">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {users.map((u) => (
                <tr key={u._id} className="hover:bg-gray-700 transition-colors">
                  <td className="px-6 py-4 text-gray-200">{u.name}</td>
                  <td className="px-6 py-4 text-gray-300">{u.email}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${roleBadge(u.role)}`}
                    >
                      {u.role || 'user'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center space-x-2">
                    <button
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition-colors"
                      onClick={() => updateRole(u._id, 'moderator')}
                      disabled={u.role === 'moderator'}
                    >
                      Make Moderator
                    </button>
                    <button
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition-colors"
                      onClick={() => updateRole(u._id, 'admin')}
                      disabled={u.role === 'admin'}
                    >
                      Make Admin
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageUsers;
