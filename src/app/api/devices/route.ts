import { ApiRequestError } from "@/server/api/client";
import { searchDevices } from "@/server/devices/search";

// Same-origin proxy so client components (e.g. the header search modal) can
// query the catalog without hitting the Rust API's CORS restrictions.
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  try {
    return Response.json(await searchDevices(searchParams));
  } catch (error) {
    if (error instanceof ApiRequestError) {
      return Response.json(
        { error: { code: error.code, message: error.message } },
        { status: error.status },
      );
    }

    return Response.json(
      {
        error: {
          code: "internal_error",
          message: "기기 검색에 실패했습니다. 잠시 후 다시 시도해주세요.",
        },
      },
      { status: 502 },
    );
  }
}
