import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ProductDetailsDialog from "@/components/shopping-view/product-details";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { add_to_cart, fetch_cart_items } from "@/store/shop/cart-slice";
import {
  fetchAllFilteredProducts,
  fetchProductDetails,
} from "@/store/shop/product-slice";
import {
  BabyIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CloudLightning,
  ShirtIcon,
  Umbrella,
  WatchIcon,
} from "lucide-react";
import { Separator } from "@radix-ui/react-dropdown-menu";

const categoriesWithIcon = [
  { id: "men", label: "Men", icon: ShirtIcon },
  { id: "women", label: "Women", icon: CloudLightning },
  { id: "kids", label: "Kids", icon: BabyIcon },
  { id: "accessories", label: "Accessories", icon: WatchIcon },
  { id: "footwear", label: "Footwear", icon: Umbrella },
];

const brands = [
  { id: "nike", label: "Nike" },
  { id: "adidas", label: "Adidas" },
  { id: "puma", label: "Puma" },
  { id: "levi", label: "Levi's" },
  { id: "zara", label: "Zara" },
  { id: "h&m", label: "H&M" },
];

const Home = () => {
  const slides = [
    "https://raw.githubusercontent.com/sangammukherjee/mern-ecommerce-2024/refs/heads/master/client/src/assets/banner-1.webp",
    "https://raw.githubusercontent.com/sangammukherjee/mern-ecommerce-2024/refs/heads/master/client/src/assets/banner-2.webp",
    "https://raw.githubusercontent.com/sangammukherjee/mern-ecommerce-2024/refs/heads/master/client/src/assets/banner-3.webp",
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { productList, productDetails } = useSelector(
    (state) => state.shopProducts
  );
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [slides.length]);

  useEffect(() => {
    dispatch(
      fetchAllFilteredProducts({
        filterParams: {},
        sortParams: "price-lowtohigh",
      })
    );
  }, [dispatch]);

  useEffect(() => {
    if (productDetails) {
      setOpenDetailsDialog(true);
    }
  }, [productDetails]);

  const handleNavigateToListingPage = (item, section) => {
    sessionStorage.setItem("filters", JSON.stringify({ [section]: [item.id] }));
    navigate("/shop/listing");
  };

  const handleGetProductDetails = (productId) => {
    dispatch(fetchProductDetails(productId));
  };

  const handleAddToCart = (productId, getTotalStock) => {
    let getCartItems = cartItems.items || [];

    if (getCartItems.length) {
      const indexOfCurrentItems = getCartItems.findIndex(
        (item) => item.productId === productId
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
    if (!user?.id)
      return toast({ title: "Please log in to add products to cart." });

    dispatch(
      add_to_cart({
        userId: user.id,
        productId,
        quantity: 1,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetch_cart_items(user.id));
        toast({ title: "Hurray! Product added to cart." });
      }
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      {/* Hero Section */}
      <div className="relative w-full h-[450px] overflow-hidden">
        {slides.map((slide, idx) => (
          <img
            key={idx}
            src={slide}
            alt={`Slide ${idx + 1}`}
            className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000 ${
              idx === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
        <Button
          size="icon"
          variant="outline"
          onClick={() =>
            setCurrentSlide(
              (prevSlide) => (prevSlide - 1 + slides.length) % slides.length
            )
          }
          className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white text-black"
        >
          <ChevronLeftIcon className="w-6 h-6" />
        </Button>
        <Button
          size="icon"
          variant="outline"
          onClick={() =>
            setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length)
          }
          className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white text-black"
        >
          <ChevronRightIcon className="w-6 h-6" />
        </Button>
      </div>

      {/* Categories Section */}
      <div className="flex">
      <section className="py-10 bg-[#AABA9E]">
        <div className="container mx-auto px-8">
          <h2 className="text-3xl font-bold text-center text-black">Shop by Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-8">
            {categoriesWithIcon.map((item) => (
              <Card
                key={item.id}
                onClick={() => handleNavigateToListingPage(item, "category")}
                className="cursor-pointer hover:shadow-lg transition-shadow bg-black text-white"
              >
                <CardContent className="flex flex-col items-center justify-center px-8 py-4">
                  <item.icon className="w-16 h-16 mb-4" />
                  <span className="text-xl font-semibold">{item.label}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Premium Brands Section */}
      <section className="py-10 bg-[#AABA9E]">
        <div className="container mx-auto px-8">
          <h2 className="text-3xl font-bold text-center text-black">Premium Brands</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mt-8">
            {brands.map((item) => (
              <Card
                key={item.id}
                onClick={() => handleNavigateToListingPage(item, "brand")}
                className="cursor-pointer hover:shadow-lg transition-shadow bg-black text-white"
              >
                <CardContent className="flex flex-col items-center justify-center px-8 py-22 my-7">
                  <span className="text-2xl font-bold">{item.label}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      </div>

      {/* Featured Products Section */}
      <section className="py-12 bg-black">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-white mb-8">
            Featured Products
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {productList?.length > 0 ? (
              productList.map((prod) => (
                <ShoppingProductTile
                  key={prod._id}
                  product={prod}
                  handleGetProductDetails={handleGetProductDetails}
                  handleAddToCart={handleAddToCart}
                />
              ))
            ) : (
              <p className="text-center col-span-full text-white">
                No products available.
              </p>
            )}
          </div>
        </div>
      </section>

      <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        product={productDetails}
      />
    </div>
  );
};

export default Home;
