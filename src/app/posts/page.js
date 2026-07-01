import { Suspense } from "react";
import PostsPageSection from "../../components/PostsPageSection";

export default function PostsPage() {
  return (
    <Suspense fallback={null}>
      <PostsPageSection />
    </Suspense>
  );
}
