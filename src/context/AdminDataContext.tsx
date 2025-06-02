import React, { createContext, useContext, useState } from 'react';

const AdminDataContext = createContext();

export const AdminDataProvider = ({ children }) => {
  const [adminData, setAdminData] = useState({});

  return (
    <AdminDataContext.Provider value={{ adminData, setAdminData }}>
      {children}
    </AdminDataContext.Provider>
  );
};

export const useAdminData = () => {
  const context = useContext(AdminDataContext);
  if (!context) {
    throw new Error('useAdminData must be used within an AdminDataProvider');
  }
  return context;
};
