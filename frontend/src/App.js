import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Gallery from "./pages/Gallery";
import GalleryManagement from "./pages/staff/GalleryManagement";
import Navbar from "./components/Navigation";
import Footer from "./components/Footer";
import './App.css';

const App = () => {
    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path="/gallery" element={<Gallery />} />
                <Route path="/" element={<GalleryManagement/> } />
            </Routes>
            <Footer />
        </Router>
    );
};

export default App;
