import { filterOptions } from "@/config";
import { Fragment } from "react";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { Separator } from "../ui/separator";

function ProductFilter({ filter, handleFilter }) {
  return (
    <div className=" rounded-md shadow-sm flex flex-col items-start bg-transparent">
      <div className="p-4 border-b">
        <h2 className="text-lg font-bold">Filter</h2>
      </div>
      <div className="p-4 space-y-4 flex flex-col items-start">
        {Object.keys(filterOptions).map((keyItem, id) => (
          <Fragment key={id}>
            <div>
              <h3 className="text-base font-bold">{keyItem}</h3>
              <div className="grid gap-2 mt-2">
                {filterOptions[keyItem].map((option, id) => (
                  <Label
                    key={id}
                    className="flex items-center gap-2 font-medium"
                  >
                    <Checkbox
                      checked={
                        filter &&
                        Object.keys(filter).length > 0 &&
                        filter[keyItem] &&
                        filter[keyItem].indexOf(option.id) > -1
                      }
                      className={`text-white`}
                      onCheckedChange={() => handleFilter(keyItem, option.id)}
                    />
                    {option.label}
                  </Label>
                ))}
              </div>
            </div>
            <Separator />
          </Fragment>
        ))}
      </div>
    </div>
  );
}

export default ProductFilter;
