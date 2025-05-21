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
// ==========================================================

export default function App() {
  return (
    //  به عنوان والد اصلی برای GlobalStyles و Router عمل می‌کنه
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<div>Home</div>} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}


