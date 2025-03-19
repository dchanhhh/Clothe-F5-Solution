import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "../src/Component/Pages/Shop/Index";
import Login from "../src/Component/Pages/Login/Login";
import ProductPage from "./Component/Pages/Shop/Product";
import Register from "./Component/Pages/Login/Register";
import ResetPassword from "./Component/Pages/Login/ResetPassword";
import ProductDetail from "./Component/Pages/Shop/ProductDetail";
import Dashboard from "./Component/Pages/Admin";
import Cart from "./Component/Pages/Shop/Card";
import Profile from "./Component/Pages/Shop/Profile";
import LoginAdmin from "./Component/Pages/Login/LoginAdmin";

import ContactPage from "./Component/Pages/Shop/ContactPage";
import AlbumPage from "./Component/Pages/Shop/AlbumPage";
import AlbumDetail from "./Component/Pages/Shop/AlbumPageDetail";
// import ProductList from './Component/Pages/Shop/ProductList';
import AlbumList from "./Component/Pages/Shop/AlbumList";
import AlbumListDetail from "./Component/Pages/Shop/AlbumListDetail";
import Checkout from "./Component/Pages/Shop/CheckoutPage";
import ViewOrderInformation from "./Component/Pages/Shop/ViewOrderInformation";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/Products" element={<ProductPage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/resetPassword" element={<ResetPassword />} />
          <Route path="/Products/:id" element={<ProductDetail />} />
          <Route path="/Dashboard" element={<Dashboard />} />
          <Route path="/cart/:username" element={<Cart />} />
          <Route path="/Profile/:username" element={<Profile />} />
          <Route path="/LoginAdmin" element={<LoginAdmin />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/album" element={<AlbumPage />} />
          <Route path="/album/:id" element={<AlbumDetail />} />
          <Route path="/album-list/:collectionId" element={<AlbumList />} />
          <Route path="/album-detail/:id" element={<AlbumListDetail />} />
          <Route path="/order/:id" element={<ViewOrderInformation />} />
          <Route path="/checkout" element={<Checkout />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
