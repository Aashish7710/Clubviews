import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Maintainance from './pages/Maintainance';
import FAQ from './pages/FAQ';
import Contribute from './pages/Contribute';
import Team from './pages/Team';
import RegisterStudent from './pages/RegisterStudent';

import RegisterLanding from './pages/RegisterLanding';
import Login from './pages/Login';

import HomePage from "./pages/Home";
import ClubsPage from "./pages/Clubspage";
import { ThemeProvider } from "./context/ThemeContext";
import { NotificationProvider } from "./context/NotificationContext";
import EventFeed from './pages/EventFeed';

function App() {
  const isMaintenance = import.meta.env.VITE_MAINTENANCE_MODE === 'true';
  if (isMaintenance) {
    return <Maintainance />;
  }
  return (
    <NotificationProvider>
      <ThemeProvider>
        <Router>
          <Navbar />

          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/clubs" element={<ClubsPage />} />
            <Route path="/events" element={<EventFeed />} />
            <Route path="/Login" element={<Login />} />
            <Route path="/register" element={<RegisterLanding />} />
            <Route path="/register/student" element={<RegisterStudent />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/contribute" element={<Contribute />} />
            <Route path="/team" element={<Team />} />

          </Routes>

          <Footer />
        </Router>
      </ThemeProvider>
    </NotificationProvider>
  );
}

export default App;