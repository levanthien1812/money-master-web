import React, { useMemo, useState } from "react";
import {
  useFilters,
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable,
} from "react-table";
import Input from "../../../components/elements/Input";
import avatar from "../../../assets/images/profile.png";
import ConfirmDeleteModal from "../../../components/modal/ConfirmDeleteModal";
import { format } from "date-fns";
import UsersServices from "../../../services/users";
import { toast } from "react-toastify";

function Table({ data, onUpdateSuccess }) {
  const [isDeletingUser, setIsDeletingUser] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isSavingDelete, setIsSavingDelete] = useState(false);

  const columns = useMemo(
    () => [
      {
        Header: "ID",
        accessor: "id",
      },
      {
        Header: "Photo",
        accessor: "photo",
        Cell: ({ cell: { value } }) => (
          <img
            src={value ? value : avatar}
            alt=""
            className="w-10 h-10 rounded-full"
          />
        ),
      },
      {
        Header: "Name",
        accessor: "name",
        Cell: ({ cell: { value } }) => (
          <p className="text-purple-600 font-bold">{value}</p>
        ),
      },
      {
        Header: "Email",
        accessor: "email",
      },
      {
        Header: "Joined date",
        accessor: "created_at",
        Cell: ({ cell: { value } }) => format(new Date(value), "dd/MM/yyyy"),
      },
      {
        Header: "Number of transaction",
        accessor: "transactions_count",
      },
      {
        Header: "Actions",
        Cell: ({ row }) => (
          <div>
            <button
              className="bg-red-500 hover:bg-red-600 text-white rounded-md py-1 px-3 text-xs font-bold uppercase"
              onClick={() => handleClickDelete(row.original.id)}
            >
              Delete
            </button>
          </div>
        ),
      },
    ],
    []
  );

  const handleClickDelete = (id) => {
    setSelectedUser(id);
    setIsDeletingUser(true);
  };

  const handleDeleteUser = async () => {
    try {
      setIsSavingDelete(true);
      const responseData = await UsersServices.deleteUserById(selectedUser);

      if (responseData.status === "success") {
        setIsDeletingUser(false);
        onUpdateSuccess();
        toast.success("Delete user successfully");
      } else {
        toast.error(responseData.error);
      }
    } catch (e) {
      toast.error(e.response.data.message);
    }
    setIsSavingDelete(false);
  };

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    state,
    setGlobalFilter,
    page,
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    pageOptions,
    state: { pageIndex },
  } = useTable(
    {
      columns,
      data,
      initialState: { pageSize: 10 },
    },
    useFilters,
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  const { globalFilter } = state;

  return (
    <div>
      <div className="mt-4 mb-4 flex justify-between items-center">
        <p className="uppercase text-md font-semibold">
          Total: <span className="text-purple-600">{data.length}</span>{" "}
        </p>
        <div className="md:w-72 w-36">
          <Input
            type="text"
            placeholder="Search..."
            value={globalFilter || ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
            size="small"
            mb="mb-0"
          />
        </div>
      </div>
      <div className="w-full overflow-x-scroll">
        <table
          {...getTableProps()}
          className="table w-full bg-white rounded-lg overflow-hidden shadow-lg"
        >
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()} key={Math.random()}>
                {headerGroup.headers.map((column) => (
                  <th
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    className="py-3 text-left px-5"
                    key={Math.random()}
                  >
                    {column.render("Header")}
                    <span>
                      {column.isSorted
                        ? column.isSortedDesc
                          ? " 🔽"
                          : " 🔼"
                        : ""}
                    </span>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {page.map((row, index) => {
              prepareRow(row);
              return (
                <tr
                  {...row.getRowProps()}
                  className={
                    (index % 2 === 0 ? "bg-gray-100" : "") +
                    " hover:bg-purple-200"
                  }
                  key={Math.random()}
                >
                  {row.cells.map((cell) => {
                    return (
                      <td
                        {...cell.getCellProps()}
                        className="px-5 py-3"
                        key={Math.random()}
                      >
                        {cell.render("Cell")}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="flex items-center gap-3 mt-5 justify-center">
        <button
          onClick={() => previousPage()}
          disabled={!canPreviousPage}
          className="py-1 px-3 bg-purple-500 text-white rounded-md w-24 hover:bg-purple-600"
        >
          Previous
        </button>
        <span>
          Page{" "}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>{" "}
        </span>
        <button
          onClick={() => nextPage()}
          disabled={!canNextPage}
          className="py-1 px-3 bg-purple-500 text-white rounded-md w-24 hover:bg-purple-600"
        >
          Next
        </button>
      </div>

      {isDeletingUser && (
        <ConfirmDeleteModal
          message={
            "Do you really want to delete this user (ID: " +
            selectedUser +
            ")? This action can not be undone!"
          }
          onClose={() => setIsDeletingUser(false)}
          onAccept={handleDeleteUser}
          processing={isSavingDelete}
        />
      )}
    </div>
  );
}

export default Table;
