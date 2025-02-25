import { Minus, Plus, Trash } from "lucide-react";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { delete_cart_item, edit_cart_item } from "@/store/shop/cart-slice";
import { useToast } from "@/hooks/use-toast";

function UserCartItemsContent({ cartItem }) {
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const dispatch = useDispatch();
  const { toast } = useToast();

  function handleCartItemDelete(getCartItem) {
    dispatch(
      delete_cart_item({
        userId: user?.id,
        productId: getCartItem?.productId,
      })
    ).then((data) => {
      if (data?.payload?.success)
        toast({ title: "Cart item updated successfully" });
    });
  }

  const handleUpdateCartItem = (getCartItem, typeOfAction) => {
    console.log({ getCartItem });
    
    if (typeOfAction === "plus") {
      let getCartItems = cartItems.item || [];
      if (getCartItems.length) {
        const indexOfCurrentItems = getCartItems.findIndex(
          (item) => item.productId === getCurrentProductID
        );
        const getCurrentProductIndex = productList.findIdx(product => product._id === getCartItem.productId);
        const getTotalStock = productList[getCurrentProductIndex].totalStock;
        if (indexOfCurrentItems > -1) {
          const getQuantity = getCartItems[indexOfCurrentItems].quantity;
          if (getQuantity + 1 > getTotalStock) {
            toast({
              title: `Only ${getTotalStock} items are available in stock`,
              variant: "destructive",
            });

            return;
          }
        }
      }
    }
    dispatch(
      edit_cart_item({
        userId: user?.id,
        productId: getCartItem?.productId,
        quantity:
          typeOfAction === "plus"
            ? getCartItem?.quantity + 1
            : getCartItem?.quantity - 1,
      })
    ).then((data) => {
        if (data?.payload?.success)
          toast({ title: "Cart item updated successfully" });
      })
      .catch((err) => console.log("Error updating the cart item ", err));
  };

  return (
    <div className="flex items-center space-x-4">
      <img
        src={cartItem?.image}
        alt={cartItem?.title}
        className="w-20 h-20 rounded object-cover"
      />
      <div className="flex-1">
        <h3 className="font-extrabold">{cartItem?.title}</h3>
        <div className="flex items-center mt-1">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-full"
            disabled={cartItem.quantity === 1}
            onClick={() => handleUpdateCartItem(cartItem, "minus")}
          >
            <Minus className="w-4 h-4" />{" "}
            <span className="sr-only">Decrease</span>
          </Button>
          <span className="font-semibold mx-2">{cartItem?.quantity}</span>
          <Button
            variant="outline"
            className="h-8 w-8 rounded-full"
            size="icon"
            onClick={() => handleUpdateCartItem(cartItem, "plus")}
          >
            <Plus className="w-4 h-4" />
            <span className="sr-only">Increase</span>
          </Button>
        </div>
      </div>

      <div className="flex flex-col items-end">
        <p className="font-semibold text-sm">
          &#8377;{" "}
          {(
            (cartItem.salePrice > 0 ? cartItem.salePrice : cartItem?.price) *
            cartItem?.quantity
          ).toFixed(2)}
        </p>
        <Trash
          onClick={() => handleCartItemDelete(cartItem)}
          className="cursor-pointer mt-1 h-4 w-4"
        />
      </div>
    </div>
  );
}

export default UserCartItemsContent;
