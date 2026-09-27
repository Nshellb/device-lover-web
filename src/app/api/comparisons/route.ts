import { ApiRequestError } from "@/server/api/client";
import { getResolvedComparison } from "@/server/devices/api";

// Same-origin proxy so client components (e.g. the comparison bar) can
// resolve the devices behind the current URL without hitting the Rust API's
// CORS restrictions.
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const identifiers = searchParams.getAll("identifiers");

  if (identifiers.length === 0) {
    return Response.json(
      {
        error: {
          code: "validation_error",
          message: "identifiers must contain 1 to 3 values",
        },
      },
      { status: 400 },
    );
  }

  try {
    const result = await getResolvedComparison(identifiers);

    if (!result) {
      return Response.json(
        { error: { code: "not_found", message: "resource not found" } },
        { status: 404 },
      );
    }

    return Response.json(result);
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
          message: "기기 정보를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.",
        },
      },
      { status: 502 },
    );
  }
}
