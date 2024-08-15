import React from "react";
import { Customer } from "../types";

interface SidebarProps {
  customers: Customer[];
  selectedCustomer: Customer;
  onCustomerSelect: (customer: Customer) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (newPage: number) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  customers,
  selectedCustomer,
  onCustomerSelect,
  searchQuery,
  onSearchChange,
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="customer-list">
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search customer's names"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      {filteredCustomers.map((customer) => (
        <div
          key={customer.id}
          className={`customer-item ${selectedCustomer.id === customer.id ? "selected" : ""
            }`}
          onClick={() => onCustomerSelect(customer)}
        >
          <h2>{customer.name}</h2>
          <p>{customer.title}</p>
          <p>{customer.address}</p>
        </div>
      ))}
      <div className="pagination">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>{`Page ${currentPage} of ${totalPages}`}</span>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
