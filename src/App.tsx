import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AdminLayout } from './components/layout/AdminLayout';
import { Dashboard } from './pages/Dashboard';
import { FirearmRegistry } from './pages/FirearmRegistry';
import { FirearmDetail } from './pages/FirearmDetail';
import { Operations } from './pages/Operations';
import { Reports } from './pages/Reports';
import { PersonnelRegistry } from './pages/PersonnelRegistry';
import { useFirearmStore } from './store/useFirearmStore';
import { useThemeStore } from './store/useThemeStore';

function App() {
  const seedDataIfNeeded = useFirearmStore(state => state.seedDataIfNeeded);
  const theme = useThemeStore(state => state.theme);

  useEffect(() => {
    seedDataIfNeeded();
  }, [seedDataIfNeeded]);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <BrowserRouter>
      <AdminLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/registry" element={<FirearmRegistry />} />
          <Route path="/registry/:id" element={<FirearmDetail />} />
          <Route path="/personnel" element={<PersonnelRegistry />} />
          <Route path="/operations" element={<Operations />} />
          <Route path="/reports" element={<Reports />} />
        </Routes>
      </AdminLayout>
    </BrowserRouter>
  );
}

export default App;
