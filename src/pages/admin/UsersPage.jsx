import React, { useEffect, useState } from "react";
import Table from "./components/Table";
import Loading from "../../components/others/Loading";
import UsersServices from "../../services/users";
import { toast } from "react-toastify";

function UsersPage() {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);

  const getUsers = async () => {
    try {
      setLoading(true);
      const responseData = await UsersServices.getUsers();
      setUsers(responseData.data.users);
    } catch (e) {
      toast.error(e.response.data.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    getUsers();
  }, []);

  return (
    <div className="lg:p-8 sm:p-14 p-2">
      <div className="flex gap-4 items-center p-1">
        <h2 className="sm:text-4xl text-3xl">Users</h2>
      </div>
      <div className="w-full">
        {loading && <Loading />}
        {!loading && users.length > 0 && (
          <Table data={users} onUpdateSuccess={() => getUsers()} />
        )}
      </div>
    </div>
  );
}

export default UsersPage;
