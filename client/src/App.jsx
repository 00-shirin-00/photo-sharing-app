//---------------styles >>
//styled-components 
import { ThemeProvider } from 'styled-components';
import GlobalStyles from "./styles/GlobalStyles";
import theme from './styles/theme';
//----------------React Router
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

//---------------components >>
import RegisterPage from './features/auth/RegisterPage';
import LoginPage from './features/auth/LoginPage';
import Header from './components/layout/Header';
import ProfilePage from './pages/ProfilePage';
import ProtectedRoute from './components/common/ProtectedRoute';
// ==========================================================

export default function App() {
  return (
    //  به عنوان والد اصلی برای GlobalStyles و Router عمل می‌کنه
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <Router>
        <Header />
        <Routes>
          {/* روت های عمومی---------------------------- */}
          <Route path="/" element={<div>Home</div>} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/creators" element={<div>صفحه سازندگان</div>} />
          <Route path="/all-pics" element={<div>صفحه همه عکس ها</div>} />
          <Route path="*" element={<div>صفحه یافت نشد (404)</div>} />
          {/* روت های محافظت شده---------------------- */}
          {/* ProtectedRoute وضعیت لاگین رو چک می‌کنه.>> */}
          <Route element={<ProtectedRoute />}>
            <Route path="/profile" element={<ProfilePage />} />
            {/* <Route path="/dashboard" element={<DashboardPage />} /> */}
            {/* <Route path="/upload" element={<UploadPage />} /> */}
            {/* <Route path="/saved" element={<SavedPage />} /> */}
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}


