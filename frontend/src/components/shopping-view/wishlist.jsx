import { fetch_wishlist_items } from "@/store/shop/wishlist-slice";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ShoppingProductTile from "./product-tile";
import { fetchProductDetails } from "@/store/shop/product-slice";
import { get_all_review } from "@/store/shop/review-slice";
import { add_to_cart, fetch_cart_items } from "@/store/shop/cart-slice";
import ProductDetailsDialog from "./product-details";
import { useToast } from "@/hooks/use-toast";

const Wishlist = () => {
  const { user } = useSelector((state) => state.auth);
  const { wishlist } = useSelector((state) => state.shopWishlist);
  const { cartItems } = useSelector((state) => state.shopCart);
  const { productDetails } = useSelector((state) => state.shopProducts);
  const [openDetailsDialogue, setOpenDetailsDialogue] = useState(false);
  const { toast } = useToast();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetch_wishlist_items(user?.id)).then((data) => {
      toast({ title: "Fetched wishlist items" });
    });
  }, [dispatch]);

  const handleGetProductDetails = (getCurrentProdId) => {
    dispatch(fetchProductDetails(getCurrentProdId));
    dispatch(get_all_review());
  };

  const handleAddToCart = (getCurrentProductID, getTotalStock) => {
    let getCartItems = cartItems.items || [];
    if (getCartItems.length) {
      const indexOfCurrentItems = getCartItems.findIndex(
        (item) => item.productId === getCurrentProductID
      );
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
    dispatch(
      add_to_cart({
        userId: user?.id,
        productId: getCurrentProductID,
        quantity: 1,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetch_cart_items(user?.id));
        toast({
          title: "added item to cart successfully",
        });
      }
    });
  };

  useEffect(() => {
    if (productDetails !== null) setOpenDetailsDialogue(true);
  }, [productDetails]);

  return (
    <div className="container mx-auto md:px-6 px-4 py-8 bg-black h-full mt-4">
      <div>
        {wishlist?.length === 0 ? (
          <h1 className="text-5xl font-extrabold">No items in wishlist</h1>
        ) : null}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-5">
        {wishlist?.items &&
          wishlist?.items?.length > 0 ?
          wishlist.items?.map((item, idx) => ( 
            <ShoppingProductTile
              key={idx}
              handleAddToCart={handleAddToCart}
              product={item}
              handleGetProductDetails={handleGetProductDetails}
            />
          )) : null}
      </div>
      <ProductDetailsDialog
        open={openDetailsDialogue}
        setOpen={setOpenDetailsDialogue}
        product={productDetails}
      />
    </div>
  );
};

export default Wishlist;
