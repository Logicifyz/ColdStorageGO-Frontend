// src/context/EmailContext.js
import React, { createContext, useContext, useState } from 'react';

// Create the context
const EmailContext = createContext();

// Create a provider component
export const EmailProvider = ({ children }) => {
    const [email, setEmail] = useState('');

    return (
        <EmailContext.Provider value={{ email, setEmail }}>
            {children}
        </EmailContext.Provider>
    );
};

// Custom hook to use the EmailContext
export const useEmail = () => useContext(EmailContext);
