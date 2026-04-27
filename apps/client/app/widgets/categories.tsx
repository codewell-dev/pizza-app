"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Category } from "@/types/product";

interface Props {
  categories: Category[];
}

export default function Categories({ categories = [] }: Props) {
  return (
    <div className="max-w-7xl mx-auto overflow-x-auto scrollbar-hide">
      <div className="flex items-center justify-center gap-3 px-2 min-w-max">
        {categories.map((cat, index) => (
          <Link
            key={index}
            href={`/category/${cat.url}`}
            className="flex flex-col items-center justify-center min-w-[60px] p-1.5 rounded-lg hover:bg-gray-100 active:bg-gray-200 transition-all duration-150"
          >
            <div className="w-8 h-8 relative">
              <Image
                src={
                  cat.image.startsWith("http")
                    ? cat.image
                    : `https://pizzahouse.ua${cat.image}`
                }
                alt={cat.title}
                fill
                sizes="32px"
                className="object-contain"
              />
            </div>
            <p className="text-[13px] mt-1 text-center text-gray-800 leading-tight">
              {cat.title}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
