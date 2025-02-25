import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import UserCartItemsContent from "./cart-items-content";

function UserCartWrapper({ cartItems, setOpenCartSheet }) {
  const totalAmt =
    cartItems && cartItems.length > 0
      ? cartItems.reduce(
          (sum, currentItem) =>
            sum +
            (currentItem?.salePrice > 0
              ? currentItem.salePrice
              : currentItem.price) *
              currentItem?.quantity,
          0
        )
      : 0;

  const naviagte = useNavigate();
  return (
    <SheetContent className="sm:max-w-md">
      <SheetHeader className={`bg-[#AABA9E]`}>
        <SheetTitle className="pl-2 py-4">Your cart</SheetTitle>
      </SheetHeader>
      <div className="mt-8 space-y-4">
        {cartItems && cartItems.length > 0
          ? cartItems.map((items) => (
              <UserCartItemsContent key={items.productId} cartItem={items} />
            ))
          : null}
      </div>
      <div className="mt-8 space-y-4">
        <div className="justify-between flex">
          <span className="font-bold">Total</span>
          <span className="font-bold">&#8377; {totalAmt}</span>
        </div>
      </div>
      <Button
        onClick={() => {
          naviagte("/shop/check-out");
          setOpenCartSheet(false);
        }}
        className="w-full mt-5 bg-[#AABA9E] text-black"
      >
        Checkout
      </Button>
    </SheetContent>
  );
}

export default UserCartWrapper;
