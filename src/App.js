// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login/Login';
import Dashboard from './components/Dashboard';
import Employee from './components/Employeee/Employee';
import Company from './components/Company/Company';
import Record from './components/Records/Record';
import Register from './components/Employeee/Register';
import EmpDetails from './components/Employeee/EmpDetails';
import ComDetails from './components/Company/ComDetails';
import ComRegister from './components/Company/ComRegister';
import EmpEmpDetails from './components/Employeee/EmpEmpDetails';
import EmpWorkEntry from './components/Records/EmpWorkEntry';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/employee" element={<Employee />} />
        <Route path="/company" element={<Company />} />
        <Route path="/record" element={<Record />} />
        <Route path="/register" element={<Register />} />
        <Route path="/:user_id/work-reports" element={<EmpDetails />} />
        <Route path="/:com_id/work-report" element={<ComDetails />} />
        <Route path="/Com_register" element={<ComRegister />} />
        <Route path="/work-details" element={<EmpEmpDetails />} />
        <Route path="/work-entry" element={<EmpWorkEntry />} />
      </Routes>
    </Router>
  );
}

export default App;
