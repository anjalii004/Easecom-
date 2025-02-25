import ProductDetailsDialog from "@/components/shopping-view/product-details";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { add_to_cart, fetch_cart_items } from "@/store/shop/cart-slice";
import { fetchProductDetails } from "@/store/shop/product-slice";
import { get_all_review } from "@/store/shop/review-slice";
import { get_search_results } from "@/store/shop/search-slice";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";

const SaerchPage = () => {
  const [keyword, setKeyword] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const { results } = useSelector((state) => state.shopSearch);
  const { cartItems } = useSelector((state) => state.shopCart);
  const { reviews } = useSelector((state) => state.shopReview);
  const { user } = useSelector((state) => state.auth);
  const { productDetails } = useSelector((state) => state.shopProducts);
  const [openDetailsDialogue, setOpenDetailsDialogue] = useState(false);
  const {toast} = useToast();
  const dispatch = useDispatch();

  useEffect(() => {
    if (keyword && keyword.trim() !== "" && keyword.trim().length > 3) {
      setTimeout(() => {
        setSearchParams(new URLSearchParams(`?keyword=${keyword}`));
        dispatch(get_search_results(keyword));
      }, 1000);
    }
  }, [keyword]);

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
          title: "Hurray!! Product added to cart.",
        });
      }
    });
  };

  useEffect(() => {
    if(productDetails !== null) setOpenDetailsDialogue(true);
  }, [productDetails]);

  console.log({ results });

  return (
    <div className="container mx-auto md:px-6 px-4 py-8">
      <div className="flex justify-center mb-8 ">
        <div className="w-full flex items-center ">
          <Input
            className="py-6"
            placeholder="Search your requirements here"
            name="keyword"
            onChange={(e) => setKeyword(e.target.value)}
            value={keyword}
          />
        </div>
      </div>
      {!results?.length &&
        <>
          <h1 className="text-5xl font-extrabold">No search result found!</h1>
        </>
      }
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {results &&
          results.length > 0 &&
          results.map((result, idx) => (
            <ShoppingProductTile key={idx}
              handleAddToCart={handleAddToCart}
              product={result}
              handleGetProductDetails={handleGetProductDetails}
            />
          ))}
      </div>

      <ProductDetailsDialog
        open={openDetailsDialogue}
        setOpen={setOpenDetailsDialogue}
        product={productDetails}
      />
    </div>
  );
};

export default SaerchPage;

// Residence
