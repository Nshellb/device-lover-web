import { ApiRequestError, getPopularDevices, listCameras, listDevices } from "@/lib/api/client";

// Same-origin proxy so client components (e.g. the header search modal) can
// query the catalog without hitting the Rust API's CORS restrictions.
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = searchParams.get("page");
  const pageSize = searchParams.get("page_size");
  const sort = searchParams.get("sort");

  try {
    const query = searchParams.get("q") ?? undefined;
    const requestedPageSize = pageSize ? Number(pageSize) : 30;
    if (!query && !page && !pageSize && !sort && !searchParams.has("brand")) {
      const popular = await getPopularDevices();
      return Response.json({
        items: popular.items,
        pagination: {
          page: 1,
          pageSize: popular.items.length,
          total: popular.items.length,
          totalPages: popular.items.length === 0 ? 0 : 1,
        },
      });
    }

    const [smartphones, cameras] = await Promise.all([
      listDevices({
        q: query,
        brand: searchParams.get("brand") ?? undefined,
        page: page ? Number(page) : undefined,
        pageSize: requestedPageSize,
        sort: sort === "relevance" || sort === "release_date_desc" ? sort : undefined,
      }),
      listCameras({ q: query, page: page ? Number(page) : undefined, pageSize: requestedPageSize }),
    ]);
    const cameraItems = cameras.items.map((camera) => ({
      id: camera.id,
      slug: camera.slug,
      category: "camera",
      brand: camera.brand,
      brandSlug: camera.brandSlug,
      name: camera.name,
      releaseDate: `${camera.releaseMonth}-01`,
      marketCode: "JP",
      aliases: [] as string[],
      modelNumbers: [] as string[],
      imageUrl: null,
    }));
    const items = [...smartphones.items, ...cameraItems]
      .sort((left, right) => right.releaseDate.localeCompare(left.releaseDate))
      .slice(0, requestedPageSize);
    const total = smartphones.pagination.total + cameras.pagination.total;
    const result = {
      items,
      pagination: {
        page: 1,
        pageSize: requestedPageSize,
        total,
        totalPages: total === 0 ? 0 : Math.ceil(total / requestedPageSize),
      },
    };

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
          message: "기기 검색에 실패했습니다. 잠시 후 다시 시도해주세요.",
        },
      },
      { status: 502 },
    );
  }
}
