import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Unlock from '@/pages/Unlock';
import Accounts from '@/pages/Accounts';
import AccountDetail from '@/pages/AccountDetail';
import AccountEdit from '@/pages/AccountEdit';
import Settings from '@/pages/Settings';
import RequireUnlocked from '@/components/RequireUnlocked';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/accounts" replace />} />
        <Route path="/unlock" element={<Unlock />} />
        <Route
          path="/accounts"
          element={
            <RequireUnlocked>
              <Accounts />
            </RequireUnlocked>
          }
        />
        <Route
          path="/accounts/new"
          element={
            <RequireUnlocked>
              <AccountEdit />
            </RequireUnlocked>
          }
        />
        <Route
          path="/accounts/:id"
          element={
            <RequireUnlocked>
              <AccountDetail />
            </RequireUnlocked>
          }
        />
        <Route
          path="/accounts/:id/edit"
          element={
            <RequireUnlocked>
              <AccountEdit />
            </RequireUnlocked>
          }
        />
        <Route
          path="/settings"
          element={
            <RequireUnlocked>
              <Settings />
            </RequireUnlocked>
          }
        />
        <Route path="*" element={<Navigate to="/accounts" replace />} />
      </Routes>
    </Router>
  );
}
