import React, { useState, useEffect } from "react";
import axios from "axios";
import { Customer, Photo } from "../types";
import Sidebar from "./Sidebar";

const PIXABAY_API_KEY = '44294725-5647d237cd87ca3498ec2ee31'; // Replace with your Pixabay API key

const generateCustomers = (): Customer[] => {
  const titles = ["CEO", "CTO", "CFO", "COO", "CMO"];
  const addresses = [
    "123 Main St",
    "456 Maple Ave",
    "789 Oak Dr",
    "101 Pine Ln",
    "202 Birch Blvd",
  ];

  const customers: Customer[] = [];

  for (let i = 1; i <= 1000; i++) {
    const titleIndex = (i - 1) % 5;
    customers.push({
      id: i,
      name: `Customer ${i.toString().padStart(2, '0')}`,
      title: titles[titleIndex],
      address: addresses[titleIndex],
    });
  }

  return customers;
};

const Main: React.FC = () => {
  const customers: Customer[] = generateCustomers();

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(customers[0]);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const fetchPhotos = async () => {
    try {
      const randomPage = Math.floor(Math.random() * 50) + 1;
      const PIXABAY_API_URL = `https://pixabay.com/api/?key=${PIXABAY_API_KEY}&per_page=9&page=${randomPage}`;
      const response = await axios.get(PIXABAY_API_URL);
      const fetchedPhotos = response.data.hits.map((hit: any) => ({
        id: hit.id,
        url: hit.webformatURL,
        alt: hit.tags,
      }));
      setPhotos(fetchedPhotos);
    } catch (error: any) {
      console.error("Error fetching photos from Pixabay:", error.response ? error.response.data : error.message);
    }
  };

  useEffect(() => {
    fetchPhotos();
    const intervalId = setInterval(fetchPhotos, 10000);

    return () => clearInterval(intervalId);
  }, [selectedCustomer]);

  const itemsPerPage = 5;
  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
  let startIdx = (currentPage - 1) * itemsPerPage;
  let selectedCustomers = filteredCustomers.slice(startIdx, startIdx + itemsPerPage);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      if (newPage > currentPage) {
        startIdx = (currentPage) * itemsPerPage;
      } else {
        startIdx = (currentPage - 2) * itemsPerPage;
      }
      selectedCustomers = filteredCustomers.slice(startIdx, startIdx + itemsPerPage);

      setSelectedCustomer(selectedCustomers[0] || null);
    }
  };

  return (
    <div className="container">
      <Sidebar
        customers={selectedCustomers} // Pass only the customers for the current page
        selectedCustomer={selectedCustomer || selectedCustomers[0]}
        onCustomerSelect={(customer) => setSelectedCustomer(customer)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
      <div className="customer-details">
        {selectedCustomer && (
          <>
            <h2>{selectedCustomer.name} details here</h2>
            <p>{selectedCustomer.title}</p>
            <p>{selectedCustomer.address}</p>
            <div className="photo-grid">
              {photos.map((photo) => (
                <img key={photo.id} src={photo.url} alt={photo.alt} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Main;
