import CommonForm from "@/components/common/form";
import { loginControls } from "@/config";
import { useToast } from "@/hooks/use-toast";
import { loginUser } from "@/store/auth-slice";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

const initialState = {
  email: "",
  password: "",
};

const AuthLogin = () => {
  const [formData, setFormData] = useState(initialState);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {toast} = useToast();

  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser(formData)).then((data) => {
      if(data?.payload?.success) {
        toast({ title: "User signed-in successfully"});
        if(data?.payload?.role === "admin")  navigate("/admin/dashboard"); 
        else navigate("/shop/home");
      } else {
        toast({
          title: "Couldn't sign in user",
          variant: "destructive",
        });
      }
    });
  };
  return (
    <div className="mx-auto w-full max-w-md space-y-6 bg-gray-200 p-12 rounded-md">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground ">
          Sign-in to your account
        </h1>
        <p className="font-semibold mt-2">
          New to Easecom shopping ?? <Link to="/auth/register"> Register </Link>
        </p>
      </div>
      <CommonForm
        formControls={loginControls}
        buttonText={"Sign-in"}
        formData={formData}
        setFormData={setFormData}
        onSubmit={onSubmit}
      />
    </div>
  );
};

export default AuthLogin;
