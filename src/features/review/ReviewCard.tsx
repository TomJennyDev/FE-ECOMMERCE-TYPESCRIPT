import { Avatar, Box, Paper, Rating, Stack, Typography } from "@mui/material";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { fToNow } from "../../utils/formatTime";
import { sendReviewReaction } from "./reviewSlice";

function ReviewCard({ review }) {
  const dispatch = useDispatch();
  const { totalRatings, rateAverage, _id } = review;
  const [valueRating, setRating] = useState(rateAverage);

  return (
    <Stack direction="row" spacing={2}>
      <Avatar alt={review.userId?.name} src={review.userId?.avatarUrl} />
      <Paper sx={{ p: 1.5, flexGrow: 1, boxShadow: 2 }}>
        <Stack
          direction="row"
          alignItems={{ sm: "center" }}
          justifyContent="space-between"
          sx={{ mb: 0.5 }}
          spacing={1}
        >
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            {review.userId?.name}
          </Typography>
          <Typography variant="caption" sx={{ color: "text.disabled" }}>
            {fToNow(review.createdAt)}
          </Typography>
        </Stack>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Rating
            name="read-only"
            value={valueRating}
            precision={1}
            onChange={(event, newValue) => {
              if (newValue) {
                setRating(newValue);
                dispatch(
                  sendReviewReaction({ reviewId: _id, rate: +newValue })
                );
              }
            }}
            size="small"
          />
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            {`(${totalRatings})`}
          </Typography>
        </Stack>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          {review.comments}
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          {/* <ReviewReaction review={review} /> */}
        </Box>
      </Paper>
    </Stack>
  );
}

export default ReviewCard;
