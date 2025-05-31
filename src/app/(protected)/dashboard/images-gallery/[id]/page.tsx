"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  deleteGalleries,
  getGalleriesById,
} from "../../../../../../services/apiGallery";
import toast from "react-hot-toast";

interface Gallery {
  id: string;
  title_ar: string;
  title_en: string;
  description_ar?: string;
  description_en?: string;
  image_urls: string[];
}

const ProductDetails: React.FC = () => {
  const [activeTab, setActiveTab] = useState<number>(0);
  const router = useRouter();

  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const { data: gallery } = useQuery<Gallery>({
    queryKey: ["gallery", id],
    queryFn: () => {
      if (!id) throw new Error("No ID provided");
      return getGalleriesById(id);
    },
    enabled: !!id,
  });

  const handleTabClick = (index: number) => {
    setActiveTab(index);
  };

  return (
    <>
      <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-content lg:max-w-[1070px] md:pt-[15px] md:px-[15px] md:pb-[75px]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-[25px]">
            <div className="lg:ltr:mr-[30px] lg:rtl:ml-[30px]">
              {gallery?.image_urls?.[activeTab] && (
                <div className="relative w-full aspect-[4/3] rounded-md overflow-hidden">
                  <Image
                    src={gallery.image_urls[activeTab]}
                    alt={gallery.title_ar || "gallery image"}
                    fill
                    className="object-cover"
                  />
                </div>
              )}

              <div className="flex gap-[20px] mt-[20px] overflow-x-auto">
                {gallery?.image_urls?.map((img: string, idx: number) => (
                  <div
                    key={idx}
                    onClick={() => handleTabClick(idx)}
                    className={`cursor-pointer rounded-md overflow-hidden w-[100px] h-[75px] relative border ${
                      activeTab === idx
                        ? "border-primary"
                        : "border-transparent"
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`gallery thumbnail ${idx + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h6 className="!font-medium !text-lg !leading-[1.5] !mb-[16px]">
                {gallery?.title_ar || "عنوان المعرض"}
              </h6>
              <p className="text-muted">{gallery?.description_ar}</p>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <button
            onClick={async () => {
              const confirmDelete = confirm(
                "هل أنت متأكد أنك تريد حذف المعرض؟"
              );
              if (!confirmDelete || !id) return;

              try {
                await deleteGalleries(id);
                toast.success("تم حذف المعرض بنجاح");
                router.push("/dashboard/images-gallery");
              } catch (error) {
                toast.error("فشل في حذف المعرض");
                console.error(error);
              }
            }}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
          >
            حذف المعرض
          </button>
        </div>
      </div>
    </>
  );
};

export default ProductDetails;
