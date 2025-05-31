"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { getGalleries } from "../../../../../services/apiGallery";
import { useQuery } from "@tanstack/react-query";

const ProductsGrid: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: gallery } = useQuery({
    queryKey: ["galleries"],
    queryFn: getGalleries,
  });

  return (
    <>
      <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-header sm:flex items-center justify-between">
          <div className="trezo-card-title">
            <h5 className="!mb-0 !font-medium">Filter</h5>
          </div>

          <div className="trezo-card-subtitle mt-[15px] sm:mt-0 sm:flex items-center gap-[20px]">
            <form className="relative sm:w-[265px]">
              <label className="leading-none absolute ltr:left-[13px] rtl:right-[13px] text-black dark:text-white mt-px top-1/2 -translate-y-1/2">
                <i className="material-symbols-outlined !text-[20px]">search</i>
              </label>
              <input
                type="text"
                placeholder="Search here..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-gray-50 border border-gray-50 h-[36px] text-xs rounded-md w-full block text-black pt-[11px] pb-[12px] ltr:pl-[38px] rtl:pr-[38px] ltr:pr-[13px] ltr:md:pr-[16px] rtl:pl-[13px] rtl:md:pl-[16px] placeholder:text-gray-500 outline-0 dark:bg-[#15203c] dark:text-white dark:border-[#15203c] dark:placeholder:text-gray-400"
              />
            </form>

            <div className="trezo-card-dropdown relative mt-[15px] sm:mt-0">
              <button
                type="button"
                className="trezo-card-dropdown-btn inline-block rounded-md border border-gray-100 py-[5px] md:py-[6.5px] px-[12px] md:px-[19px] transition-all hover:bg-gray-50 dark:border-[#172036] dark:hover:bg-[#0a0e19]"
                id="dropdownToggleBtn"
              >
                <span className="inline-block relative ltr:pr-[17px] ltr:md:pr-[20px] rtl:pl-[17px] rtl:ml:pr-[20px]">
                  Default Sorting
                  <i className="ri-arrow-down-s-line text-lg absolute ltr:-right-[3px] rtl:-left-[3px] top-1/2 -translate-y-1/2"></i>
                </span>
              </button>

              <ul className="trezo-card-dropdown-menu transition-all bg-white shadow-3xl rounded-md top-full py-[15px] absolute ltr:right-0 rtl:left-0 w-[195px] z-[50] dark:bg-dark dark:shadow-none">
                <li>
                  <button
                    type="button"
                    className="block w-full transition-all text-black ltr:text-left rtl:text-right relative py-[8px] px-[20px] hover:bg-gray-50 dark:text-white dark:hover:bg-black"
                  >
                    Default Sorting
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    className="block w-full transition-all text-black ltr:text-left rtl:text-right relative py-[8px] px-[20px] hover:bg-gray-50 dark:text-white dark:hover:bg-black"
                  >
                    Price Low to High
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    className="block w-full transition-all text-black ltr:text-left rtl:text-right relative py-[8px] px-[20px] hover:bg-gray-50 dark:text-white dark:hover:bg-black"
                  >
                    Price High to Low
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    className="block w-full transition-all text-black ltr:text-left rtl:text-right relative py-[8px] px-[20px] hover:bg-gray-50 dark:text-white dark:hover:bg-black"
                  >
                    Top Sales
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    className="block w-full transition-all text-black ltr:text-left rtl:text-right relative py-[8px] px-[20px] hover:bg-gray-50 dark:text-white dark:hover:bg-black"
                  >
                    Newest Arrivals
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Products */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[25px] mb-[25px]">
        {gallery?.map((image) => (
          <div key={image.id} className="md:mb-[10px] lg:mb-[17px]">
            <div className="relative">
              <span className="block ltr:right-0 rtl:left-0 bottom-0 w-[65px] h-[65px] absolute ltr:rounded-tl-md rtl:rounded-tr-md bg-white dark:bg-[#0c1427]"></span>

              <Link
                href={`/dashboard/images-gallery/${image.id}`}
                className="block rounded-md"
              >
                <div className="relative w-full aspect-[1/1] overflow-hidden rounded-md">
                  <Image
                    src={image.image_urls[0]}
                    alt={image.title_ar}
                    fill
                    className="object-cover"
                  />
                </div>
              </Link>

              <button
                className="rounded-md transition-all z-[1] inline-block absolute ltr:right-0 rtl:left-0 bottom-0 w-[60px] h-[60px] leading-[72px] bg-primary-500 text-white hover:bg-primary-400"
                type="button"
              >
                <Image
                  src={image.image_urls[1]}
                  alt={image.title_ar}
                  width={60}
                  height={60}
                />
              </button>
            </div>

            <div className="mt-[19px]">
              <h6 className="!text-md !font-normal">
                <Link
                  href={`/dashboard/images-gallery/${image.id}`}
                  className="transition-all hover:text-primary-500"
                >
                  {image.title_ar}
                </Link>
              </h6>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {/* <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-content">
          <div className="sm:flex sm:items-center justify-between">
            <p className="!mb-0">
              {" "}
              Showing{" "}
              {Math.min(
                (currentPage - 1) * productsPerPage + 1,
                filteredProducts.length
              )}
              -
              {Math.min(currentPage * productsPerPage, filteredProducts.length)}{" "}
              of {filteredProducts.length} results
            </p>

            <ol className="mt-[10px] sm:mt-0">
              <li className="inline-block mx-[2px] ltr:first:ml-0 ltr:last:mr-0 rtl:first:mr-0 rtl:last:ml-0">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="w-[31px] h-[31px] block leading-[29px] relative text-center rounded-md border border-gray-100 dark:border-[#172036] transition-all hover:bg-primary-500 hover:text-white hover:border-primary-500"
                >
                  <span className="opacity-0">0</span>
                  <i className="material-symbols-outlined left-0 right-0 absolute top-1/2 -translate-y-1/2">
                    chevron_right
                  </i>
                </button>
              </li>

              {[...Array(totalPages)].map((_, index) => (
                <li
                  key={index}
                  className="inline-block mx-[2px] ltr:first:ml-0 ltr:last:mr-0 rtl:first:mr-0 rtl:last:ml-0"
                >
                  <button
                    onClick={() => handlePageChange(index + 1)}
                    className={`w-[31px] h-[31px] block leading-[29px] relative text-center rounded-md border ${
                      currentPage === index + 1
                        ? "bg-primary-500 text-white"
                        : "border-gray-100 dark:border-[#172036] hover:bg-primary-500 hover:text-white hover:border-primary-500"
                    }`}
                  >
                    {index + 1}
                  </button>
                </li>
              ))}

              <li className="inline-block mx-[2px] ltr:first:ml-0 ltr:last:mr-0 rtl:first:mr-0 rtl:last:ml-0">
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="w-[31px] h-[31px] block leading-[29px] relative text-center rounded-md border border-gray-100 dark:border-[#172036] transition-all hover:bg-primary-500 hover:text-white hover:border-primary-500"
                >
                  <span className="opacity-0">0</span>
                  <i className="material-symbols-outlined left-0 right-0 absolute top-1/2 -translate-y-1/2">
                    chevron_left
                  </i>
                </button>
              </li>
            </ol>
          </div>
        </div>
      </div> */}
    </>
  );
};

export default ProductsGrid;
