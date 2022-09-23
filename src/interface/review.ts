export interface Review {
  _id: string;
  comments: string;
  image: string;
  isPurchased: boolean;
  totalRatings: number;
  rateAverage: number;
  userId: string;
  productId: string;
  isDeleted: boolean;
}
