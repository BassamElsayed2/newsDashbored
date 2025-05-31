"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteNews, getNews } from "../../../../../services/apiNews";
import { getCategories } from "../../../../../services/apiCategories";
import toast from "react-hot-toast";

const statusColors: Record<string, string> = {
  normal: "bg-primary-50 dark:bg-[#15203c] text-primary-500",
  important: "bg-success-50 dark:bg-[#15203c] text-success-500",
  urgent: "bg-danger-50 dark:bg-[#15203c] text-danger-500",
  trend: "bg-pink-50 dark:bg-[#15203c] text-danger-500",
};

const NewsListTable: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string | undefined>(
    undefined
  );

  const [currentPage, setCurrentPage] = useState(1);

  const pageSize = 10;

  const { isPending, data } = useQuery({
    queryKey: ["news", currentPage, selectedCategory, selectedStatus],
    queryFn: () =>
      getNews(currentPage, pageSize, {
        categoryId: selectedCategory,
        status: selectedStatus,
      }),
  });

  const news = data?.news || [];
  const total = data?.total || 0;
  const totalPages = Math.ceil(total / pageSize);

  const [categoriesMap, setCategoriesMap] = useState<{
    [key: string]: string;
  }>({});

  useEffect(() => {
    async function fetchCategories() {
      try {
        const categories = await getCategories();
        // نبني خريطة id => category name
        const map: Record<number, string> = {};
        categories.forEach((cat) => {
          map[cat.id] = cat.name_ar;
        });
        setCategoriesMap(map);
      } catch (err) {
        console.error(err);
      }
    }

    fetchCategories();
  }, []);

  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: deleteNews,
    onSuccess: () => {
      toast.success("تم حذف الخبر بنجاح");
      queryClient.invalidateQueries({ queryKey: ["news"] });
    },
    onError: (err) => {
      toast.error("حدث خطأ أثناء حذف الخبر");
      console.error(err);
    },
  });

  const endIndex = Math.min(currentPage * pageSize, total);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, selectedStatus]);

  if (isPending) return <p>Loading...</p>;

  return (
    <>
      <div className="mb-[25px] md:flex items-center justify-between">
        <h5 className="!mb-0"> قائمة الاخبار</h5>

        <ol className="breadcrumb mt-[12px] md:mt-0 rtl:flex-row-reverse">
          <li className="breadcrumb-item inline-block relative text-sm mx-[11px] ltr:first:ml-0 rtl:first:mr-0 ltr:last:mr-0 rtl:last:ml-0">
            <Link
              href="/dashboard"
              className="inline-block relative ltr:pl-[22px] rtl:pr-[22px] transition-all hover:text-primary-500"
            >
              <i className="material-symbols-outlined absolute ltr:left-0 rtl:right-0 !text-lg -mt-px text-primary-500 top-1/2 -translate-y-1/2">
                home
              </i>
              رئيسية
            </Link>
          </li>
          <li className="breadcrumb-item inline-block  relative text-sm mx-[11px] ltr:first:ml-0 rtl:first:mr-0 ltr:last:mr-0 rtl:last:ml-0">
            الاخبار
          </li>
        </ol>
      </div>
      <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-header mb-[20px] md:mb-[25px] sm:flex items-center justify-between">
          <div className="trezo-card-subtitle mt-[15px] sm:mt-0">
            <Link
              href="/dashboard/news/create-news/"
              className="inline-block transition-all rounded-md font-medium px-[13px] py-[6px] text-primary-500 border border-primary-500 hover:bg-primary-500 hover:text-white"
            >
              <span className="inline-block relative ltr:pl-[22px] rtl:pr-[22px]">
                <i className="material-symbols-outlined !text-[22px] absolute ltr:-left-[4px] rtl:-right-[4px] top-1/2 -translate-y-1/2">
                  add
                </i>
                أضف خبر جديد
              </span>
            </Link>
          </div>
        </div>

        <div className="mb-4 flex gap-4 items-center justify-end ">
          {/* فلتر التصنيف */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="p-2 border transition border-[#f2f2f2] hover:bg-[#f2f2f2] rounded-lg outline-none dark:border-[#172036] dark:hover:bg-[#172036] "
          >
            <option value="">جميع التصنيفات</option>
            {Object.entries(categoriesMap).map(([id, name]) => (
              <option key={id} value={id}>
                {name}
              </option>
            ))}
          </select>

          {/* فلتر الحالة */}
          <select
            value={selectedStatus ?? ""}
            onChange={(e) => setSelectedStatus(e.target.value || undefined)}
            className="p-2 border transition border-[#f2f2f2] hover:bg-[#f2f2f2] rounded-lg outline-none dark:border-[#172036] dark:hover:bg-[#172036] "
          >
            <option value="">جميع الحالات</option>

            <option value="urgent">عاجل</option>
            <option value="important">مهم</option>
          </select>
        </div>

        <div className="trezo-card-content">
          <div className="table-responsive overflow-x-auto">
            <table className="w-full">
              <thead className="text-black dark:text-white">
                <tr>
                  {[
                    "الخبر",
                    "تاريخ الانشاء",
                    "التصنيف",

                    "الحالة",
                    "الاجرائات",
                  ].map((header) => (
                    <th
                      key={header}
                      className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap ltr:first:rounded-tl-md ltr:last:rounded-tr-md rtl:first:rounded-tr-md rtl:last:rounded-tl-md"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="text-black dark:text-white">
                {news?.map((item) => (
                  <tr key={item.id}>
                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036] ltr:first:border-l ltr:last:border-r rtl:first:border-r rtl:last:border-l">
                      <div className="flex items-center text-black dark:text-white transition-all hover:text-primary-500">
                        <Image
                          className="rounded-md w-[40px]"
                          alt="event-image"
                          src={item?.images?.[0] || "/"}
                          width={40}
                          height={40}
                        />
                        <span className="block text-[15px] font-medium ltr:ml-[12px] rtl:mr-[12px]">
                          {item.title_ar.length > 30
                            ? item.title_ar.slice(0, 30) + "..."
                            : item.title_ar}
                        </span>
                      </div>
                    </td>

                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036] ltr:first:border-l ltr:last:border-r rtl:first:border-r rtl:last:border-l">
                      {new Date(item.created_at as string).toLocaleDateString(
                        "ar-EG",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}
                    </td>

                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036] ltr:first:border-l ltr:last:border-r rtl:first:border-r rtl:last:border-l">
                      {categoriesMap[item.category_id] || "غير معروف"}
                    </td>

                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036] ltr:first:border-l ltr:last:border-r rtl:first:border-r rtl:last:border-l">
                      <span
                        className={`px-[8px] py-[3px] inline-block rounded-sm font-medium text-xs dark:bg-[#15203c] ${
                          statusColors[item.status || "normal"] ??
                          statusColors["normal"]
                        }`}
                      >
                        {item.status === "" || item.status == null
                          ? "normal"
                          : item.status}
                      </span>
                    </td>

                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036] ltr:first:border-l ltr:last:border-r rtl:first:border-r rtl:last:border-l">
                      <div className="flex items-center gap-[9px]">
                        <div className="relative group">
                          <Link
                            href={`/dashboard/news/${item.id}`}
                            className="text-gray-500 leading-none"
                            type="button"
                          >
                            <i className="material-symbols-outlined !text-md">
                              edit
                            </i>
                          </Link>

                          {/* Tooltip */}
                          <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            تعديل
                            {/* Arrow */}
                            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-white dark:border-[#172036] border-t-gray-800 dark:border-t-gray-800"></div>
                          </div>
                        </div>

                        <div className="relative group">
                          <button
                            onClick={() => {
                              console.log("Deleting ID:", item.id);
                              mutate(item.id as string);
                            }}
                            disabled={isPending}
                            className="text-danger-500 leading-none"
                          >
                            <i className="material-symbols-outlined !text-md">
                              delete
                            </i>
                          </button>

                          {/* Tooltip */}
                          <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            مسح
                            {/* Arrow */}
                            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-white dark:border-[#172036] border-t-gray-800 dark:border-t-gray-800"></div>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className=" flex justify-between">
              <p className="mt-2 text-gray-600 dark:text-gray-300 text-sm">
                عرض {endIndex} أخبار من اجمالي {total} خبر
              </p>

              <div className="mt-4 flex justify-center gap-2">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="px-3 py-1 border rounded disabled:opacity-50"
                >
                  السابق
                </button>
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`px-3 py-1 border rounded ${
                      currentPage === i + 1 ? "bg-primary-500 text-white" : ""
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border rounded disabled:opacity-50"
                >
                  التالي
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NewsListTable;
