import React, { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../store';
import { addUser, deleteUser, getUsers, editUser } from '../../features/slices/adminSlice';
import { User, AddUserRequest } from '../../features/slices/types';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdminPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { users, status, error } = useAppSelector((state) => state.admin);
  const currentUser = useAppSelector((state) => state.auth.user);

  const [newUser, setNewUser] = useState<AddUserRequest>({ username: '', email: '', password: '', role: '' });
  const [isEditing, setIsEditing] = useState<number | null>(null);
  const [editUserState, setEditUserState] = useState<User | null>(null);

  useEffect(() => {
    if (currentUser && currentUser.role === 'admin') {
      dispatch(getUsers());
    }
  }, [dispatch, currentUser]);

  const handleAddUser = async () => {
    if (!newUser.username || !newUser.email || !newUser.password || !newUser.role) {
      toast.error('All fields are required');
      return;
    }
    try {
      await dispatch(addUser(newUser)).unwrap();
      toast.success('User added successfully!');
      setNewUser({ username: '', email: '', password: '', role: '' });
      dispatch(getUsers());
    } catch (error) {
      toast.error('Failed to add user');
    }
  };

  const handleEditUser = async () => {
    if (editUserState) {
      try {
        await dispatch(editUser({ userId: editUserState.id, userData: editUserState })).unwrap();
        toast.success('User updated successfully!');
        setIsEditing(null);
        setEditUserState(null);
        dispatch(getUsers());
      } catch (error) {
        toast.error('Failed to update user');
      }
    }
  };

  const handleDeleteUser = async (userId: number) => {
    if (currentUser?.id === userId) {
      toast.error('You cannot delete yourself');
      return;
    }
    try {
      await dispatch(deleteUser(userId)).unwrap();
      toast.success('User deleted successfully!');
      dispatch(getUsers());
    } catch (error) {
      toast.error('Failed to delete user');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (editUserState) {
      setEditUserState({ ...editUserState, [e.target.name]: e.target.value });
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="container mx-auto px-4 py-8 flex-grow">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Add New User</h2>
          <div className="flex space-x-4">
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={newUser.username}
              onChange={handleInputChange}
              className="w-1/5 px-4 py-2 border border-gray-300 rounded-md"
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={newUser.email}
              onChange={handleInputChange}
              className="w-1/5 px-4 py-2 border border-gray-300 rounded-md"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={newUser.password}
              onChange={handleInputChange}
              className="w-1/5 px-4 py-2 border border-gray-300 rounded-md"
            />
            <select
              name="role"
              value={newUser.role}
              onChange={handleInputChange}
              className="w-1/5 px-4 py-2 border border-gray-300 rounded-md"
            >
              <option value="">Select Role</option>
              <option value="shopper">Shopper</option>
              <option value="seller">Seller</option>
            </select>
            <button
              onClick={handleAddUser}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-500"
            >
              Add User
            </button>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">User List</h2>
          {status === 'loading' ? (
            <p>Loading users...</p>
          ) : status === 'failed' ? (
            <p>Error: {error}</p>
          ) : (
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b">Username</th>
                  <th className="py-2 px-4 border-b">Email</th>
                  <th className="py-2 px-4 border-b">Role</th>
                  <th className="py-2 px-4 border-b">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users
                  .filter((user: User) => user.role !== 'admin')
                  .map((user: User) => (
                    <tr key={user.id}>
                      {isEditing === user.id ? (
                        <>
                          <td className="py-2 px-4 border-b">
                            <input
                              type="text"
                              name="username"
                              value={editUserState?.username || ''}
                              onChange={handleEditInputChange}
                              className="px-4 py-2 border border-gray-300 rounded-md"
                            />
                          </td>
                          <td className="py-2 px-4 border-b">
                            <input
                              type="email"
                              name="email"
                              value={editUserState?.email || ''}
                              onChange={handleEditInputChange}
                              className="px-4 py-2 border border-gray-300 rounded-md"
                            />
                          </td>
                          <td className="py-2 px-4 border-b">
                            <select
                              name="role"
                              value={editUserState?.role || ''}
                              onChange={handleEditInputChange}
                              className="px-4 py-2 border border-gray-300 rounded-md"
                            >
                              <option value="shopper">Shopper</option>
                              <option value="seller">Seller</option>
                            </select>
                          </td>
                          <td className="py-2 px-4 border-b flex space-x-2">
                            <button
                              onClick={handleEditUser}
                              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-500"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => {
                                setIsEditing(null);
                                setEditUserState(null);
                              }}
                              className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-500"
                            >
                              Cancel
                            </button>
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="py-2 px-4 border-b">{user.username}</td>
                          <td className="py-2 px-4 border-b">{user.email}</td>
                          <td className="py-2 px-4 border-b">{user.role}</td>
                          <td className="py-2 px-4 border-b flex space-x-2">
                            <button
                              onClick={() => {
                                setIsEditing(user.id);
                                setEditUserState(user);
                              }}
                              className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-400"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteUser(user.id)}
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
      <ToastContainer />
    </div>
  );
};

export default AdminPage;
