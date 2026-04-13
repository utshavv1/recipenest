import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Chefs from './pages/Chefs';
import ChefProfile from './pages/ChefProfile';
import RecipePage from './pages/RecipePage';
import Login from './pages/Login';
import Register from './pages/Register';
import ChefDashboard from './pages/ChefDashboard';
import AddRecipe from './pages/AddRecipe';
import EditRecipe from './pages/EditRecipe';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import SplashScreen from './components/SplashScreen';
import AllRecipes from './pages/AllRecipes';

const Layout = () => (
  <>
    <Navbar />
    <Outlet />
    <Footer />
  </>
);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SplashScreen />} />
        <Route element={<Layout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/chefs" element={<Chefs />} />
          <Route path="/chefs/:id" element={<ChefProfile />} />
          <Route path="/recipes/:id" element={<RecipePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<ProtectedRoute allowedRoles={['chef', 'admin']}><ChefDashboard /></ProtectedRoute>} />
          <Route path="/add-recipe" element={<ProtectedRoute allowedRoles={['chef', 'admin']}><AddRecipe /></ProtectedRoute>} />
          <Route path="/edit-recipe/:id" element={<ProtectedRoute allowedRoles={['chef', 'admin']}><EditRecipe /></ProtectedRoute>} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
          <Route path="/recipes" element={<AllRecipes />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;