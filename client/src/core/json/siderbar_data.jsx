import React from "react";

import * as Icon from "react-feather";

export const SidebarData = [
  {
    label: "Main",
    submenuOpen: true,
    showSubRoute: false,
    submenuHdr: "Main",
    submenuItems: [
      {
        label: "Dashboard",
        icon: <Icon.Grid />,
        submenu: true,
        showSubRoute: false,

        submenuItems: [{ label: "Admin Dashboard", link: "/" }],
      },
      {
        label: "Inventory",
        icon: <Icon.Box />,
        submenu: true,
        showSubRoute: false,

        submenuItems: [
          {
            label: "Products",
            link: "/product-list",
            icon: <Icon.Box />,
            showSubRoute: false,
            submenu: false,
          },
          {
            label: "Create Product",
            link: "/add-product",
            icon: <Icon.PlusSquare />,
            showSubRoute: false,
            submenu: false,
          },

          {
            label: "Low Stocks",
            link: "/low-stocks",
            icon: <Icon.TrendingDown />,
            showSubRoute: false,
            submenu: false,
          },
          {
            label: "Category",
            link: "/category-list",
            icon: <Icon.Codepen />,
            showSubRoute: false,
            submenu: false,
          },
          {
            label: "Sub Category",
            link: "/sub-categories",
            icon: <Icon.Speaker />,
            showSubRoute: false,
            submenu: false,
          },
          {
            label: "Brands",
            link: "/brand-list",
            icon: <Icon.Tag />,
            showSubRoute: false,
            submenu: false,
          },
          {
            label: "Units",
            link: "/units",
            icon: <Icon.Speaker />,
            showSubRoute: false,
            submenu: false,
          },
          {
            label: "Variant Attributes",
            link: "/variant-attributes",
            icon: <Icon.Layers />,
            showSubRoute: false,
            submenu: false,
          },
          {
            label: "Warranties",
            link: "/warranty",
            icon: <Icon.Bookmark />,
            showSubRoute: false,
            submenu: false,
          },
        ],
      },
      {
        label: "Stock",
        submenuOpen: true,
        showSubRoute: false,
        submenuHdr: "Stock",
        icon: <Icon.Truck />,

        submenuItems: [
          {
            label: "Stock Adjustment",
            link: "/stock-adjustment",
            icon: <Icon.Clipboard />,
            showSubRoute: false,
            submenu: false,
          },
          {
            label: "Stock Transfer",
            link: "/stock-transfer",
            icon: <Icon.Truck />,
            showSubRoute: false,
            submenu: false,
          },
        ],
      },
      {
        label: "Sales",
        submenuOpen: true,
        showSubRoute: false,
        submenuHdr: "Sales",
        icon: <Icon.ShoppingCart />,
        submenuItems: [
          {
            label: "Sales",
            link: "/sales-list",
            icon: <Icon.ShoppingCart />,
            showSubRoute: false,
            submenu: false,
          },
          {
            label: "Invoices",
            link: "/invoice-report",
            icon: <Icon.FileText />,
            showSubRoute: false,
            submenu: false,
          },
          {
            label: "Sales Return",
            link: "/sales-returns",
            icon: <Icon.Copy />,
            showSubRoute: false,
            submenu: false,
          },

          {
            label: "POS",
            link: "/pos",
            icon: <Icon.HardDrive />,
            showSubRoute: false,
            submenu: false,
          },
        ],
      },
      {
        label: "Purchases",
        submenuOpen: true,
        showSubRoute: false,
        submenuHdr: "Purchases",
        icon: <Icon.ShoppingBag />,
        submenuItems: [
          {
            label: "Purchases",
            link: "/purchase-list",
            icon: <Icon.ShoppingBag />,
            showSubRoute: false,
            submenu: false,
          },
          {
            label: "Purchase Order",
            link: "/purchase-order-report",
            icon: <Icon.FileMinus />,
            showSubRoute: false,
            submenu: false,
          },
          {
            label: "Purchase Return",
            link: "/purchase-returns",
            icon: <Icon.RefreshCw />,
            showSubRoute: false,
            submenu: false,
          },
        ],
      },
      {
        label: "Promo",
        submenuOpen: true,
        submenuHdr: "Promo",
        showSubRoute: false,
        icon: <Icon.ShoppingCart />,
        submenuItems: [
          {
            label: "Coupons",
            link: "/coupons",
            icon: <Icon.ShoppingCart />,
            showSubRoute: false,
            submenu: false,
          },
        ],
      },
      {
        label: "People",
        submenuOpen: true,
        showSubRoute: false,
        submenuHdr: "People",
        icon: <Icon.Users />,
        submenuItems: [
          {
            label: "Customers",
            link: "/customers",
            icon: <Icon.User />,
            showSubRoute: false,
            submenu: false,
          },
          {
            label: "Suppliers",
            link: "/suppliers",
            icon: <Icon.Users />,
            showSubRoute: false,
            submenu: false,
          },
          {
            label: "Stores",
            link: "/store-list",
            icon: <Icon.Home />,
            showSubRoute: false,
            submenu: false,
          },
          {
            label: "Warehouses",
            link: "/warehouse",
            icon: <Icon.Archive />,
            showSubRoute: false,
            submenu: false,
          },
        ],
      },
      {
        label: "Reports",
        submenuOpen: true,
        showSubRoute: false,
        submenuHdr: "Reports",
        icon: <Icon.BarChart2 />,
        submenuItems: [
          {
            label: "Sales Report",
            link: "/sales-report",
            icon: <Icon.BarChart2 />,
            showSubRoute: false,
          },
          {
            label: "Purchase Report",
            link: "/purchase-report",
            icon: <Icon.PieChart />,
            showSubRoute: false,
          },

          {
            label: "Invoice Report",
            link: "/invoice-report",
            icon: <Icon.File />,
            showSubRoute: false,
          },
          {
            label: "Supplier Report",
            link: "/supplier-report",
            icon: <Icon.UserCheck />,
            showSubRoute: false,
          },
          {
            label: "Customer Report",
            link: "/customer-report",
            icon: <Icon.User />,
            showSubRoute: false,
          },

          {
            label: "Profit & Loss",
            link: "/profit-loss-report",
            icon: <Icon.TrendingDown />,
            showSubRoute: false,
          },
        ],
      },
      {
        label: "User Management",
        submenuOpen: true,
        showSubRoute: false,
        submenuHdr: "User Management",
        icon: <Icon.UserCheck />,
        submenuItems: [
          {
            label: "Users",
            link: "/users",
            icon: <Icon.UserCheck />,
            showSubRoute: false,
          },
          {
            label: "Roles & Permissions",
            link: "/roles-permissions",
            icon: <Icon.UserCheck />,
            showSubRoute: false,
          },
        ],
      },
      {
        label: "Pages",
        submenuOpen: true,
        showSubRoute: false,
        submenuHdr: "Pages",
        icon: <Icon.FileText />,
        submenuItems: [
          {
            label: "Profile",
            link: "/profile",
            icon: <Icon.User />,
            showSubRoute: false,
          },
        ],
      },
      {
        label: "Settings",
        submenu: true,
        showSubRoute: false,
        submenuHdr: "Settings",
        icon: <Icon.Settings />,
        submenuItems: [
          {
            label: "General Settings",
            submenu: true,
            showSubRoute: false,
            icon: <Icon.Settings />,
            submenuItems: [{ label: "Profile", link: "/general-settings" }],
          },
        ],
      },
    ],
  },
];
