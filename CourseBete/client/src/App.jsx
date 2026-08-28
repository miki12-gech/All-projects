import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


import Navbar from './components/Navbar';
import Footer from './components/Footer';


import Home from './pages/Home';
import About from './pages/About';
import Register from './pages/Register';
import Login from './pages/Login';


import Dashboard from './pages/Dashboard';
import CoursePlayer from './pages/CoursePlayer';


import AdminDashboard from './pages/AdminDashboard';
import CreateCourse from './pages/CreateCourse';
import EditCourse from './pages/EditCourse'; 
import AddLesson from './pages/AddLesson';


import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';

function App() {
  return (
    <Router>
    
      <div className="flex flex-col min-h-screen">
        
        <Navbar />
        
  
        <main className="flex-grow bg-gray-50">
          <Routes>
           
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />

            <Route 
              path="/dashboard" 
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/course/:id" 
              element={
                <PrivateRoute>
                  <CoursePlayer />
                </PrivateRoute>
              } 
            />

           
            <Route 
              path="/admin" 
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              } 
            />
            <Route 
              path="/admin/create-course" 
              element={
                <AdminRoute>
                  <CreateCourse />
                </AdminRoute>
              } 
            />
            <Route 
              path="/admin/edit-course/:id" 
              element={
                <AdminRoute>
                  <EditCourse />
                </AdminRoute>
              } 
            />
            <Route 
              path="/admin/course/:courseId/add-lesson" 
              element={
                <AdminRoute>
                  <AddLesson />
                </AdminRoute>
              } 
            />
          </Routes>
        </main>

        <Footer />
        
      </div>
    </Router>
  );
}

export default App;