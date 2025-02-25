import React, { useState } from "react";
import { DialogContent } from "../ui/dialog";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { useDispatch, useSelector } from "react-redux";
import { Badge } from "../ui/badge";
import { get_all_orders, get_order_details, update_order_status_for_user } from "@/store/shop/order-slice";
import CommonForm from "../common/form";
import { useToast } from "@/hooks/use-toast";

const initialState = {
  status: "",
};

const ShoppingOrderDetails = ({ itemDetails }) => {
  const { user } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState(initialState);
  const dispatch = useDispatch();
  const {toast} = useToast();

  const handleUpdateStatus = (e) => {
    e.preventDefault();
    const { status } = formData;
    dispatch(
      update_order_status_for_user({ id: itemDetails._id, orderStatus: status })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(get_order_details(itemDetails?._id));
        dispatch(get_all_orders(user?.id));
        setFormData(initialState);
        toast({
          title: "Order cancelled successfully",
        });
      }
    });
  };

  return (
    <DialogContent className="sm:max-w-[600px]">
      <div className="grid gap-6">
        <div className="grid gap-2">
          <div className="flex mt-2 items-center justify-between">
            <p className="font-medium">Order ID</p>
            <Label>{itemDetails._id}</Label>
          </div>
          <div className="flex mt-2 justify-between items-center">
            <p className="font-medium">Order Date</p>
            <Label>{itemDetails.orderDate.split("T")[0]}</Label>
          </div>
          <div className="flex mt-2 items-center justify-between">
            <p className="font-medium">Order Price</p>
            <Label>&#8377; {itemDetails.totalAmount}</Label>
          </div>
          <div className="flex mt-2 items-center justify-between">
            <p className="font-medium">Payment Method</p>
            <Label>{itemDetails.paymentMethod}</Label>
          </div>
          <div className="flex mt-2 items-center justify-between">
            <p className="font-medium">Payment Status</p>
            <Label>{itemDetails.paymentStatus}</Label>
          </div>
          <div className="flex mt-2 items-center justify-between">
            <p className="font-medium">Order Status</p>
            <Label>
              <Badge
                className={`py-1 px-3 ${
                  itemDetails?.orderStatus === "confirmed"
                    ? "bg-green-500"
                    : "bg-yellow-500"
                } text-md`}
              >
                {itemDetails?.orderStatus}
              </Badge>
            </Label>
          </div>
        </div>
        <Separator />
        <div className="grid gap-4">
          <div className="grid gap-2">
            <div className="font-medium">Order details</div>
            <ul className="grid gap-3">
              {itemDetails?.cartItems &&
                itemDetails?.cartItems?.length > 0 &&
                itemDetails.cartItems.map((item) => (
                  <li
                    className="flex items-center justify-between"
                    key={item._id}
                  >
                    <span>{item.title}</span>
                    <span>&#8377; {item.price}</span>
                  </li>
                ))}
            </ul>
          </div>
        </div>

        <div className="grid gap-4">
          <div className="grid gap-2">
            <div className="font-medium">Shipping Info.</div>
            <div className="grid gap-0.5 text-muted-foreground">
              <span>{user.username}</span>
              <span>{itemDetails?.addressInfo?.address}</span>
              <span>{itemDetails?.addressInfo?.city}</span>
              <span>{itemDetails?.addressInfo?.phone}</span>
              <span>{itemDetails?.addressInfo?.pincode}</span>
              <span>{itemDetails?.addressInfo?.notes}</span>
            </div>
          </div>
        </div>

        <div>
          <CommonForm
            formControls={[
              {
                label: "Order Status",
                name: "status",
                componentType: "select",
                options: [{ id: "Canceled", label: "Cancel" }],
              },
            ]}
            formData={formData}
            setFormData={setFormData}
            buttonText={"Cancel your order"}
            onSubmit={handleUpdateStatus}
            isBtnDisabled={itemDetails.orderStatus === "Canceled"}
          />
        </div>
      </div>
    </DialogContent>
  );
};

export default ShoppingOrderDetails;
