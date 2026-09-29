import type { SVGProps } from "react";

/**
 * 다듬은 DL 마크. 좌표는 마크의 왼쪽 위 모서리를 (0, 0)으로 잡았고 viewBox는
 * 여백 없이 꼭 맞게 잘랐다. 곡선은 D 몸통의 베지어 2개와 모서리 호 7개뿐이고
 * 나머지는 모두 직선이다. L과 D 사이 틈은 세 군데 모두 33으로 같다.
 *
 * public/device-lover-logo.svg(헤더·파비콘)가 이 값과 같은 파일이고, BO
 * (device-lover-bo/public/device-lover-logo.svg)에도 같은 파일이 있다. 여기서
 * 경로나 색을 바꾸면 두 파일도 함께 바꿔야 한다.
 */
export const LOGO_WIDTH = 657;
export const LOGO_HEIGHT = 726;

// 원래는 D #012B7B, L #007DFD. 어두운 배경에서도 보이도록 D를 밝히자 L과 톤이
// 붙어 보여서 L을 더 밝혔고, 그 뒤 D는 다크 배경에서 묻히지 않는 한도 안에서 다시
// 진하게 잡았다. 두 색의 명도비는 원래 조합(3.3:1)과 비슷한 3.1:1이다.
export const LOGO_COLORS = { d: "#1E42C4", l: "#2BA8FF" } as const;

export const LOGO_PATHS = {
  d: "M44 0H376C731 0 763 569 393 569H210A30 30 0 0 1 180 539V144H218A93 93 0 0 1 311 237V469H359C584 469 584 111 359 111H30A30 30 0 0 1 0 81V44A44 44 0 0 1 44 0Z",
  l: "M0 188A44 44 0 0 1 44 144H147V602H554A62 62 0 0 1 554 726H93A93 93 0 0 1 0 633Z",
} as const;

const countMatches = (d: string, pattern: RegExp) => d.match(pattern)?.length ?? 0;

export const LOGO_STATS = {
  commands: Object.values(LOGO_PATHS).reduce(
    (sum, d) => sum + countMatches(d, /[A-Z]/g),
    0,
  ),
  curves: Object.values(LOGO_PATHS).reduce(
    (sum, d) => sum + countMatches(d, /[AC]/g),
    0,
  ),
};

export const LOGO_SVG_SOURCE = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${LOGO_WIDTH} ${LOGO_HEIGHT}" role="img" aria-labelledby="title">
  <title id="title">Device Lover DL logo</title>
  <path d="${LOGO_PATHS.d}" fill="${LOGO_COLORS.d}"/>
  <path d="${LOGO_PATHS.l}" fill="${LOGO_COLORS.l}"/>
</svg>
`;

export function LogoPaths() {
  return (
    <>
      <path d={LOGO_PATHS.d} fill={LOGO_COLORS.d} />
      <path d={LOGO_PATHS.l} fill={LOGO_COLORS.l} />
    </>
  );
}

type LogoMarkProps = Omit<SVGProps<SVGSVGElement>, "viewBox" | "width" | "height"> & {
  /** 세로 픽셀 크기. 생략하면 CSS로 크기를 정한다. */
  size?: number;
};

export function LogoMark({ size, ...props }: LogoMarkProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${LOGO_WIDTH} ${LOGO_HEIGHT}`}
      height={size}
      width={size === undefined ? undefined : (size * LOGO_WIDTH) / LOGO_HEIGHT}
      role="img"
      aria-label="Device Lover 로고"
      {...props}
    >
      <LogoPaths />
    </svg>
  );
}
