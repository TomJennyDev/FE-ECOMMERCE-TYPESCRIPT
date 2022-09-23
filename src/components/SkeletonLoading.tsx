import { ReactNode } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

interface SkeletonLoadingProps {
  children?: ReactNode;
  isLoading: boolean;
  [sx: string]: any;
}

export default function SkeletonLoading({
  children,
  isLoading,
  ...sx
}: SkeletonLoadingProps) {
  return <>{isLoading ? <Skeleton {...sx} /> : children}</>;
}
