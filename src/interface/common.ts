import { FileWithPath } from "react-dropzone";

export interface CustomFile extends FileWithPath {
  preview?: string;
}

export interface Response<T> {
  data?: T[] & PaginationParams;
  message: string;
  success: boolean;
  errors?: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
  totalPages: number;
  totalResults: number;
}

export interface ListParams {
  sortBy?: string;
  page?: number;
  limit?: number;
  [key: string]: any;
}

export interface TimeStamp {
  createdAt: Date;
  updatedAt: Date;
}
