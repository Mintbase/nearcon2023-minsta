import { FETCH_FEED } from "@/data/queries/feed.graphl";
import useInfiniteScrollGQL from "@/hooks/useInfiniteScroll";
import { useMemo, useRef } from "react";
import { useIntersectionObserver } from "usehooks-ts";
import { MemoizedImageThumb } from "./ImageThumb";

export const FeedScroll = ({ blockedNfts }: {blockedNfts: string[]}) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const entry = useIntersectionObserver(ref, {});
  const isVisible = !!entry?.isIntersecting;

  const { items, loadingItems, total, error } = useInfiniteScrollGQL(
    "q_FETCH_FEED",
    isVisible,
    { query: FETCH_FEED }
  );

 function calculateFilteredData(items:any, blockedNfts:string[]) {
  const uniqueMetadataIds = new Set<string>();

  // console.log(!!blockedNfts, blockedNfts, 'blockedNfts')

  const filteredData = items?.filter((token:any) => {
          console.log( blockedNfts?.length, blockedNfts.includes(token?.metadata_id), token.metadata_id, 'blockedNfts 2')


    if (
      uniqueMetadataIds.has(token.metadata_id) ||
      (!!blockedNfts && blockedNfts.includes(token?.metadata_id))
    ) {
      return false;
    } else {
      uniqueMetadataIds.add(token.metadata_id);
    }

    return true;
  });

  return filteredData;
}

// Usage in your component:
const filteredData = calculateFilteredData(items, blockedNfts);


  if (error) {
    return <> Error.</>;
  }

  return (
    <>
      {filteredData?.map((token: any, index: number) => {




        return !blockedNfts.includes(token?.metadata_id)? (
          <MemoizedImageThumb
            key={token?.metadata_id}
            token={token}
            index={index}
          />
        ): null;
      })}
      <div ref={ref}>
        {loadingItems?.map((item, i) => (
          <div
            className="md:aspect-square rounded overflow-x-hidden cursor-pointer sm:w-full md:w-72 h-72 xl:w-80 xl:h-80 relative"
            key={`${item}-${i}`}
          >
            <div className="rounded animate-pulse w-full h-full bg-gray-600 dark:bg-gray-800" />
          </div>
        ))}
      </div>
    </>
  );
};
