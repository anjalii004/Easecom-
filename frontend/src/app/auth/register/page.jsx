import CommonForm from "@/components/common/form";
import { registerControls } from "@/config";
import { useToast } from "@/hooks/use-toast";
import { registerUser } from "@/store/auth-slice";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

const initialState = {
  username: "",
  email: "",
  password: "",
};

const AuthRegister = () => {
  const [formData, setFormData] = useState(initialState);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {toast} = useToast();

  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(registerUser(formData)).then((data) => {
      if(data?.payload?.success) {
        toast({
          title: "User registered succuessfully", 
        })
        navigate('/auth/login');
      } else {
        toast({
          title: "Error in creating new user",
          variant: "destructive",
        })
      }
      console.log(data);
    });
  };

  return (
    <div className="mx-auto w-full max-w-md space-y-6 bg-gray-200 p-12 rounded-md">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground ">
          Create new account
        </h1>
        <p className="font-semibold mt-2">
          Already have an account ?? <Link to="/auth/login"> Login </Link>
        </p>
      </div>
      <CommonForm
        formControls={registerControls}
        buttonText={"Sign-up"}
        formData={formData}
        setFormData={setFormData}
        onSubmit={onSubmit}
      />
    </div>
  );
};

export default AuthRegister;
