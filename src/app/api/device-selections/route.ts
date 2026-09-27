import type { ApiDeviceSelectionRequest } from "@/features/devices/api/types";
import { ApiRequestError } from "@/server/api/client";
import { recordDeviceSelection } from "@/server/devices/api";

export async function POST(request: Request) {
  try {
    const input = (await request.json()) as ApiDeviceSelectionRequest;
    await recordDeviceSelection(input);
    return new Response(null, { status: 204 });
  } catch (error) {
    if (error instanceof ApiRequestError) {
      return Response.json(
        { error: { code: error.code, message: error.message } },
        { status: error.status },
      );
    }

    return Response.json(
      { error: { code: "invalid_request", message: "잘못된 선택 기록 요청입니다." } },
      { status: 400 },
    );
  }
}
