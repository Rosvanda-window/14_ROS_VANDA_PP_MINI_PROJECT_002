"use client";

import { useState } from "react";
import { Button } from "@heroui/react";
import ProductCardComponent from "../ProductCardComponent";
import { useSession } from "next-auth/react";
import { getAllCategories } from "@/service/category.service";

const ESSENTIALS_TABS = ["All", "Cleansers", "Moisturizers", "Serums"];

export default function LandingEssentialsGrid({ products = [] }) {
  const [tab, setTab] = useState("All");
  const { status } = useSession();

  const filtered =
    tab === "All" ? products : products.filter((p) => p.category === tab);

  if (status === "unauthenticated") return null;

  return (
    <section id="shop" className="mx-auto w-full max-w-7xl py-16 lg:py-20">
      <div className="flex flex-col items-center text-center">
        <h2 className="text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
          Our skincare essentials
        </h2>
      </div>

      <div className="mt-10 flex flex-wrap justify-center gap-2">
        {status === "authenticated" ? (
          <>
            {ESSENTIALS_TABS.map((label) => (
              <Button
                key={label}
                onPress={() => setTab(label)}
                className={`rounded-full px-5 py-2.5 ${tab === label ? "bg-lime-400" : "bg-gray-100"}`}
              >
                {label}
              </Button>
            ))}
          </>
        ) : (
          "login first to see"
        )}
      </div>

      <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4">
        {status === "authenticated" ? (
          <>
            {filtered.map((product) => (
              <ProductCardComponent product={product} key={product.productId} />
            ))}
          </>
        ) : (
          "login first to see"
        )}
      </div>
    </section>
  );
}
