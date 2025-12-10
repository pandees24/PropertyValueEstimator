import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from './components/Header';
import Footer from './components/Footer';
import PropertySearch from './components/PropertySearch';
import MapView from './components/MapView';
import ComparisonTool from './components/ComparisonTool';
import PriceTrends from './components/PriceTrends';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <main className="container-fluid">
          <Routes>
            <Route path="/" element={<PropertySearch />} />
            <Route path="/map" element={<MapView />} />
            <Route path="/compare" element={<ComparisonTool />} />
            <Route path="/trends" element={<PriceTrends />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
