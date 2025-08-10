import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import BalancePage from './pages/BalancePage';
import AdmissionDocsPage from './pages/AdmissionDocsPage';
import AdmissionDocFormPage from './pages/AdmissionDocFormPage';
import ShippingDocsPage from './pages/ShippingDocsPage';
import ShippingDocFormPage from './pages/ShippingDocFormPage';
import ClientsPage from './pages/ClientsPage';
import ClientFormPage from './pages/ClientFormPage';
import UnitsPage from './pages/UnitsPage';
import UnitFormPage from './pages/UnitFormPage';
import ResourcesPage from './pages/ResourcesPage';
import ResourceFormPage from './pages/ResourceFormPage';

function App() {
  return (
    <Router>
      <div className="d-flex">
        <Sidebar />
        <div className="flex-grow-1 p-3">
          <Routes>
            <Route path="/" element={<BalancePage />} />
            <Route path="/balance" element={<BalancePage />} />
            <Route path="/admission" element={<AdmissionDocsPage />} />
            <Route path="/admission/create" element={<AdmissionDocFormPage mode="create" />} />
            <Route path="/admission/edit/:number" element={<AdmissionDocFormPage mode="edit" />} />
            <Route path="/shipping" element={<ShippingDocsPage />} />
            <Route path="/shipping/create" element={<ShippingDocFormPage mode="create" />} />
            <Route path="/shipping/edit/:number" element={<ShippingDocFormPage mode="edit" />} />
            <Route path="/clients" element={<ClientsPage />} />
            <Route path="/clients/create" element={<ClientFormPage mode="create" />} />
            <Route path="/clients/edit/:name" element={<ClientFormPage mode="edit" />} />
            <Route path="/units" element={<UnitsPage />} />
            <Route path="/units/create" element={<UnitFormPage mode="create" />} />
            <Route path="/units/edit/:name" element={<UnitFormPage mode="edit" />} />
            <Route path="/resources" element={<ResourcesPage />} />
            <Route path="/resources/create" element={<ResourceFormPage mode="create" />} />
            <Route path="/resources/edit/:name" element={<ResourceFormPage mode="edit" />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;