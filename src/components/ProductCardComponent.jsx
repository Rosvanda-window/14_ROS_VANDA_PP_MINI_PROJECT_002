"use client";

import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import { useCartStore } from "../store/useCardStore";

export function StarRow({ rating = 4.8 }) {
  return (
    <div className="flex items-center gap-0.5 text-amber-400" aria-label={`${rating} stars`}>
      <span className="text-sm">★★★★★</span>
      <span className="ml-1 text-xs tabular-nums text-gray-500">{rating}</span>
    </div>
  );
}

export default function ProductCardComponent({ product }) {
  // fallback to prevent null
  const { productId, productName = "Unknown Product", price = 0, imageUrl } = product || {};
  const addToCart = useCartStore((state) => state.addToCart);
  const isValidImageUrl = 
    imageUrl && 
    imageUrl !== "string" && 
    (imageUrl.startsWith("http") || imageUrl.startsWith("/"));

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();

    addToCart({
      id: productId,
      name: productName,
      price: price,
      imageUrl: isValidImageUrl ? imageUrl : ""
    });
    toast.success(`${productName} added to cart!`);
  };

  return (
    <article className="group relative rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition hover:shadow-md h-full flex flex-col">
      <Link href={`/products/${productId}`} className="block">
        <div className="relative aspect-square overflow-hidden rounded-xl bg-gray-100">
          {isValidImageUrl ? (
            <Image
              src={imageUrl}
              alt={productName}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className="object-cover transition group-hover:scale-[1.02]"
              unoptimized 
            />
          ) : (
            <div className="flex size-full items-center justify-center bg-linear-to-br from-gray-100 to-lime-50/30 text-gray-400 text-3xl">
              ◇
            </div>
          )}
        </div>
      </Link>

      <div className="relative mt-4 pr-14 grow">
        <StarRow />
        <Link href={`/products/${productId}`}>
          <h3 className="mt-1 line-clamp-2 text-sm font-semibold text-gray-900 hover:text-lime-700">
            {productName}
          </h3>
        </Link>
        <p className="mt-2 text-base font-semibold tabular-nums text-gray-900">${price}</p>
      </div>
      
      {/* button add cart */}
      <div className="absolute bottom-4 right-4 z-10">
        <button 
          onClick={handleAddToCart}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-lime-400 text-gray-900 shadow-sm transition hover:bg-lime-300 active:scale-95"
          title="Add to Cart"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
        </button>
      </div>
    </article>
  );
}