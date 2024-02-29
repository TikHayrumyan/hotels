import { Button } from "@/components/ui/button";
import Image from "next/image";
import { MapFilterItems } from "./components/MapFilterItems";
import prisma from "@/lib/db";
import { ListingCard } from "./components/ListingCard";
import { Suspense } from "react";
import { SkeletonCard } from "./components/SkeletonCard";
import { NoItems } from "./components/NoItems";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

async function GetData({
  searchParams,
  userId,
}: {
  userId : string | undefined,
  searchParams?: {
    filter?: string;
    country?: string;
    guest?: string;
    bathroom?: string;
    room?: string
  };
}) {
  const data = await prisma.home.findMany({
    where: {
      addedCategory: true,
      addedDescription: true,
      addedLocation: true,
      categoryName: searchParams?.filter ?? undefined,
      country: searchParams?.country ?? undefined,
      guests: searchParams?.guest ?? undefined,
      bedrooms: searchParams?.room ?? undefined,
      bathrooms: searchParams?.bathroom ?? undefined,
    },
    select: {
      photo: true,
      id: true,
      price: true,
      description: true,
      country: true,
      Favorite: {
        where: {
          userId: userId ?? undefined
        }
      }
    },
  });
  return data;
}

export default function Home({
  searchParams,
}: {
  searchParams?: {
    filter?: string;
    country?: string;
    guest?: string;
    bathroom?: string;
    room?: string
  };
}) {
  return (
    <div className="container mx-auto px-5 lg:px-10">
      <MapFilterItems />
      <Suspense key={searchParams?.filter} fallback={<SkeletonLoading />}>
        <ShowItems searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function ShowItems({
  searchParams,
}: {
  searchParams?: {
    filter?: string;
    country?: string;
    guest?: string;
    bathroom?: string;
    room?: string
  };
}) {
  const {getUser} = getKindeServerSession()
  const user = await getUser()
  const data = await GetData({ searchParams: searchParams ,userId: user?.id});
  return (
    <>
      {data.length === 0 ? (
        <NoItems 
          title="Sorry no listings for this category found..."
          description="Please check a other category or create your own listing!"
        />
      ) : (
        <div className="grid lg:grid-cols-4 sm:grid-cols-2 md:grid-cols-3 gap-8 mt-8">
          {data?.map((item) => {
            return (
              <ListingCard
                key={item.id}
                description={item.description as string}
                imagePath={item.photo as string}
                price={item.price as number}
                location={item.country as string}
                userId={user?.id}
                favoriteId={item.Favorite[0]?.id}
                isInFavoriteList={item.Favorite.length > 0 ? true : false}
                homeId={item?.id}
                pathName="/"
              />
            );
          })}
        </div>
      )}
    </>
  );
}

function SkeletonLoading() {
  return (
    <div className="grid lg:grid-cols-4 sm:grid-cols-2 md:grid-cols-3 gap-8 mt-8">
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
    </div>
  );
}
