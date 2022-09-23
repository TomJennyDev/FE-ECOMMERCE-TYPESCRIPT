export interface Product {
  _id: string;
  sku: string;
  title: string;
  metaTitle: string;
  slug: string;
  imageUrls: string;
  status: string;
  inventoryStatus: string;
  price: number;
  tax: number;
  shipping: number;
  priceSale: number;
  discount: number;
  quantity: number;
  rateAverage: number;
  totalRatings: number;
  totalPurchases: number;
  descriptions: string;
  categoryId: string;
  attributeId: string;
  isDeleted: boolean;
}
