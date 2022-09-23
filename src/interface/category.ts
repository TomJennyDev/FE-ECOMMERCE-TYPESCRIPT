export interface Category {
  _id: string;
  title?: string;
  slug?: string;
  icon?: string;
  isDeleted?: string;
  children: this[];
}
