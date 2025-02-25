import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Dialog } from "../ui/dialog";
import ShoppingOrderDetails from "./order-details";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { useDispatch, useSelector } from "react-redux";
import {
  get_all_orders,
  get_order_details,
  resetOrderDetails,
} from "@/store/shop/order-slice";
import { Badge } from "../ui/badge";

const ShoppingOrders = () => {
  const [openDialogDetails, setOpenDetailsDialog] = useState(null); // Store order ID for which dialog should open
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { orderList, orderDetails } = useSelector((state) => state.shopOrder);

  const handleFetchOrderDetails = (orderId) => {
    dispatch(get_order_details(orderId));
    setOpenDetailsDialog(orderId); // Set the current order ID to open the dialog
  };

  useEffect(() => {
    dispatch(get_all_orders(user?.id));
  }, [dispatch, user]);

  useEffect(() => {
    if (orderDetails) setOpenDetailsDialog(orderDetails._id);
  }, [orderDetails]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Orders' history</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Order Date</TableHead>
              <TableHead>Order status</TableHead>
              <TableHead>Order Price</TableHead>
              <TableHead>
                <span className="sr-only">Details</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orderList && orderList.length > 0
              ? orderList.map((item, idx) => (
                  <TableRow
                    key={idx}
                    className="hover:bg-black my-2 hover:text-white"
                  >
                    <TableCell>{item?._id}</TableCell>
                    <TableCell>{item?.orderDate.split("T")[0]}</TableCell>
                    <TableCell>
                      <Badge
                        className={`py-1 px-3 ${
                          item?.orderStatus === "confirmed"
                            ? "bg-green-500"
                            : "bg-yellow-500"
                        } text-md`}
                      >
                        {item?.orderStatus}
                      </Badge>
                    </TableCell>
                    <TableCell>&#8377; {item?.totalAmount}</TableCell>
                    <TableCell>
                      <Button
                        onClick={() => handleFetchOrderDetails(item._id)}
                      >
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              : null}
          </TableBody>
        </Table>
      </CardContent>

      {/* Dialog Component Outside of Table */}
      <Dialog
        open={openDialogDetails !== null}
        onOpenChange={() => {
          setOpenDetailsDialog(null);
          dispatch(resetOrderDetails());
        }}
      >
        {orderDetails && orderDetails._id === openDialogDetails && (
          <ShoppingOrderDetails itemDetails={orderDetails} />
        )}
      </Dialog>
    </Card>
  );
};

export default ShoppingOrders;