import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";

function AdminProductTile({
  product,
  setFormData,
  setOpenCreateProductDialogue,
  setCurrentEditedId,
  handleDelete,
}) {
  return (
    <Card className="w-full max-w-sm mx-auto">
      <div>
        <div className="relative">
          <img
            src={product?.image}
            alt={product?.title}
            className="w-full h-[300px] object-cover rounded-t-lg"
          />
        </div>
        <CardContent>
          <h2 className="text-xl font-bold mb-2">{product?.title}</h2>
          <div className="flex justify-between items-center mb-2">
            <span className="text-lg font-semibold text-primary">
              &#8377; {product?.price}
            </span>
            <span className="text-lg font-semibold text-primary">
              &#8377; {product?.salePrice}
            </span>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between items-center ">
          <Button
            onClick={() => {
              setOpenCreateProductDialogue(true);
              setCurrentEditedId(product?._id);
              setFormData(product);
            }}
            className="sticky"
          >
            Edit
          </Button>
          <Button className="sticky" onClick={() => handleDelete(product?._id)}>Delete</Button>
        </CardFooter>
      </div>
    </Card>
  );
}

export default AdminProductTile;
