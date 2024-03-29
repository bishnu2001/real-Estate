import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useDispatch,useSelector } from "react-redux";
import { signinstart,signInFailure,signInSuccess } from "../redux/user/userSlice";
import OAuth from "../components/OAuth";

const Signin = () => {
  const [formdata, setFormdata] = useState({});
  const { loading, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleinput = (e) => {
    setFormdata({
      ...formdata,
      [e.target.id]: e.target.value,
    });
  };
  const handlesubmit = async (e) => {
    try {
      e.preventDefault();
      dispatch(signinstart());
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type":"application/json",
        },
        body: JSON.stringify(formdata),
      });
      const data = await res.json();
      console.log(data);
      dispatch(signInFailure(data))
      if(data.success){
        dispatch(signInSuccess(data))
         navigate("/");
      }else{
        console.log('check your email and password')
      }
    } catch (error) {
      console.log("info unable send check api ");
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Sign In</h1>
      <form className="flex flex-col gap-4" onSubmit={handlesubmit}>
        <input
          placeholder="email"
          className="border p-3 rounded-lg"
          id="email"
          onChange={handleinput}
        />
        <input
          placeholder="password"
          className="border p-3 rounded-lg"
          id="password"
          onChange={handleinput}
        />
        <button
          disabled={loading}
          className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
        >
          {loading ? "Loading" : "Sign in"}
        </button>
        <OAuth/>
      </form>
      <div className="flex gap-2 mt-5">
        <p>Dont Have an Account?</p>
        <Link to="/signup">
          <span className="text-blue-700">Sign up</span>
        </Link>
      </div>
      {error && <p className="text-red-500 mt-5">{error.message}</p>}
    </div>
  );
};

export default Signin;
