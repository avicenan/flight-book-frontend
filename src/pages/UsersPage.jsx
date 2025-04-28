import { useState, useEffect } from "react";
import { usersApiService } from "../services/api";

function UsersPage() {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    usersApiService
      .getAll()
      .then((res) => {
        if (!res.data) throw new Error("Failed to fetch users");
        setUsers(res.data.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const filteredUsers = users.filter((user) => user.name.toLowerCase().includes(search.toLowerCase()) || user.email.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="p-8 pt-20 flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Users</h1>
        {/* <button className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded">Add User</button> */}
      </div>
      <div className="mb-2">
        <input type="text" placeholder="Search users..." className="border border-gray-300 p-4 w-full rounded-full" onChange={(e) => setSearch(e.target.value)} />
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <p className="text-red-600">Error: {error}</p>
      ) : filteredUsers.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredUsers.map((user) => (
            <div key={user.id} className="border border-gray-400 p-4 rounded-lg shadow hover:shadow-lg transition">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-bold text-lg">{user.name}</p>
                  <p className="text-gray-600">{user.email}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default UsersPage;
