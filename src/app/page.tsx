import DashboardClient from "./_components/DashboardClient";
import { serverGet } from "@/lib/serverApi";
import { PostResponseDto } from "@/features/posts/types";
import { SessionStats } from "@/features/visitors/types";
import { EnquiryResponseDto } from "@/features/enquiries/types";

type DashboardData = {
  publishedCnt: number | null;
  userCnt: number | null;
  publishedPosts: PostResponseDto[];
  visitorStats: SessionStats | null;
  enquiries: EnquiryResponseDto[] | null;
  errors: {
    publishedCnt: boolean;
    userCnt: boolean;
    publishedPosts: boolean;
    visitorStats: boolean;
    enquiries: boolean;
  };
};

const safe = <T>(result: PromiseSettledResult<T>, fallback: T) =>
  result.status === "fulfilled" ? result.value : fallback;

const isError = (result: PromiseSettledResult<unknown>) =>
  result.status === "rejected";

async function getDashboardData(): Promise<DashboardData> {
  const [publishedCntRes, userCntRes, postsRes, visitorRes, enquiriesRes] =
    await Promise.allSettled([
      serverGet<number>("/api/posts/count/published", { revalidate: 30 }),
      serverGet<number>("/api/count", { revalidate: 30 }),
      serverGet<PostResponseDto[]>("/api/posts/published?limit=6", {
        revalidate: 30,
      }),
      serverGet<SessionStats>("/api/visitors/stats", { revalidate: 30 }),
      serverGet<EnquiryResponseDto[]>("/api/enquiries", { revalidate: 30 }),
    ]);

  return {
    publishedCnt: safe(publishedCntRes, null),
    userCnt: safe(userCntRes, null),
    publishedPosts: safe(postsRes, []),
    visitorStats: safe(visitorRes, null),
    enquiries: safe(enquiriesRes, null),
    errors: {
      publishedCnt: isError(publishedCntRes),
      userCnt: isError(userCntRes),
      publishedPosts: isError(postsRes),
      visitorStats: isError(visitorRes),
      enquiries: isError(enquiriesRes),
    },
  };
}

export default async function DashboardPage() {
  const data = await getDashboardData();
  return <DashboardClient {...data} />;
}
