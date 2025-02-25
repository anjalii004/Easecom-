import { addressFormControls } from "@/config";
import CommonForm from "../common/form";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  add_new_address,
  edit_address,
  fetch_all_addresses,
} from "@/store/shop/address-slice";
import { useToast } from "@/hooks/use-toast";
import AddressCard from "./address-card";

const initialAddressFormData = {
  address: "",
  pincode: "",
  phone: "",
  notes: "",
  city: "",
};

function Address({ setCurrentSelectedAddress }) {
  const [formData, setFormData] = useState(initialAddressFormData);
  const [currentEditedId, setCurrentEditedId] = useState(null);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { addressList } = useSelector((state) => state.shopAddress);
  const { toast } = useToast();

  const handleManageAddress = (e) => {
    e.preventDefault();
    if (addressList.length >= 3 && currentEditedId === null) {
        setFormData(initialAddressFormData);
      toast({
        title: "You can add 3 addresses at max",
        variant: "destructive",
      });
      return;
    }
    currentEditedId !== null
      ? dispatch(
          edit_address({
            userId: user?.id,
            addressId: currentEditedId,
            formData,
          })
        ).then((data) => {
          if (data?.payload?.success) {
            dispatch(fetch_all_addresses(user?.id));
            setCurrentEditedId(null);
            setFormData(initialAddressFormData);
            toast({ title: "Address Updated Successfully" });
          }
        })
      : dispatch(add_new_address({ ...formData, userId: user?.id })).then(
          (data) => {
            console.log("Address data = ", data);
            if (data?.payload?.success) {
              dispatch(fetch_all_addresses(user?.id));
              setFormData(initialAddressFormData);
              toast({ title: "Address Added Successfully" });
            }
          }
        );
  };
  const formDataValid = () => {
    return Object.keys(formData)
      .map((key) => formData[key] !== "")
      .every((item) => item);
  };

  const handleEditAddress = (getCurrentAddress) => {
    setCurrentEditedId(getCurrentAddress._id);
    setFormData({
      ...formData,
      address: getCurrentAddress?.address,
      pincode: getCurrentAddress?.pincode,
      phone: getCurrentAddress?.pincode,
      notes: getCurrentAddress?.notes,
      city: getCurrentAddress?.city,
    });
  };

  useEffect(() => {
    dispatch(fetch_all_addresses(user?.id));
  }, [dispatch]);

  console.log("Address List = ", addressList);
  return (
    <Card>
      <div className="mb-5 p-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
        {addressList && addressList.length > 0
          ? addressList.map((item) => (
              <AddressCard
                addressInfo={item}
                key={item._id}
                handleEditAddress={handleEditAddress}
                setCurrentSelectedAddress={setCurrentSelectedAddress}
              />
            ))
          : null}
      </div>
      <CardHeader>
        <CardTitle>
          {currentEditedId !== null ? "Edit your address" : "Add new address"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <CommonForm
          formData={formData}
          formControls={addressFormControls}
          setFormData={setFormData}
          buttonText={currentEditedId !== null ? "Edit address" : "Add address"}
          onSubmit={handleManageAddress}
          isBtnDisabled={!formDataValid()}
        />
      </CardContent>
    </Card>
  );
}

export default Address;
