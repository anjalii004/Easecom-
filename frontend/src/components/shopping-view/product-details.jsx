import { StarIcon } from "lucide-react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";
import { Separator } from "../ui/separator";
import { Input } from "../ui/input";
import { useDispatch, useSelector } from "react-redux";
import { add_to_cart, fetch_cart_items } from "@/store/shop/cart-slice";
import { useToast } from "@/hooks/use-toast";
import { setProductDetails } from "@/store/shop/product-slice";
import { Badge } from "../ui/badge";
import { useEffect, useState } from "react";
import { add_new_review, get_all_review } from "@/store/shop/review-slice";
import { Label } from "../ui/label";

const ProductDetailsDialog = ({ open, setOpen, product }) => {
  const dispatch = useDispatch();
  const [reviewMessage, setReviewMessage] = useState("");
  const [reviewVal, setReviewVal] = useState(0);
  const { user } = useSelector((state) => state.auth);
  const { reviews } = useSelector((state) => state.shopReview);
  const {cartItems} = useSelector(state => state.shopCart);
  const { toast } = useToast();

  const handleAddToCart = (productId) => {
    let getCartItems = cartItems.item || [];
    if(getCartItems.length) {
      const indexOfCurrentItems = getCartItems.findIndex(item => item.productId === getCurrentProductID);
      if(indexOfCurrentItems > -1) {
        const getQuantity = getCartItems[indexOfCurrentItems].quantity;
        if(getQuantity + 1 > getTotalStock) {
          toast({
            title: `Only ${getTotalStock} items are available in stock`,
            variant: destructive,
          });

          return;
        }
      }
    }
    if (!user) {
      toast({
        title: "Please log in to add items to your cart.",
        status: "error",
      });
      return;
    }
    dispatch(
      add_to_cart({
        userId: user.id,
        productId,
        quantity: 1,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetch_cart_items(user.id));
        toast({
          title: "Hurray! Product added to cart.",
        });
      }
    });
  };

  const handleDialogClose = () => {
    setOpen(false);
    dispatch(setProductDetails(null));
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!user) {
      toast({
        title: "Please log in to submit a review.",
        status: "error",
      });
      return;
    }
    dispatch(
      add_new_review({
        productId: product?._id,
        userId: user.id,
        username: user.username,
        reviewMessage,
        reviewVal: parseFloat(reviewVal), // Ensure it's a number
      })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(get_all_review(product?._id));
        toast({
          title: "Review added successfully!",
          message: "Thanks for your feedback.",
        });
        setReviewMessage("");
        setReviewVal(0);
      }
    });
  };

  useEffect(() => {
    if (product) dispatch(get_all_review(product._id));
  }, [dispatch, product]);
  

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:p-12 max-w-[90vw] sm:max-w-[80vw]">
        <div className="relative overflow-hidden rounded-lg">
          <img
            src={product?.image}
            alt={product?.title}
            className="aspect-square w-full object-cover"
          />
          {product?.totalStock === 0 ? (
            <Badge className="absolute top-2 right-2 bg-red-600">
              Out of Stock
            </Badge>
          ) : product?.totalStock < 10 ? (
            <Badge className="absolute top-2 right-2 bg-yellow-500">
              Only {product.totalStock} left
            </Badge>
          ) : null}
        </div>
        <div>
          <DialogTitle className="text-3xl font-bold">{product?.title}</DialogTitle>
          <p>{product?.description}</p>
          <div className="flex items-center justify-between my-4">
            <p
              className={`text-3xl font-bold ${
                product?.salePrice > 0 ? "line-through text-gray-500" : ""
              }`}
            >
              ₹{product?.price}
            </p>
            {product?.salePrice > 0 && (
              <p className="text-3xl font-bold text-primary">₹{product?.salePrice}</p>
            )}
          </div>
          <div className="flex items-center gap-2 mt-2">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, index) => (
                <StarIcon
                  key={index}
                  className={`w-5 h-5 ${index < 4.5 ? "fill-primary" : "text-gray-300"}`}
                />
              ))}
            </div>
            <span className="text-muted-foreground">(4.5)</span>
          </div>
          <Button
            onClick={() => handleAddToCart(product._id, product?.totalStock)}
            className="w-full my-4"
            disabled={product?.totalStock === 0}
          >
            Add to Cart
          </Button>
          <Separator />
          <div className="max-h-[300px] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Reviews</h2>
            {reviews?.length > 0 ? (
              reviews.map((review, idx) => (
                <div key={idx} className="flex gap-4 mb-4">
                  <Avatar className="h-10 w-10 border">
                    <AvatarFallback>{review.username?.[0]?.toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-bold">{review.username}</h3>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, index) => (
                        <StarIcon
                          key={index}
                          className={`w-5 h-5 ${
                            index < review.reviewVal ? "fill-primary" : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <p>{review.reviewMessage}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground">No reviews yet.</p>
            )}
            <form onSubmit={handleReviewSubmit} className="mt-4">
              <Label>Review Message</Label>
              <Input
                value={reviewMessage}
                onChange={(e) => setReviewMessage(e.target.value)}
                placeholder="Enter your review"
                required
              />
              <Label>Rating (1-5)</Label>
              <Input
                value={reviewVal}
                onChange={(e) => setReviewVal(e.target.value)}
                type="number"
                min="1"
                max="5"
                step="0.1"
                placeholder="Enter rating"
                required
              />
              <Button
                type="submit"
                disabled={!reviewMessage || reviewVal < 1 || reviewVal > 5}
                className="mt-2 text-white bg-blue-700"
              >
                Submit Review
              </Button>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDetailsDialog;
