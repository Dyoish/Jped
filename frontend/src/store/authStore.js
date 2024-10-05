import {create} from "zustand"; //this is state management library, ginawa to para sa mga functions ng authentication
import axios from "axios";

const API_URL = "http://localhost:5000/api/auth";
axios.defaults.withCredentials = true; //sa every request, axios will just put the cookies into the request
export const useAuthStore = create((set) => ({
    user:null, //once we sign up, mag uppdate siya into actual user
    isAuthenticated:false,
    error:null,
    isLoading:false,
    isCheckingAuth:true,

    signup: async(email,password,name) => {
        set({isLoading:true,error:null});
        try {
            const response = await axios.post(`${API_URL}/signup`,{email,password,name}); //to extract data
            set({user: response.data.user, isAuthenticated:true, isLoading:false}) // after niyang pumunta sa auth.Controller, ma veverify na niya yong user.
        } catch (error) {
            set({error:error.response.data.message || "Error signing up", isLoading:false});
            throw error;
        }
    },

    verifyEmail: async (verificationCode) => {
        set({isLoading:true,error:null});
        try {
            const response = await axios.post(`${API_URL}/verify-email`,{verificationCode});
            set({user: response.data.user, isAuthenticated: true, isLoading: false});
            return response.data
        } catch (error) {
            set({error:error.response.data.message || "Error verifying email", isLoading:false});
            throw error;
        }
    },
    
}));