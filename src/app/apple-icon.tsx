import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#ffffff",
        }}
      >
        <svg width="110" height="122" viewBox="0 0 657 726">
          <path
            d="M44 0H376C731 0 763 569 393 569H210A30 30 0 0 1 180 539V144H218A93 93 0 0 1 311 237V469H359C584 469 584 111 359 111H30A30 30 0 0 1 0 81V44A44 44 0 0 1 44 0Z"
            fill="#1E42C4"
          />
          <path
            d="M0 188A44 44 0 0 1 44 144H147V602H554A62 62 0 0 1 554 726H93A93 93 0 0 1 0 633Z"
            fill="#2BA8FF"
          />
        </svg>
      </div>
    ),
    size,
  );
}
