import Iconify from "../Iconify";

const getIcon = (name: string) => (
  <Iconify icon={name} width={22} height={22} />
);

export interface NavConfig {
  title: string;
  path: string;
  icon: JSX.Element;
}

const navConfig: NavConfig[] = [
  {
    title: "dashboard",
    path: "/dashboard",
    icon: getIcon("eva:pie-chart-2-fill"),
  },
  {
    title: "user",
    path: "/dashboard/user",
    icon: getIcon("eva:people-fill"),
  },
  {
    title: "product",
    path: "/dashboard/products",
    icon: getIcon("eva:shopping-bag-fill"),
  },
  {
    title: "order",
    path: "/dashboard/order",
    icon: getIcon("icon-park-solid:transaction-order"),
  },
];

export default navConfig;
