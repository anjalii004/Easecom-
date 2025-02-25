import ProductDetailsDialog from "@/components/shopping-view/product-details";
import ProductFilter from "@/components/shopping-view/filter";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { categoryOptionsMap, sortOptions } from "@/config/index";
import {
  fetchAllFilteredProducts,
  fetchProductDetails,
} from "@/store/shop/product-slice";
import { ArrowUpDownIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { add_to_cart, fetch_cart_items } from "@/store/shop/cart-slice";
import { useToast } from "@/hooks/use-toast";
import { get_all_review } from "@/store/shop/review-slice";

function createSearchParamsHelper(filter) {
  const queryParam = [];

  for (const [key, value] of Object.entries(filter)) {
    if (Array.isArray(value) && value.length > 0) {
      const paramValue = value.join(",");
      queryParam.push(`${key}=${encodeURIComponent(paramValue)}`);
    }
  }
  return queryParam.join("&");
}

function Listings() {
  const dispatch = useDispatch();
  const { productList, productDetails } = useSelector(
    (state) => state.shopProducts
  );
  const [filter, setFilter] = useState({});
  const [sort, setSort] = useState({});

  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const { toast } = useToast();
  const categorySearchParams = searchParams.get("category");

  function handleSort(value) {
    setSort(value);
  }

  function handleFilter(getSectionId, getCurrentOption) {
    let copyFilters = { ...filter };
    const indexOfCurrentSection =
      Object.keys(copyFilters).indexOf(getSectionId);

    if (indexOfCurrentSection === -1) {
      copyFilters = {
        ...copyFilters,
        [getSectionId]: [getCurrentOption],
      };
    } else {
      const indexOfCurrentOption =
        copyFilters[getSectionId].indexOf(getCurrentOption);
      if (indexOfCurrentOption === -1)
        copyFilters[getSectionId].push(getCurrentOption);
      else copyFilters[getSectionId].splice(indexOfCurrentOption, 1);
    }
    setFilter(copyFilters);
    sessionStorage.setItem("filters", JSON.stringify(copyFilters));
  }

  function handleGetProductDetails(getCurrentProdId) {
    dispatch(fetchProductDetails(getCurrentProdId));
    dispatch(get_all_review());
  }

  function handleAddToCart(getCurrentProductID, getTotalStock) {
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
  }

  useEffect(() => {
    setSort("price-lowtohigh");
    setFilter(JSON.parse(sessionStorage.getItem("filters")));
  }, [categorySearchParams]);

  useEffect(() => {
    if (filter && Object.keys(filter).length > 0) {
      const createQueryString = createSearchParamsHelper(filter);
      setSearchParams(new URLSearchParams(createQueryString));
    }
  }, [filter]);

  useEffect(() => {
    if (productDetails !== null) setOpenDetailsDialog(true);
  }, [productDetails]);

  useEffect(() => {
    if (filter !== null && sort !== null)
      dispatch(
        fetchAllFilteredProducts({ filterParams: filter, sortParams: sort })
      );
  }, [dispatch, sort, filter]);

  return (
    <div className="flex flex-col md:flex-row gap-6 p-4 md:p-6">
      {/* Left Section: Filter */}
      <div className="flex-shrink-0 w-[15%] rounded-md shadow-md p-4 bg-black text-white">
        <ProductFilter filter={filter} handleFilter={handleFilter} />
      </div>

      {/* Right Section: Product Listings */}
      <div className="bg-black text-white w-full rounded-lg shadow-md p-4">
        {/* Header Section for Sorting */}
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="text-lg font-bold">All Products</h2>
          <div className="flex items-center gap-3">
            <span className="font-semibold text-sm">
              {productList.length} Products
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  className="flex items-center gap-1 text-black"
                  size="sm"
                  variant="outline"
                >
                  <ArrowUpDownIcon className="h-4 w-4" /> Sort
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px]">
                <DropdownMenuRadioGroup value={sort} onValueChange={handleSort}>
                  {sortOptions.map((sortItem) => (
                    <DropdownMenuRadioItem
                      value={sortItem.id}
                      key={sortItem.id}
                    >
                      {sortItem.label}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 p-4">
          {productList && productList.length > 0
            ? productList.map((prodItem) => (
                <ShoppingProductTile
                  handleGetProductDetails={handleGetProductDetails}
                  key={prodItem._id}
                  product={prodItem}
                  handleAddToCart={handleAddToCart}
                />
              ))
            : null}
        </div>
      </div>

      {/* Product Details Dialog */}
      <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        product={productDetails}
      />
    </div>
  );
}

export default Listings;
