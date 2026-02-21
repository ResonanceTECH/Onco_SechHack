import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { AuthLayout } from '../components/layout/AuthLayout';
import { DoctorChatLayout } from '../components/layout/DoctorChatLayout';
import { LoginPage } from '../pages/auth/LoginPage';
import { RegisterPage } from '../pages/auth/RegisterPage';
import { ChatsPage } from '../pages/doctor/ChatsPage';
import { HistoryPage } from '../pages/doctor/HistoryPage';
import { GuidelinesPage } from '../pages/doctor/GuidelinesPage';
import { NotificationsPage } from '../pages/doctor/NotificationsPage';
import { ProfilePage } from '../pages/doctor/ProfilePage';
import { HelpPage } from '../pages/doctor/HelpPage';
import { ReportPage } from '../pages/doctor/ReportPage';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/auth" element={<AuthLayout />}>
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
      </Route>

      <Route
        path="/doctor"
        element={
          <ProtectedRoute>
            <DoctorChatLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/doctor/chats" replace />} />
        <Route path="chats" element={<ChatsPage />} />
        <Route path="history" element={<HistoryPage />} />
        <Route path="guidelines" element={<GuidelinesPage />} />
        <Route path="notifications" element={<NotificationsPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="help" element={<HelpPage />} />
        <Route path="check/:id/report" element={<ReportPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
