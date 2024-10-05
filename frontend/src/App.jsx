import { Route, Routes } from "react-router-dom";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import EmailVerificationPage from "./pages/EmailVerificationPage";

import { Toaster } from "react-hot-toast";

function App() {
  return (
    <div className='min-h-screen bg-white flex items-center justify-center relative overflow-hidden'>
 
      <Routes>
        <Route path="/" element={<div>Home</div>} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/verify-email" element={<EmailVerificationPage />} />
      </Routes>
      <Toaster/>
    </div>
  );
}

export default App;