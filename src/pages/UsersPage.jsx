import { users } from "../data/dummy";
import { useState } from "react";

function UsersPage() {
  const [search, setSearch] = useState("");
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

      {filteredUsers.length === 0 ? (
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
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${user.role === "Admin" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"}`}>{user.role}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default UsersPage;
