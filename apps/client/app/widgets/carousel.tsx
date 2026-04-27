"use client";

import React from "react";
import Slider from "react-slick";
import Image from "next/image";
import { Box, Container } from "@mui/material";
import { useTranslations } from "next-intl";

const SLIDE_SRCS = [
  "https://pizzahouse.ua/_next/image?url=https%3A%2F%2Fpizzahouse.ua%2Fmedia%2F6535%2Fconversions%2F%D0%B2%D0%B8%D0%BF%D1%83%D1%81%D0%BA-%D1%81%D0%B0%D0%B9%D1%82--webp.png&w=1920&q=75",
  "https://pizzahouse.ua/_next/image?url=https%3A%2F%2Fpizzahouse.ua%2Fmedia%2F5401%2Fconversions%2F%D1%81%D0%B0%D0%B9%D1%82-%D0%B1%D0%BE%D0%BD%D1%83%D1%81%D0%B8-webp.png&w=1920&q=75",
  "https://pizzahouse.ua/_next/image?url=https%3A%2F%2Fpizzahouse.ua%2Fmedia%2F6529%2Fconversions%2F%D1%81%D0%B0%D0%B9%D1%82--(2)-webp.png&w=1920&q=75",
];

const sliderSettings = {
  dots: true,
  infinite: true,
  speed: 600,
  arrows: true,
  swipeToSlide: true,
  slidesToShow: 1,
  centerMode: true,
  centerPadding: "32px",
  autoplay: true,
  autoplaySpeed: 4500,
  cssEase: "cubic-bezier(0.4, 0, 0.2, 1)",
  pauseOnHover: true,
  responsive: [
    {
      breakpoint: 768,
      settings: {
        centerMode: false,
        centerPadding: "0px",
        arrows: false,
      },
    },
  ],
};

/**
 * Premium Carousel — full-bleed hero slides with rounded corners.
 *
 * Changes from original:
 * - Larger slides (desktop: 480px height)
 * - Center padding shows peek of adjacent slides (depth cue)
 * - Custom dot styling
 * - Image priority on first slide
 * - Smooth cubic-bezier easing
 */
export default function Carousel() {
  const t = useTranslations("carousel");

  return (
    <Container maxWidth="xl" disableGutters sx={{ px: { xs: 0, sm: 2, md: 3 } }}>
      <Box
        sx={{
          "& .slick-slide > div": { px: { xs: 0, sm: "6px" } },
          "& .slick-list": {
            borderRadius: { xs: 0, sm: "20px" },
            overflow: "hidden",
          },
          // Arrow button overrides
          "& .slick-prev, & .slick-next": {
            zIndex: 3,
            width: 44,
            height: 44,
            "&::before": {
              fontSize: "0 !important",
            },
            background: "rgba(255,255,255,0.88)",
            borderRadius: "50%",
            boxShadow: "0 2px 12px rgba(0,0,0,0.15)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.2s ease",
            "&:hover": {
              background: "#fff",
              transform: "scale(1.08)",
            },
          },
          "& .slick-prev": {
            left: 12,
            "&::after": {
              content: '"‹"',
              fontSize: "24px",
              color: "#1A1A18",
              fontWeight: 700,
              lineHeight: 1,
              position: "absolute",
            },
          },
          "& .slick-next": {
            right: 12,
            "&::after": {
              content: '"›"',
              fontSize: "24px",
              color: "#1A1A18",
              fontWeight: 700,
              lineHeight: 1,
              position: "absolute",
            },
          },
          // Dots
          "& .slick-dots": {
            bottom: 14,
            "& li button:before": {
              color: "rgba(255,255,255,0.6) !important",
              fontSize: "7px !important",
            },
            "& li.slick-active button:before": {
              color: "rgba(255,255,255,1) !important",
              fontSize: "9px !important",
            },
          },
        }}
      >
        <Slider {...sliderSettings}>
          {SLIDE_SRCS.map((src, i) => (
            <Box key={src}>
              <Box
                sx={{
                  position: "relative",
                  width: "100%",
                  height: {
                    xs: "180px",
                    sm: "260px",
                    md: "360px",
                    lg: "460px",
                  },
                  borderRadius: { xs: 0, sm: "16px" },
                  overflow: "hidden",
                  cursor: "pointer",
                }}
              >
                <Image
                  src={src}
                  alt={`${t("slide")} ${i + 1}`}
                  fill
                  style={{ objectFit: "cover" }}
                  priority={i === 0}
                  sizes="(max-width: 768px) 100vw, 90vw"
                />

                {/* Subtle gradient overlay for depth */}
                <Box
                  sx={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(to bottom, transparent 60%, rgba(0,0,0,0.2) 100%)",
                    pointerEvents: "none",
                  }}
                />
              </Box>
            </Box>
          ))}
        </Slider>
      </Box>
    </Container>
  );
}
