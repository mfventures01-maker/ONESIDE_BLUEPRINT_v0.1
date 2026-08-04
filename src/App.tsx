import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AppRoutes from './routes';
import AdminShield from './components/AdminShield';
import { ShellStateProvider } from './state/Contexts';

export default function App() {
  return (
    <BrowserRouter>
      <ShellStateProvider>
        <Routes>
          <Route path="*" element={<AppRoutes />} />
        </Routes>
        <AdminShield />
      </ShellStateProvider>
    </BrowserRouter>
  );
}
