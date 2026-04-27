import { Box, Skeleton } from "@mui/material";

/**
 * PizzaCardSkeleton — matches the exact proportions of the new PizzaCard
 * so there's no layout shift when content loads.
 */
export default function PizzaCardSkeleton() {
  return (
    <Box
      sx={{
        width: "100%",
        bgcolor: "#fff",
        borderRadius: "16px",
        border: "1px solid rgba(26,26,24,0.07)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
      aria-hidden="true"
    >
      {/* Image placeholder */}
      <Skeleton
        variant="rectangular"
        animation="wave"
        sx={{
          width: "100%",
          aspectRatio: "1 / 1",
          transform: "none",
          borderRadius: 0,
          bgcolor: "rgba(26,26,24,0.06)",
        }}
      />

      {/* Content */}
      <Box sx={{ p: "12px 14px 14px" }}>
        {/* Title */}
        <Skeleton
          animation="wave"
          width="72%"
          height={20}
          sx={{ mb: 0.75, borderRadius: "6px", bgcolor: "rgba(26,26,24,0.06)" }}
        />
        {/* Description */}
        <Skeleton
          animation="wave"
          width="95%"
          height={13}
          sx={{ mb: 0.4, borderRadius: "5px", bgcolor: "rgba(26,26,24,0.05)" }}
        />
        <Skeleton
          animation="wave"
          width="65%"
          height={13}
          sx={{ mb: 1.5, borderRadius: "5px", bgcolor: "rgba(26,26,24,0.05)" }}
        />

        {/* Variant pills */}
        <Box sx={{ display: "flex", gap: "6px", mb: 1.25 }}>
          <Skeleton
            animation="wave"
            width={56}
            height={28}
            sx={{ borderRadius: "8px", bgcolor: "rgba(26,26,24,0.06)" }}
          />
          <Skeleton
            animation="wave"
            width={56}
            height={28}
            sx={{ borderRadius: "8px", bgcolor: "rgba(26,26,24,0.06)" }}
          />
        </Box>

        {/* Price + button row */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mt: 0.5,
          }}
        >
          <Skeleton
            animation="wave"
            width={58}
            height={26}
            sx={{ borderRadius: "6px", bgcolor: "rgba(26,26,24,0.07)" }}
          />
          <Skeleton
            animation="wave"
            width={94}
            height={36}
            sx={{ borderRadius: "10px", bgcolor: "rgba(26,26,24,0.06)" }}
          />
        </Box>
      </Box>
    </Box>
  );
}
