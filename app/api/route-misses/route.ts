import { ApiRequestError, recordRouteMiss } from "@/lib/api/client";
import type { ApiRouteMissCreateRequest } from "@/lib/api/types";

export async function POST(request: Request) {
  try {
    const input = (await request.json()) as ApiRouteMissCreateRequest;
    await recordRouteMiss(input);
    return new Response(null, { status: 204 });
  } catch (error) {
    if (error instanceof ApiRequestError) {
      return Response.json(
        { error: { code: error.code, message: error.message } },
        { status: error.status },
      );
    }

    return Response.json(
      { error: { code: "invalid_request", message: "잘못된 수집 요청입니다." } },
      { status: 400 },
    );
  }
}
