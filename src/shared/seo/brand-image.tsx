import { ImageResponse } from "next/og";

import { SITE_NAME } from "./site";

export const brandImageSize = { width: 1200, height: 630 };

export function renderBrandImage(title: string, subtitle: string) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
          background: "linear-gradient(135deg, #0b1437 0%, #1e42c4 100%)",
          color: "white",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <svg width="56" height="62" viewBox="0 0 657 726">
            <path
              d="M44 0H376C731 0 763 569 393 569H210A30 30 0 0 1 180 539V144H218A93 93 0 0 1 311 237V469H359C584 469 584 111 359 111H30A30 30 0 0 1 0 81V44A44 44 0 0 1 44 0Z"
              fill="#ffffff"
            />
            <path
              d="M0 188A44 44 0 0 1 44 144H147V602H554A62 62 0 0 1 554 726H93A93 93 0 0 1 0 633Z"
              fill="#2BA8FF"
            />
          </svg>
          <div style={{ fontSize: 36, fontWeight: 700 }}>{SITE_NAME}</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ fontSize: 72, fontWeight: 800, lineHeight: 1.15 }}>
            {title}
          </div>
          <div style={{ fontSize: 34, color: "#bcd4ff" }}>{subtitle}</div>
        </div>
      </div>
    ),
    brandImageSize,
  );
}
