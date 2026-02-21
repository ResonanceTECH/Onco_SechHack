import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LandingLayout } from './components/layout/LandingLayout';
import { AuthLayout } from './components/layout/AuthLayout';
import { DoctorChatLayout } from './components/layout/DoctorChatLayout';
import { ProtectedRoute } from './routes/ProtectedRoute';
import { LandingPage } from './pages/LandingPage';
import { RoadmapPage } from './pages/RoadmapPage';
import { ComparisonPage } from './pages/ComparisonPage';
import { TeamPage } from './pages/TeamPage';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { ChatsPage } from './pages/doctor/ChatsPage';
import { HistoryPage } from './pages/doctor/HistoryPage';
import { GuidelinesPage } from './pages/doctor/GuidelinesPage';
import { NotificationsPage } from './pages/doctor/NotificationsPage';
import { ProfilePage } from './pages/doctor/ProfilePage';
import { HelpPage } from './pages/doctor/HelpPage';
import { ReportPage } from './pages/doctor/ReportPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingLayout />}>
          <Route index element={<LandingPage />} />
          <Route path="roadmap" element={<RoadmapPage />} />
          <Route path="comparison" element={<ComparisonPage />} />
          <Route path="team" element={<TeamPage />} />
        </Route>

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
    </BrowserRouter>
  );
}
