import type React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import PrivateRoute from "./auth/PrivateRoute";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import BlogListPage from "./pages/BlogListPage";
import BlogDetailPage from "./pages/BlogDetailPage";
import BlogEditPage from "./pages/BlogEditPage";


const App: React.FC = () => {
  return(
    <Routes>
      <Route path="/" element={<PrivateRoute><BlogListPage/></PrivateRoute>}></Route>
      <Route path="/blog/:slug" element={<PrivateRoute><BlogDetailPage/></PrivateRoute>}></Route>
      <Route path="/blog/new" element={<PrivateRoute><BlogEditPage/></PrivateRoute>}></Route>
      <Route path="/blog/edit/:id" element={<PrivateRoute><BlogEditPage/></PrivateRoute>}></Route>
      <Route path="/login" element={<LoginPage/>}></Route>
      <Route path="/register" element={<RegisterPage/>}></Route>
      <Route path="*" element={<Navigate to="/" replace></Navigate>}></Route>
    </Routes>
  );
};
export default App;