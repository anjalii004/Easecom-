import { brandOptionsMap, categoryOptionsMap } from "@/config";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Heart, HeartCrack } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  add_to_wishlist,
  delete_wishlist_items,
} from "@/store/shop/wishlist-slice";
import { useToast } from "@/hooks/use-toast";

function ShoppingProductTile({
  product,
  handleGetProductDetails,
  handleAddToCart,
}) {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { toast } = useToast();

  const handleAddToWishlist = (getUserId) => {
    console.log({ getUserId });
    dispatch(
      add_to_wishlist({ userId: getUserId, productId: product?._id })
    ).then((data) => {
      if (data?.payload?.success) {
        toast({
          title: "Item added to wishlist",
        });
      }
    });
  };

  const handleRemoveFromWishlist = (getUserId, getCurrentProductID) => {
    dispatch(
      delete_wishlist_items({
        userId: getUserId,
        productId: getCurrentProductID,
      })
    ).then((data) => {
      console.log({ data });
      if (data?.payload?.success)
        toast({ title: "Removed item from wishlist successfully" });
    });
  };

  const productId = window.location.pathname === "/shop/wishlist" ? product?.productId : product?._id;

  return (
    <Card className="flex w-full max-w-sm mx-auto flex-col">
      <div onClick={() => handleGetProductDetails(product?._id)}>
        <div className="relative">
          <img
            src={product?.image}
            alt={product?.title}
            className="w-full h-[300px] rounded-t-lg object-fill"
          />
          {product?.totalStock === 0 ? (
            <Badge className="absolute top-2 right-2 bg-red-600 hover:bg-red-700">
              Out of stock
            </Badge>
          ) : product?.totalStock < 10 ? (
            <Badge className="absolute top-2 right-2 bg-red-600 hover:bg-red-700">
              {`Only ${product.totalStock} items left`}
            </Badge>
          ) : null}
          <Badge className="absolute top-2 left-2 bg-red-600 hover:bg-red-700">
            {product?.salePrice}
          </Badge>
        </div>
        <CardContent className="p-4">
          <h2 className="text-xl font-bold mb-2 text-start">
            {product?.title}
          </h2>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-muted-foreground">
              {categoryOptionsMap[product?.category]}
            </span>
            <span className="text-sm text-muted-foreground">
              {brandOptionsMap[product?.brand]}
            </span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span
              className={`text-lg font-semibold text-priamry ${
                product?.salePrice > 0 ? "line-through" : ""
              }`}
            >
              &#8377; {product?.price}
            </span>{" "}
            {product?.salePrice > 0 ? (
              <span className={``}>&#8377; {product?.salePrice}</span>
            ) : null}
          </div>
        </CardContent>
      </div>
      <CardFooter className="gap-3">
        <Button
          onClick={() =>
            handleAddToCart(productId, product?.totalStock)
          }
          className="w-full"
          disabled={product.totalStock === 0}
        >
          Add to cart +
        </Button>
        {window.location.pathname !== "/shop/wishlist" ? (
          <Button
            onClick={() => handleAddToWishlist(user?.id, productId)}
          >
            <Heart />
          </Button>
        ) : (
          <Button
            onClick={() =>
              handleRemoveFromWishlist(user?.id, productId)
            }
          >
            <HeartCrack />
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

export default ShoppingProductTile;
