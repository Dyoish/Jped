import React from "react";
import { motion } from "framer-motion";
import Input from "../components/Input";  
import { Loader, Mail, Lock } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";


const LoginPage = () => {

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	
  const isLoading = false;

  const handleLogin = async (e) => {
		e.preventDefault();
		await login(email, password);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-md w-full bg-black bg-opacity-60 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden"
    >
      <div className="p-8">
        <h2 className="text-2xl font-bold mb-6 text-center text-white">
          Log in to J.ped
        </h2>
  
        <form onSubmit={handleLogin}>
          <Input
            icon={Mail}
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input
            icon={Lock}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <div className='flex items-center mb-6'>
            <Link to='/forgot-password' className='text-sm text-green-400 hover:underline'>
            Forgot Password?
            </Link>
          </div>

          <motion.button
						className='mt-5 w-full py-3 px-4 bg-gradient-to-r from-black-500 to-white-600 text-white font-bold rounded-lg shadow-lg hover:from-white
						hover:to-grey-700 focus:outline-none focus:ring-1 focus:ring-black-500 focus:ring-offset-2 focus:ring-offset-white-900 transition duration-200'
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type='submit'
            disabled={isLoading}

            >
            {isLoading ? <Loader className="w-6 h-6 animate-spin text-center mx-auto" /> : "Login"} 
          </motion.button>
        </form>
      </div>
      <div className='px-8 py-4 bg-gray-900 bg-opacity-50 flex justify-center'>
				<p className='text-sm text-gray-400'>
					Don't have an account?{" "}
					<Link to='/signup' className='text-white hover:underline'>
						Sign up
					</Link>
				</p>
			</div>
    </motion.div>
  );
    
};  

export default LoginPage;