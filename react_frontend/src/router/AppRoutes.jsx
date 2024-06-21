import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from '../pages/Home/Home';
import Top from '../pages/Top/Top';
import Detail from '../pages/Detail/Detail';
import Login from '../pages/Auth/Login';
import Logout from '../pages/Auth/Login';
import Register from '../pages/Auth/Register';
import { AuthProvider } from '../contexts/AuthContext';
import Test from '../pages/Test';
import MoviesWallet from '../pages/Saves/MoviesWallet';
const AppRoutes = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/top-10" element={<Top />} />
          <Route path="/detail" element={<Detail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/register" element={<Register />} />
          <Route path="/test" element={<Test />} />
          <Route path="/wallet" element={<MoviesWallet />} />
        </Routes>
      </Router>
      </AuthProvider>
  );
};

export default AppRoutes;