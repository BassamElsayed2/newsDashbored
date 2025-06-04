"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import supabase from "../../../../../services/supabase";
import toast from "react-hot-toast";

export interface Ad {
  id: string;
  title_ar: string;
  title_en: string;
  image_url: string;
  location: string;
  created_at: string;
}

const AdsList: React.FC = () => {
  const [adsList, setAdsList] = useState<Ad[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const adsPerPage = 8;

  // ✅ تحميل البيانات من Supabase
  useEffect(() => {
    const fetchAds = async () => {
      const { data, error } = await supabase
        .from("ads")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching ads:", error.message);
      } else {
        setAdsList(data as Ad[]);
      }
    };

    fetchAds();
  }, []);

  // ✅ حذف إعلان من Supabase
  const handleDeleteAd = async (id: string) => {
    try {
      const { error } = await supabase.from("ads").delete().eq("id", id);

      if (error) {
        toast.error(`Delete failed: ${error.message}`);
      } else {
        setAdsList((prev) => prev.filter((ad) => ad.id !== id));
        toast.success("تم مسح الاعلان بنجاح");
      }
    } catch (err) {
      toast.error(`Unexpected error: ${(err as Error).message}`);
    }
  };

  // ✅ البحث فقط بدون tabs
  const searchedAds = adsList.filter(
    (ad) =>
      typeof ad.title_ar === "string" &&
      ad.title_ar.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(searchedAds.length / adsPerPage);
  const paginatedAds = searchedAds.slice(
    (currentPage - 1) * adsPerPage,
    currentPage * adsPerPage
  );

  return (
    <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
      <div className="trezo-tabs ads-tabs">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-[20px] md:mb-[25px]">
          <Link
            href="/ads/create-ads"
            className="inline-block transition-all rounded-md font-medium px-[13px] py-[6px] text-primary-500 border border-primary-500 hover:bg-primary-500 hover:text-white"
          >
            <span className="relative pl-6">
              <i className="material-symbols-outlined absolute left-0 top-1/2 -translate-y-1/2">
                add
              </i>
              أضف أعلان جديد
            </span>
          </Link>
        </div>

        <div className="table-responsive overflow-x-auto">
          <table className="w-full">
            <thead className="text-black dark:text-white text-end">
              <tr>
                {["العنوان", "الصوره", "مكان النشر", "التاريخ", "أجرأت"].map(
                  (head, i) => (
                    <th
                      key={i}
                      className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] bg-gray-50 dark:bg-[#15203c]"
                    >
                      {head}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {paginatedAds.map((ad) => (
                <tr
                  key={ad.id}
                  className="border-t border-gray-100 dark:border-gray-800"
                >
                  <td className="py-3 px-3 font-semibold">{ad.title_ar}</td>
                  <td className="py-3 px-3">
                    <Image
                      src={ad.image_url}
                      alt={ad.title_en}
                      width={60}
                      height={40}
                      className="rounded"
                    />
                  </td>
                  <td className="py-3 px-3">{ad.location}</td>
                  <td className="py-3 px-3">
                    {new Date(ad.created_at).toLocaleDateString("ar-EG")}
                  </td>
                  <td className="py-3 px-3">
                    <button
                      onClick={() => handleDeleteAd(ad.id)}
                      className="text-danger-500 leading-none"
                    >
                      <i className="material-symbols-outlined !text-md">
                        delete
                      </i>
                    </button>
                  </td>
                </tr>
              ))}
              {paginatedAds.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-5 text-center text-gray-400">
                    No ads found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-4">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 rounded-md mx-1 text-sm ${
                  currentPage === i + 1
                    ? "bg-primary-500 text-white"
                    : "bg-gray-200"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdsList;
