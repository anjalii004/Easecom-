import { useDispatch, useSelector } from "react-redux";
import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Label } from "../ui/label";
import {
  delete_address,
  fetch_all_addresses,
} from "@/store/shop/address-slice";

function AddressCard({
  addressInfo,
  handleEditAddress,
  setCurrentSelectedAddress,
}) {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const handleDeleteAddress = (getAddressId, getUserId) => {
    dispatch(
      delete_address({ userId: getUserId, addressId: getAddressId })
    ).then((data) => {
      console.log("Deleted address", data);
      if (data?.payload?.success) {
        dispatch(fetch_all_addresses(user?.id));
        toast({ title: "Address Added Successfully" });
      }
    });
  };

  return (
    <Card
      onClick={
        setCurrentSelectedAddress
          ? () => setCurrentSelectedAddress(addressInfo)
          : null
      }
      className="py-2 shadow-xl flex flex-col"
    >
      <CardContent className="flex flex-col gap-2 mt-4 items-start justify-start">
        <Label>Address: {addressInfo?.address}</Label>
        <Label>City: {addressInfo?.city}</Label>
        <Label>Pincode: {addressInfo?.pincode}</Label>
        <Label>Phone: {addressInfo?.phone}</Label>
        <Label>Notes: {addressInfo?.notes}</Label>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button onClick={() => handleEditAddress(addressInfo)}>Edit</Button>
        <Button onClick={() => handleDeleteAddress(addressInfo._id, user?.id)}>
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
}

export default AddressCard;
