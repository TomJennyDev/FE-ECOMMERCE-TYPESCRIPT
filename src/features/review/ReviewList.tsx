import { Pagination, Stack, Typography } from "@mui/material";
import { useEffect } from "react";
import { shallowEqual, useDispatch } from "react-redux";
import { REACT_APP_LIMIT } from "../../app/config";
import { useAppSelector } from "../../app/hook";
import LoadingScreen from "../../components/LoadingScreen";
import ReviewCard from "./ReviewCard";
import { getReviews } from "./reviewSlice";

interface ReviewListProps {
  productId: string;
}

function ReviewList({ productId }: ReviewListProps) {
  const {
    reviewsByProduct,
    reviewsById,
    totalReviews,
    isLoading,
    currentPage,
  } = useAppSelector(
    (state) => ({
      reviewsByProduct: state?.review?.reviewsByProduct[productId],
      totalReviews: state?.review?.totalReviewsByProduct[productId],
      currentPage: state?.review?.currentPageByProduct[productId] || 1,
      reviewsById: state?.review?.reviewsById,
      isLoading: state?.review?.isLoading,
    }),
    shallowEqual
  );

  const totalPages = Math.ceil(totalReviews / REACT_APP_LIMIT);
  const dispatch = useDispatch();

  useEffect(() => {
    if (productId) dispatch(getReviews({ productId }));
  }, [productId, dispatch]);

  let renderReviews;
  if (reviewsByProduct) {
    const reviews = reviewsByProduct?.map((reviewId) => reviewsById[reviewId]);
    renderReviews = (
      <Stack spacing={1.5}>
        {reviews?.map((review) => (
          <ReviewCard key={review._id} review={review} />
        ))}
      </Stack>
    );
  } else if (isLoading) {
    renderReviews = <LoadingScreen />;
  }

  return (
    <Stack spacing={1.5}>
      <Stack direction="row" justifyContent="space-between">
        <Typography variant="subtitle" sx={{ color: "text.secondary" }}>
          {totalReviews > 1
            ? `${totalReviews} reviews`
            : totalReviews === 1
            ? `${totalReviews} review`
            : "No review"}
        </Typography>

        {totalReviews > REACT_APP_LIMIT && (
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={(e, page) => dispatch(getReviews({ productId, page }))}
          />
        )}
      </Stack>
      {renderReviews}
    </Stack>
  );
}

export default ReviewList;
