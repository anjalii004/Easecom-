import { ChartNoAxesCombined } from "lucide-react";
import React, { Fragment } from "react";
import { useNavigate } from "react-router-dom";
import { BadgeCheck, LayoutDashboard, ShoppingBasket } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";

const adminSidebarMenuItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    path: "/admin/dashboard",
    icon: <LayoutDashboard />,
  },
  {
    id: "products",
    label: "Products",
    path: "/admin/products",
    icon: <ShoppingBasket />,
  },
  {
    id: "orders",
    label: "Orders",
    path: "/admin/orders",
    icon: <BadgeCheck />,
  },
];

function MenuItems({setOpen}) {
  const navigate = useNavigate();
  return (
    <nav className="mt-8 flex-col flex gap-2">
      {adminSidebarMenuItems.map((menuItem) => (
        <div
          key={menuItem.id}
          onClick={() => {
            navigate(menuItem.path);
            setOpen ? setOpen(false) : null;
          }}
          className="flex items-center rounded-md px-3 py-2 text-lg font-bold hover:bg-black hover:text-white gap-2 cursor-pointer"
        >
          {menuItem.icon}
          <span>{menuItem.label}</span>
        </div>
      ))}
    </nav>
  );
}

const AdminSidebar = ({ open, setOpen }) => {
  const navigate = useNavigate();

  return (
    <Fragment>
      {/* Mobile Drawer Sidebar */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-64">
          <div className="flex flex-col h-full">
            <SheetHeader className="border-b">
              <SheetTitle className="bg-black text-white px-2 py-1 flex justify-center items-center my-8">
                <ChartNoAxesCombined size={30} />
                <h1 className="text-xl font-extrabold ml-1">Admin Panel</h1>
              </SheetTitle>
              <MenuItems setOpen={setOpen}/>
            </SheetHeader>
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <aside className="hidden sm:flex w-64 flex-col border-r bg-background p-6">
        <div
          className="flex items-center gap-2 cursor-pointer bg-black text-white px-3 py-2"
          onClick={() => navigate("/admin/dashboard")}
        >
          <ChartNoAxesCombined size={20} />
          <h1 className="text-xl font-extrabold">Admin Panel</h1>
        </div>
        <MenuItems />
      </aside>

      {/* Mobile Toggle Button */}
      <button
        className="sm:hidden fixed bottom-4 left-4 z-50 p-3 bg-black text-white rounded-full shadow-md"
        onClick={() => setOpen(!open)}
        aria-label="Toggle Admin Sidebar"
      >
        <ChartNoAxesCombined size={24} />
      </button>
    </Fragment>
  );
};

export default AdminSidebar;
