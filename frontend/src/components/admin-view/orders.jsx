import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Dialog } from "../ui/dialog";
import AdminOrderDetails from "./order-details";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { useDispatch, useSelector } from "react-redux";
import { get_all_orders_for_admin, get_order_details_for_admin, resetOrderDetailsForAdmin } from "@/store/admin/order-slice";
import { Badge } from "../ui/badge";

const AdminOrdersView = () => {
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null); // Store the selected order ID
  const { orderDetails, orderList } = useSelector((state) => state.adminOrders);
  const dispatch = useDispatch();

  const handleFetchOrderDetails = (getId) => {
    setSelectedOrderId(getId); 
    dispatch(get_order_details_for_admin(getId));
  };

  useEffect(() => {
    dispatch(get_all_orders_for_admin());
  }, [dispatch]);

  useEffect(() => {
    if (orderDetails !== null) setOpenDetailsDialog(true);
  }, [orderDetails]);

  console.log("Order list = ", orderList);

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
                        onClick={() => handleFetchOrderDetails(item?._id)}
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

      {/* Dialog for displaying order details */}
      <Dialog
        open={openDetailsDialog}
        onOpenChange={() => {
          setOpenDetailsDialog(false);
          dispatch(resetOrderDetailsForAdmin());
        }}
      >
        {orderDetails && selectedOrderId && (
          <AdminOrderDetails orderDetails={orderDetails} />
        )}
      </Dialog>
    </Card>
  );
};

export default AdminOrdersView;
