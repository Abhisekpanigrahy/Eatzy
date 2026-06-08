import React, { useContext, useState } from 'react'
import './LoginPopup.css'
import { assets } from '../../assets/assets'
import { StoreContext } from '../../Context/StoreContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const LoginPopup = () => {

    const { setToken, url, loadCartData, setShowLogin } = useContext(StoreContext)
    const [loading, setLoading] = useState(false);
    const [currState, setCurrState] = useState("Login"); // Default to Login

    const [data, setData] = useState({
        name: "",
        email: "",
        password: ""
    })

    const [resetEmail, setResetEmail] = useState("");
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [forgotStep, setForgotStep] = useState(1); // 1: Email, 2: OTP & New Password
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");

    const onChangeHandler = (event) => {
        const name = event.target.name
        const value = event.target.value
        setData(data => ({ ...data, [name]: value }))
    }

    const validate = () => {
        if (currState === "Sign Up" && data.name.trim().length < 2) {
            toast.error("Name must be at least 2 characters");
            return false;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            toast.error("Please enter a valid email address");
            return false;
        }
        if (data.password.length < 6) {
            toast.error("Password must be at least 6 characters");
            return false;
        }
        return true;
    }

    const onLogin = async (e) => {
        e.preventDefault()
        if (!validate()) return;
        
        setLoading(true);

        let new_url = url;
        if (currState === "Login") {
            new_url += "/api/user/login";
        }
        else {
            new_url += "/api/user/register"
        }
        try {
            const response = await axios.post(new_url, data);
            if (response.data.success) {
                setToken(response.data.token)
                localStorage.setItem("token", response.data.token)
                loadCartData({ token: response.data.token })
                setShowLogin(false)
                toast.success(`${currState} successful!`)
            }
            else {
                toast.error(response.data.message)
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "An error occurred. Please try again.")
        } finally {
            setLoading(false);
        }
    }

    const handleSendOtp = async (e) => {
        e.preventDefault();
        if (!resetEmail) {
            toast.error("Please enter your email");
            return;
        }
        setLoading(true);
        try {
            const response = await axios.post(`${url}/api/user/forgot-password`, { email: resetEmail });
            if (response.data.success) {
                toast.success("OTP sent to your email!");
                setForgotStep(2);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error("Failed to send OTP. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (!otp || !newPassword) {
            toast.error("All fields are required");
            return;
        }
        if (newPassword.length < 8) {
            toast.error("Password must be at least 8 characters");
            return;
        }
        setLoading(true);
        try {
            const response = await axios.post(`${url}/api/user/reset-password`, { 
                email: resetEmail, 
                otp: otp, 
                newPassword: newPassword 
            });
            if (response.data.success) {
                toast.success("Password reset successfully! Please login.");
                setShowForgotPassword(false);
                setForgotStep(1);
                setCurrState("Login");
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error("Failed to reset password. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    if (showForgotPassword) {
        return (
            <div className='login-popup'>
                {forgotStep === 1 ? (
                    <form onSubmit={handleSendOtp} className="login-popup-container">
                        <div className="login-popup-title">
                            <h2>Reset Password</h2> <img onClick={() => setShowLogin(false)} src={assets.cross_icon} alt="" />
                        </div>
                        <div className="login-popup-inputs">
                            <p className="forgot-password-note">Enter your email address and we'll send you an OTP to reset your password.</p>
                            <input 
                                type="email" 
                                placeholder='Your email' 
                                value={resetEmail} 
                                onChange={(e) => setResetEmail(e.target.value)} 
                                required 
                            />
                        </div>
                        <button type='submit' disabled={loading}>
                            {loading ? <div className='loader'></div> : "Send OTP"}
                        </button>
                        <p className="back-to-login">
                            Wait, I remember my password! <span onClick={() => setShowForgotPassword(false)}>Back to Login</span>
                        </p>
                    </form>
                ) : (
                    <form onSubmit={handleResetPassword} className="login-popup-container">
                        <div className="login-popup-title">
                            <h2>Reset Password</h2> <img onClick={() => setShowLogin(false)} src={assets.cross_icon} alt="" />
                        </div>
                        <div className="login-popup-inputs">
                            <p className="forgot-password-note">Enter the 6-digit OTP sent to <strong>{resetEmail}</strong> and your new password.</p>
                            <input 
                                type="text" 
                                placeholder='6-digit OTP' 
                                value={otp} 
                                onChange={(e) => setOtp(e.target.value)} 
                                required 
                            />
                            <input 
                                type="password" 
                                placeholder='New Password' 
                                value={newPassword} 
                                onChange={(e) => setNewPassword(e.target.value)} 
                                required 
                            />
                        </div>
                        <button type='submit' disabled={loading}>
                            {loading ? <div className='loader'></div> : "Reset Password"}
                        </button>
                        <p className="back-to-login">
                            <span onClick={() => setForgotStep(1)}>Resend OTP</span>
                        </p>
                    </form>
                )}
            </div>
        )
    }

    return (
        <div className='login-popup'>
            <form onSubmit={onLogin} className="login-popup-container">
                <div className="login-popup-title">
                    <h2>{currState}</h2> <img onClick={() => setShowLogin(false)} src={assets.cross_icon} alt="" />
                </div>
                <div className="login-popup-inputs">
                    {currState === "Sign Up" ? <input name='name' onChange={onChangeHandler} value={data.name} type="text" placeholder='Your name' required /> : <></>}
                    <input name='email' onChange={onChangeHandler} value={data.email} type="email" placeholder='Your email' required />
                    <input name='password' onChange={onChangeHandler} value={data.password} type="password" placeholder='Password' required />
                </div>
                
                {currState === "Login" && (
                    <p className="forgot-password-link" onClick={() => setShowForgotPassword(true)}>
                        Forgot Password?
                    </p>
                )}

                <button type='submit' disabled={loading}>
                    {loading ? <div className='loader'></div> : (currState === "Login" ? "Login" : "Create account")}
                </button>
                <div className="login-popup-condition">
                    <input type="checkbox" name="" id="" required />
                    <p>By continuing, i agree to the terms of use & privacy policy.</p>
                </div>
                {currState === "Login"
                    ? <p>Create a new account? <span onClick={() => setCurrState('Sign Up')}>Click here</span></p>
                    : <p>Already have an account? <span onClick={() => setCurrState('Login')}>Login here</span></p>
                }
            </form>
        </div>
    )
}

export default LoginPopup
