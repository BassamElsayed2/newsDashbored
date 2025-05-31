"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useLogout } from "@/components/Authentication/useLogout";

interface SidebarMenuProps {
  toggleActive: () => void;
}

const SidebarMenu: React.FC<SidebarMenuProps> = ({ toggleActive }) => {
  const pathname = usePathname();

  const { logout } = useLogout();

  // Initialize openIndex to 0 to open the first item by default
  const [openIndex, setOpenIndex] = React.useState<number | null>(0);

  const toggleAccordion = (index: number) => {
    setOpenIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  return (
    <>
      <div className="sidebar-area bg-white dark:bg-[#0c1427] fixed z-[7] top-0 h-screen transition-all rounded-r-md">
        <div className="logo bg-white dark:bg-[#0c1427] border-b border-gray-100 dark:border-[#172036] px-[25px] pt-[19px] pb-[15px] absolute z-[2] right-0 top-0 left-0">
          <Link
            href="/dashboard"
            className="transition-none relative flex items-center outline-none"
          >
            <Image
              src="/images/logo-icon.svg"
              alt="logo-icon"
              width={26}
              height={26}
            />
            <span className="font-bold text-black dark:text-white relative ltr:ml-[8px] rtl:mr-[8px] top-px text-xl">
              Trezo
            </span>
          </Link>

          <button
            type="button"
            className="burger-menu inline-block absolute z-[3] top-[24px] ltr:right-[25px] rtl:left-[25px] transition-all hover:text-primary-500"
            onClick={toggleActive}
          >
            <i className="material-symbols-outlined">close</i>
          </button>
        </div>

        <div className="pt-[89px] px-[22px] pb-[20px] h-screen overflow-y-scroll sidebar-custom-scrollbar">
          <div className="accordion">
            <span className="block relative font-medium uppercase text-gray-400 mb-[8px] text-xs">
              رئيسي
            </span>

            {/* <div className="accordion-item rounded-md text-black dark:text-white mb-[5px] whitespace-nowrap">
              <button
                className={`accordion-button toggle flex items-center transition-all py-[9px] ltr:pl-[14px] ltr:pr-[30px] rtl:pr-[14px] rtl:pl-[30px] rounded-md font-medium w-full relative hover:bg-gray-50 text-left dark:hover:bg-[#15203c] ${
                  openIndex === 0 ? "open" : ""
                }`}
                type="button"
                onClick={() => toggleAccordion(0)}
              >
                <i className="material-symbols-outlined transition-all text-gray-500 dark:text-gray-400 ltr:mr-[7px] rtl:ml-[7px] !text-[22px] leading-none relative -top-px">
                  dashboard
                </i>
                <span className="title leading-none">Dashboard</span>
                <span className="rounded-full font-medium inline-block text-center w-[20px] h-[20px] text-[11px] leading-[20px] text-orange-500 bg-orange-50 dark:bg-[#ffffff14] ltr:ml-auto rtl:mr-auto">
                  30
                </span>
              </button>

              <div
                className={`accordion-collapse ${
                  openIndex === 0 ? "open" : "hidden"
                }`}
              >
                <div className="pt-[4px]">
                  <ul className="sidebar-sub-menu">
                    <li className="sidemenu-item mb-[4px] last:mb-0">
                      <Link
                        href="/dashboard/ecommerce/"
                        className={`sidemenu-link rounded-md flex items-center relative transition-all font-medium text-gray-500 dark:text-gray-400 py-[9px] ltr:pl-[38px] ltr:pr-[30px] rtl:pr-[38px] rtl:pl-[30px] hover:text-primary-500 hover:bg-primary-50 w-full text-left dark:hover:bg-[#15203c] ${
                          pathname === "/dashboard/ecommerce/" ? "active" : ""
                        }`}
                      >
                        eCommerce
                      </Link>
                    </li>

                    <li className="sidemenu-item mb-[4px] last:mb-0">
                      <Link
                        href="/dashboard/crm/"
                        className={`sidemenu-link rounded-md flex items-center relative transition-all font-medium text-gray-500 dark:text-gray-400 py-[9px] ltr:pl-[38px] ltr:pr-[30px] rtl:pr-[38px] rtl:pl-[30px] hover:text-primary-500 hover:bg-primary-50 w-full text-left dark:hover:bg-[#15203c] ${
                          pathname === "/dashboard/crm/" ? "active" : ""
                        }`}
                      >
                        CRM
                      </Link>
                    </li>

                    <li className="sidemenu-item mb-[4px] last:mb-0">
                      <Link
                        href="/dashboard/project-management/"
                        className={`sidemenu-link rounded-md flex items-center relative transition-all font-medium text-gray-500 dark:text-gray-400 py-[9px] ltr:pl-[38px] ltr:pr-[30px] rtl:pr-[38px] rtl:pl-[30px] hover:text-primary-500 hover:bg-primary-50 w-full text-left dark:hover:bg-[#15203c] ${
                          pathname === "/dashboard/project-management/"
                            ? "active"
                            : ""
                        }`}
                      >
                        Project Management
                      </Link>
                    </li>

                    <li className="sidemenu-item mb-[4px] last:mb-0">
                      <Link
                        href="/dashboard/lms/"
                        className={`sidemenu-link rounded-md flex items-center relative transition-all font-medium text-gray-500 dark:text-gray-400 py-[9px] ltr:pl-[38px] ltr:pr-[30px] rtl:pr-[38px] rtl:pl-[30px] hover:text-primary-500 hover:bg-primary-50 w-full text-left dark:hover:bg-[#15203c] ${
                          pathname === "/dashboard/lms/" ? "active" : ""
                        }`}
                      >
                        LMS
                      </Link>
                    </li>

                    <li className="sidemenu-item mb-[4px] last:mb-0">
                      <Link
                        href="/dashboard/helpdesk/"
                        className={`sidemenu-link rounded-md flex items-center relative transition-all font-medium text-gray-500 dark:text-gray-400 py-[9px] ltr:pl-[38px] ltr:pr-[30px] rtl:pr-[38px] rtl:pl-[30px] hover:text-primary-500 hover:bg-primary-50 w-full text-left dark:hover:bg-[#15203c] ${
                          pathname === "/dashboard/helpdesk/" ? "active" : ""
                        }`}
                      >
                        HelpDesk{" "}
                        <span className="text-[10px] font-medium py-[1px] px-[8px] ltr:ml-[8px] rtl:mr-[8px] text-danger-500 bg-danger-100 dark:bg-[#ffffff14] inline-block rounded-sm">
                          Hot
                        </span>
                      </Link>
                    </li>

                    <li className="sidemenu-item mb-[4px] last:mb-0">
                      <Link
                        href="/dashboard/analytics/"
                        className={`sidemenu-link rounded-md flex items-center relative transition-all font-medium text-gray-500 dark:text-gray-400 py-[9px] ltr:pl-[38px] ltr:pr-[30px] rtl:pr-[38px] rtl:pl-[30px] hover:text-primary-500 hover:bg-primary-50 w-full text-left dark:hover:bg-[#15203c] ${
                          pathname === "/dashboard/analytics/" ? "active" : ""
                        }`}
                      >
                        Analytics
                      </Link>
                    </li>

                    <li className="sidemenu-item mb-[4px] last:mb-0">
                      <Link
                        href="/dashboard/crypto/"
                        className={`sidemenu-link rounded-md flex items-center relative transition-all font-medium text-gray-500 dark:text-gray-400 py-[9px] ltr:pl-[38px] ltr:pr-[30px] rtl:pr-[38px] rtl:pl-[30px] hover:text-primary-500 hover:bg-primary-50 w-full text-left dark:hover:bg-[#15203c] ${
                          pathname === "/dashboard/crypto/" ? "active" : ""
                        }`}
                      >
                        Crypto
                      </Link>
                    </li>

                    <li className="sidemenu-item mb-[4px] last:mb-0">
                      <Link
                        href="/dashboard/sales/"
                        className={`sidemenu-link rounded-md flex items-center relative transition-all font-medium text-gray-500 dark:text-gray-400 py-[9px] ltr:pl-[38px] ltr:pr-[30px] rtl:pr-[38px] rtl:pl-[30px] hover:text-primary-500 hover:bg-primary-50 w-full text-left dark:hover:bg-[#15203c] ${
                          pathname === "/dashboard/sales/" ? "active" : ""
                        }`}
                      >
                        Sales
                      </Link>
                    </li>

                    <li className="sidemenu-item mb-[4px] last:mb-0">
                      <Link
                        href="/dashboard/hospital/"
                        className={`sidemenu-link rounded-md flex items-center relative transition-all font-medium text-gray-500 dark:text-gray-400 py-[9px] ltr:pl-[38px] ltr:pr-[30px] rtl:pr-[38px] rtl:pl-[30px] hover:text-primary-500 hover:bg-primary-50 w-full text-left dark:hover:bg-[#15203c] ${
                          pathname === "/dashboard/hospital/" ? "active" : ""
                        }`}
                      >
                        Hospital
                      </Link>
                    </li>

                    <li className="sidemenu-item mb-[4px] last:mb-0">
                      <Link
                        href="/dashboard/hrm/"
                        className={`sidemenu-link rounded-md flex items-center relative transition-all font-medium text-gray-500 dark:text-gray-400 py-[9px] ltr:pl-[38px] ltr:pr-[30px] rtl:pr-[38px] rtl:pl-[30px] hover:text-primary-500 hover:bg-primary-50 w-full text-left dark:hover:bg-[#15203c] ${
                          pathname === "/dashboard/hrm/" ? "active" : ""
                        }`}
                      >
                        HRM
                      </Link>
                    </li>

                    <li className="sidemenu-item mb-[4px] last:mb-0">
                      <Link
                        href="/dashboard/school/"
                        className={`sidemenu-link rounded-md flex items-center relative transition-all font-medium text-gray-500 dark:text-gray-400 py-[9px] ltr:pl-[38px] ltr:pr-[30px] rtl:pr-[38px] rtl:pl-[30px] hover:text-primary-500 hover:bg-primary-50 w-full text-left dark:hover:bg-[#15203c] ${
                          pathname === "/dashboard/school/" ? "active" : ""
                        }`}
                      >
                        School
                      </Link>
                    </li>

                    <li className="sidemenu-item mb-[4px] last:mb-0">
                      <Link
                        href="/dashboard/call-center/"
                        className={`sidemenu-link rounded-md flex items-center relative transition-all font-medium text-gray-500 dark:text-gray-400 py-[9px] ltr:pl-[38px] ltr:pr-[30px] rtl:pr-[38px] rtl:pl-[30px] hover:text-primary-500 hover:bg-primary-50 w-full text-left dark:hover:bg-[#15203c] ${
                          pathname === "/dashboard/call-center/" ? "active" : ""
                        }`}
                      >
                        Call Center{" "}
                        <span className="text-[10px] font-medium py-[1px] px-[8px] ltr:ml-[8px] rtl:mr-[8px] text-success-600 bg-success-100 dark:bg-[#ffffff14] inline-block rounded-sm">
                          Popular
                        </span>
                      </Link>
                    </li>

                    <li className="sidemenu-item mb-[4px] last:mb-0">
                      <Link
                        href="/dashboard/marketing/"
                        className={`sidemenu-link rounded-md flex items-center relative transition-all font-medium text-gray-500 dark:text-gray-400 py-[9px] ltr:pl-[38px] ltr:pr-[30px] rtl:pr-[38px] rtl:pl-[30px] hover:text-primary-500 hover:bg-primary-50 w-full text-left dark:hover:bg-[#15203c] ${
                          pathname === "/dashboard/marketing/" ? "active" : ""
                        }`}
                      >
                        Marketing
                      </Link>
                    </li>

                    <li className="sidemenu-item mb-[4px] last:mb-0">
                      <Link
                        href="/dashboard/nft/"
                        className={`sidemenu-link rounded-md flex items-center relative transition-all font-medium text-gray-500 dark:text-gray-400 py-[9px] ltr:pl-[38px] ltr:pr-[30px] rtl:pr-[38px] rtl:pl-[30px] hover:text-primary-500 hover:bg-primary-50 w-full text-left dark:hover:bg-[#15203c] ${
                          pathname === "/dashboard/nft/" ? "active" : ""
                        }`}
                      >
                        NFT
                      </Link>
                    </li>

                    <li className="sidemenu-item mb-[4px] last:mb-0">
                      <Link
                        href="/dashboard/saas/"
                        className={`sidemenu-link rounded-md flex items-center relative transition-all font-medium text-gray-500 dark:text-gray-400 py-[9px] ltr:pl-[38px] ltr:pr-[30px] rtl:pr-[38px] rtl:pl-[30px] hover:text-primary-500 hover:bg-primary-50 w-full text-left dark:hover:bg-[#15203c] ${
                          pathname === "/dashboard/saas/" ? "active" : ""
                        }`}
                      >
                        SaaS
                      </Link>
                    </li>

                    <li className="sidemenu-item mb-[4px] last:mb-0">
                      <Link
                        href="/dashboard/real-estate/"
                        className={`sidemenu-link rounded-md flex items-center relative transition-all font-medium text-gray-500 dark:text-gray-400 py-[9px] ltr:pl-[38px] ltr:pr-[30px] rtl:pr-[38px] rtl:pl-[30px] hover:text-primary-500 hover:bg-primary-50 w-full text-left dark:hover:bg-[#15203c] ${
                          pathname === "/dashboard/real-estate/" ? "active" : ""
                        }`}
                      >
                        Real Estate{" "}
                        <span className="text-[10px] font-medium py-[1px] px-[8px] ltr:ml-[8px] rtl:mr-[8px] text-purple-500 bg-purple-100 dark:bg-[#ffffff14] inline-block rounded-sm">
                          Top
                        </span>
                      </Link>
                    </li>

                    <li className="sidemenu-item mb-[4px] last:mb-0">
                      <Link
                        href="/dashboard/shipment/"
                        className={`sidemenu-link rounded-md flex items-center relative transition-all font-medium text-gray-500 dark:text-gray-400 py-[9px] ltr:pl-[38px] ltr:pr-[30px] rtl:pr-[38px] rtl:pl-[30px] hover:text-primary-500 hover:bg-primary-50 w-full text-left dark:hover:bg-[#15203c] ${
                          pathname === "/dashboard/shipment/" ? "active" : ""
                        }`}
                      >
                        Shipment
                      </Link>
                    </li>

                    <li className="sidemenu-item mb-[4px] last:mb-0">
                      <Link
                        href="/dashboard/finance/"
                        className={`sidemenu-link rounded-md flex items-center relative transition-all font-medium text-gray-500 dark:text-gray-400 py-[9px] ltr:pl-[38px] ltr:pr-[30px] rtl:pr-[38px] rtl:pl-[30px] hover:text-primary-500 hover:bg-primary-50 w-full text-left dark:hover:bg-[#15203c] ${
                          pathname === "/dashboard/finance/" ? "active" : ""
                        }`}
                      >
                        Finance
                      </Link>
                    </li>

                    <li className="sidemenu-item mb-[4px] last:mb-0">
                      <Link
                        href="/dashboard/pos-system/"
                        className={`sidemenu-link rounded-md flex items-center relative transition-all font-medium text-gray-500 dark:text-gray-400 py-[9px] ltr:pl-[38px] ltr:pr-[30px] rtl:pr-[38px] rtl:pl-[30px] hover:text-primary-500 hover:bg-primary-50 w-full text-left dark:hover:bg-[#15203c] ${
                          pathname === "/dashboard/pos-system/" ? "active" : ""
                        }`}
                      >
                        POS System
                      </Link>
                    </li>

                    <li className="sidemenu-item mb-[4px] last:mb-0">
                      <Link
                        href="/dashboard/podcast/"
                        className={`sidemenu-link rounded-md flex items-center relative transition-all font-medium text-gray-500 dark:text-gray-400 py-[9px] ltr:pl-[38px] ltr:pr-[30px] rtl:pr-[38px] rtl:pl-[30px] hover:text-primary-500 hover:bg-primary-50 w-full text-left dark:hover:bg-[#15203c] ${
                          pathname === "/dashboard/podcast/" ? "active" : ""
                        }`}
                      >
                        Podcast
                      </Link>
                    </li>

                    <li className="sidemenu-item mb-[4px] last:mb-0">
                      <Link
                        href="/dashboard/social-media/"
                        className={`sidemenu-link rounded-md flex items-center relative transition-all font-medium text-gray-500 dark:text-gray-400 py-[9px] ltr:pl-[38px] ltr:pr-[30px] rtl:pr-[38px] rtl:pl-[30px] hover:text-primary-500 hover:bg-primary-50 w-full text-left dark:hover:bg-[#15203c] ${
                          pathname === "/dashboard/social-media/"
                            ? "active"
                            : ""
                        }`}
                      >
                        Social Media
                      </Link>
                    </li>

                    <li className="sidemenu-item mb-[4px] last:mb-0">
                      <Link
                        href="/dashboard/doctor/"
                        className={`sidemenu-link rounded-md flex items-center relative transition-all font-medium text-gray-500 dark:text-gray-400 py-[9px] ltr:pl-[38px] ltr:pr-[30px] rtl:pr-[38px] rtl:pl-[30px] hover:text-primary-500 hover:bg-primary-50 w-full text-left dark:hover:bg-[#15203c] ${
                          pathname === "/dashboard/doctor/" ? "active" : ""
                        }`}
                      >
                        Doctor
                      </Link>
                    </li>

                    <li className="sidemenu-item mb-[4px] last:mb-0">
                      <Link
                        href="/dashboard/beauty-salon/"
                        className={`sidemenu-link rounded-md flex items-center relative transition-all font-medium text-gray-500 dark:text-gray-400 py-[9px] ltr:pl-[38px] ltr:pr-[30px] rtl:pr-[38px] rtl:pl-[30px] hover:text-primary-500 hover:bg-primary-50 w-full text-left dark:hover:bg-[#15203c] ${
                          pathname === "/dashboard/beauty-salon/"
                            ? "active"
                            : ""
                        }`}
                      >
                        Beauty Salon
                      </Link>
                    </li>

                    <li className="sidemenu-item mb-[4px] last:mb-0">
                      <Link
                        href="/dashboard/store-analysis/"
                        className={`sidemenu-link rounded-md flex items-center relative transition-all font-medium text-gray-500 dark:text-gray-400 py-[9px] ltr:pl-[38px] ltr:pr-[30px] rtl:pr-[38px] rtl:pl-[30px] hover:text-primary-500 hover:bg-primary-50 w-full text-left dark:hover:bg-[#15203c] ${
                          pathname === "/dashboard/store-analysis/"
                            ? "active"
                            : ""
                        }`}
                      >
                        Store Analysis
                      </Link>
                    </li>

                    <li className="sidemenu-item mb-[4px] last:mb-0">
                      <Link
                        href="/dashboard/restaurant/"
                        className={`sidemenu-link rounded-md flex items-center relative transition-all font-medium text-gray-500 dark:text-gray-400 py-[9px] ltr:pl-[38px] ltr:pr-[30px] rtl:pr-[38px] rtl:pl-[30px] hover:text-primary-500 hover:bg-primary-50 w-full text-left dark:hover:bg-[#15203c] ${
                          pathname === "/dashboard/restaurant/" ? "active" : ""
                        }`}
                      >
                        Restaurant
                      </Link>
                    </li>

                    <li className="sidemenu-item mb-[4px] last:mb-0">
                      <Link
                        href="/dashboard/hotel/"
                        className={`sidemenu-link rounded-md flex items-center relative transition-all font-medium text-gray-500 dark:text-gray-400 py-[9px] ltr:pl-[38px] ltr:pr-[30px] rtl:pr-[38px] rtl:pl-[30px] hover:text-primary-500 hover:bg-primary-50 w-full text-left dark:hover:bg-[#15203c] ${
                          pathname === "/dashboard/hotel/" ? "active" : ""
                        }`}
                      >
                        Hotel{" "}
                        <span className="text-[10px] font-medium py-[1px] px-[8px] ltr:ml-[8px] rtl:mr-[8px] text-orange-500 bg-orange-100 dark:bg-[#ffffff14] inline-block rounded-sm">
                          New
                        </span>
                      </Link>
                    </li>

                    <li className="sidemenu-item mb-[4px] last:mb-0">
                      <Link
                        href="/dashboard/real-estate-agent/"
                        className={`sidemenu-link rounded-md flex items-center relative transition-all font-medium text-gray-500 dark:text-gray-400 py-[9px] ltr:pl-[38px] ltr:pr-[30px] rtl:pr-[38px] rtl:pl-[30px] hover:text-primary-500 hover:bg-primary-50 w-full text-left dark:hover:bg-[#15203c] ${
                          pathname === "/dashboard/real-estate-agent/"
                            ? "active"
                            : ""
                        }`}
                      >
                        Real Estate Agent{" "}
                        <span className="text-[10px] font-medium py-[1px] px-[8px] ltr:ml-[8px] rtl:mr-[8px] text-orange-500 bg-orange-100 dark:bg-[#ffffff14] inline-block rounded-sm">
                          New
                        </span>
                      </Link>
                    </li>

                    <li className="sidemenu-item mb-[4px] last:mb-0">
                      <Link
                        href="/dashboard/credit-card/"
                        className={`sidemenu-link rounded-md flex items-center relative transition-all font-medium text-gray-500 dark:text-gray-400 py-[9px] ltr:pl-[38px] ltr:pr-[30px] rtl:pr-[38px] rtl:pl-[30px] hover:text-primary-500 hover:bg-primary-50 w-full text-left dark:hover:bg-[#15203c] ${
                          pathname === "/dashboard/credit-card/" ? "active" : ""
                        }`}
                      >
                        Credit Card{" "}
                        <span className="text-[10px] font-medium py-[1px] px-[8px] ltr:ml-[8px] rtl:mr-[8px] text-orange-500 bg-orange-100 dark:bg-[#ffffff14] inline-block rounded-sm">
                          New
                        </span>
                      </Link>
                    </li>

                    <li className="sidemenu-item mb-[4px] last:mb-0">
                      <Link
                        href="/dashboard/crypto-trader/"
                        className={`sidemenu-link rounded-md flex items-center relative transition-all font-medium text-gray-500 dark:text-gray-400 py-[9px] ltr:pl-[38px] ltr:pr-[30px] rtl:pr-[38px] rtl:pl-[30px] hover:text-primary-500 hover:bg-primary-50 w-full text-left dark:hover:bg-[#15203c] ${
                          pathname === "/dashboard/crypto-trader/"
                            ? "active"
                            : ""
                        }`}
                      >
                        Crypto Trader{" "}
                        <span className="text-[10px] font-medium py-[1px] px-[8px] ltr:ml-[8px] rtl:mr-[8px] text-orange-500 bg-orange-100 dark:bg-[#ffffff14] inline-block rounded-sm">
                          New
                        </span>
                      </Link>
                    </li>

                    <li className="sidemenu-item mb-[4px] last:mb-0">
                      <Link
                        href="/dashboard/crypto-performance/"
                        className={`sidemenu-link rounded-md flex items-center relative transition-all font-medium text-gray-500 dark:text-gray-400 py-[9px] ltr:pl-[38px] ltr:pr-[30px] rtl:pr-[38px] rtl:pl-[30px] hover:text-primary-500 hover:bg-primary-50 w-full text-left dark:hover:bg-[#15203c] ${
                          pathname === "/dashboard/crypto-performance/"
                            ? "active"
                            : ""
                        }`}
                      >
                        Crypto Perf.{" "}
                        <span className="text-[10px] font-medium py-[1px] px-[8px] ltr:ml-[8px] rtl:mr-[8px] text-orange-500 bg-orange-100 dark:bg-[#ffffff14] inline-block rounded-sm">
                          New
                        </span>
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div> */}

            <div className="accordion-item rounded-md text-black dark:text-white mb-[5px] whitespace-nowrap">
              <button
                className={`accordion-button toggle flex items-center transition-all py-[9px] ltr:pl-[14px] ltr:pr-[30px] rtl:pr-[14px] rtl:pl-[30px] rounded-md font-medium w-full relative hover:bg-gray-50 text-left dark:hover:bg-[#15203c] ${
                  openIndex === 0 ? "open" : ""
                }`}
                type="button"
                onClick={() => toggleAccordion(0)}
              >
                <i className="material-symbols-outlined transition-all text-gray-500 dark:text-gray-400 ltr:mr-[7px] rtl:ml-[7px] !text-[22px] leading-none relative -top-px">
                  newspaper
                </i>
                <span className="title leading-none">أخبار</span>
              </button>

              <div className="pt-[4px]">
                <ul className="sidebar-sub-menu">
                  <div
                    className={`accordion-collapse ${
                      openIndex === 0 ? "open" : "hidden"
                    }`}
                  >
                    <li className="sidemenu-item mb-[4px] last:mb-0">
                      <Link
                        href="/dashboard/news"
                        className={`sidemenu-link rounded-md flex items-center relative transition-all font-medium text-gray-500 dark:text-gray-400 py-[9px] ltr:pl-[38px] ltr:pr-[30px] rtl:pr-[14px] rtl:pl-[30px] hover:text-primary-500 hover:bg-primary-50 w-full text-left dark:hover:bg-[#15203c] ${
                          pathname === "/dashboard/news/" ? "active" : ""
                        }`}
                      >
                        <i className="ri-list-check-2  transition-all text-gray-500 dark:text-gray-400 ltr:mr-[7px] rtl:ml-[7px] !text-[22px] leading-none relative -top-px"></i>
                        قائمة الأخبار
                      </Link>
                    </li>
                  </div>
                  <div
                    className={`accordion-collapse ${
                      openIndex === 0 ? "open" : "hidden"
                    }`}
                  >
                    <li className="sidemenu-item mb-[4px] last:mb-0">
                      <Link
                        href="/dashboard/news/create-news"
                        className={`sidemenu-link rounded-md flex items-center relative transition-all font-medium text-gray-500 dark:text-gray-400 py-[9px] ltr:pl-[38px] ltr:pr-[30px] rtl:pr-[14px] rtl:pl-[30px] hover:text-primary-500 hover:bg-primary-50 w-full text-left dark:hover:bg-[#15203c] ${
                          pathname === "/dashboard/news/create-news"
                            ? "active"
                            : ""
                        }`}
                      >
                        <i className="ri-newspaper-line  transition-all text-gray-500 dark:text-gray-400 ltr:mr-[7px] rtl:ml-[7px] !text-[22px] leading-none relative -top-px"></i>
                        إنشاء الأخبار
                      </Link>
                    </li>
                  </div>
                  <li className="sidemenu-item mb-[4px] last:mb-0">
                    <Link
                      href="/dashboard/categories/"
                      className={`sidemenu-link rounded-md flex items-center relative transition-all font-medium text-gray-500 dark:text-gray-400 py-[9px] ltr:pl-[38px] ltr:pr-[30px] rtl:pr-[14px] rtl:pl-[30px] hover:text-primary-500 hover:bg-primary-50 w-full text-left dark:hover:bg-[#15203c] ${
                        pathname === "/dashboard/categories/" ? "active" : ""
                      }`}
                    >
                      <i className="ri-price-tag-3-line  transition-all text-gray-500 dark:text-gray-400 ltr:mr-[7px] rtl:ml-[7px] !text-[22px] leading-none relative -top-px"></i>
                      فئات
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            <div className="accordion-item rounded-md text-black dark:text-white mb-[5px] whitespace-nowrap">
              <button
                className={`accordion-button toggle flex items-center transition-all py-[9px] ltr:pl-[14px] ltr:pr-[30px] rtl:pr-[14px] rtl:pl-[30px] rounded-md font-medium w-full relative hover:bg-gray-50 text-left dark:hover:bg-[#15203c] ${
                  openIndex === 0 ? "open" : ""
                }`}
                type="button"
                onClick={() => toggleAccordion(0)}
              >
                <i className="material-symbols-outlined transition-all text-gray-500 dark:text-gray-400 ltr:mr-[7px] rtl:ml-[7px] !text-[22px] leading-none relative -top-px">
                  photo_library
                </i>

                <span className="title leading-none">صور</span>
              </button>

              <div className="pt-[4px]">
                <ul className="sidebar-sub-menu">
                  <div
                    className={`accordion-collapse ${
                      openIndex === 0 ? "open" : "hidden"
                    }`}
                  >
                    <li className="sidemenu-item mb-[4px] last:mb-0">
                      <Link
                        href="/dashboard/images-gallery"
                        className={`sidemenu-link rounded-md flex items-center relative transition-all font-medium text-gray-500 dark:text-gray-400 py-[9px] ltr:pl-[38px] ltr:pr-[30px] rtl:pr-[14px] rtl:pl-[30px] hover:text-primary-500 hover:bg-primary-50 w-full text-left dark:hover:bg-[#15203c] ${
                          pathname === "/dashboard/images-gallery/"
                            ? "active"
                            : ""
                        }`}
                      >
                        <i className="ri-multi-image-fill  transition-all text-gray-500 dark:text-gray-400 ltr:mr-[7px] rtl:ml-[7px] !text-[22px] leading-none relative -top-px"></i>
                        معرض الصور
                      </Link>
                    </li>
                  </div>
                  <div
                    className={`accordion-collapse ${
                      openIndex === 0 ? "open" : "hidden"
                    }`}
                  >
                    <li className="sidemenu-item mb-[4px] last:mb-0">
                      <Link
                        href="/dashboard/images-gallery/create-gallery"
                        className={`sidemenu-link rounded-md flex items-center relative transition-all font-medium text-gray-500 dark:text-gray-400 py-[9px] ltr:pl-[38px] ltr:pr-[30px] rtl:pr-[14px] rtl:pl-[30px] hover:text-primary-500 hover:bg-primary-50 w-full text-left dark:hover:bg-[#15203c] ${
                          pathname === "/dashboard/images/create-gallery"
                            ? "active"
                            : ""
                        }`}
                      >
                        <i className="ri-image-ai-line transition-all text-gray-500 dark:text-gray-400 ltr:mr-[7px] rtl:ml-[7px] !text-[22px] leading-none relative -top-px"></i>
                        إنشاء معرض
                      </Link>
                    </li>
                  </div>
                </ul>
              </div>
            </div>

            <span className="block relative font-medium uppercase text-gray-400 mb-[8px] text-xs [&:not(:first-child)]:mt-[22px]">
              أخري
            </span>

            <div className="accordion-item rounded-md text-black dark:text-white mb-[5px] whitespace-nowrap">
              <Link
                href="/dashboard/my-profile/"
                className={`accordion-button flex items-center transition-all py-[9px] ltr:pl-[14px] ltr:pr-[30px] rtl:pr-[14px] rtl:pl-[30px] rounded-md font-medium w-full relative hover:bg-gray-50 text-left dark:hover:bg-[#15203c] ${
                  pathname === "/dashboard/my-profile/" ? "active" : ""
                }`}
              >
                <i className="material-symbols-outlined transition-all text-gray-500 dark:text-gray-400 ltr:mr-[7px] rtl:ml-[7px] !text-[22px] leading-none relative -top-px">
                  account_circle
                </i>
                <span className="title leading-none">ملفي الشخصي</span>
              </Link>
            </div>

            <div className="accordion-item rounded-md text-black dark:text-white mb-[5px] whitespace-nowrap">
              <button
                className={`accordion-button toggle flex items-center transition-all py-[9px] ltr:pl-[14px] ltr:pr-[30px] rtl:pr-[14px] rtl:pl-[30px] rounded-md font-medium w-full relative hover:bg-gray-50 text-left dark:hover:bg-[#15203c] ${
                  openIndex === 29 ? "open" : ""
                }`}
                type="button"
                onClick={() => toggleAccordion(29)}
              >
                <i className="material-symbols-outlined transition-all text-gray-500 dark:text-gray-400 ltr:mr-[7px] rtl:ml-[7px] !text-[22px] leading-none relative -top-px">
                  settings
                </i>
                <span className="title leading-none">إعدادات</span>
              </button>

              <div
                className={`accordion-collapse ${
                  openIndex === 29 ? "open" : "hidden"
                }`}
              >
                <div className="pt-[4px]">
                  <ul className="sidebar-sub-menu">
                    <li className="sidemenu-item mb-[4px] last:mb-0">
                      <Link
                        href="/dashboard/my-profile/edit/"
                        className={`sidemenu-link rounded-md flex items-center relative transition-all font-medium text-gray-500 dark:text-gray-400 py-[9px] ltr:pl-[38px] ltr:pr-[30px] rtl:pr-[38px] rtl:pl-[30px] hover:text-primary-500 hover:bg-primary-50 w-full text-left dark:hover:bg-[#15203c] ${
                          pathname === "/dashboard/my-profile/edit/"
                            ? "active"
                            : ""
                        }`}
                      >
                        إعدادات الحساب
                      </Link>
                    </li>

                    <li className="sidemenu-item mb-[4px] last:mb-0">
                      <Link
                        href="/dashboard/my-profile/change-password/"
                        className={`sidemenu-link rounded-md flex items-center relative transition-all font-medium text-gray-500 dark:text-gray-400 py-[9px] ltr:pl-[38px] ltr:pr-[30px] rtl:pr-[38px] rtl:pl-[30px] hover:text-primary-500 hover:bg-primary-50 w-full text-left dark:hover:bg-[#15203c] ${
                          pathname === "/dashboard/my-profile/change-password/"
                            ? "active"
                            : ""
                        }`}
                      >
                        تغيير كلمة المرور
                      </Link>
                    </li>
                    <li className="sidemenu-item mb-[4px] last:mb-0">
                      <Link
                        href="/dashboard/add-user/"
                        className={`sidemenu-link rounded-md flex items-center relative transition-all font-medium text-gray-500 dark:text-gray-400 py-[9px] ltr:pl-[38px] ltr:pr-[30px] rtl:pr-[38px] rtl:pl-[30px] hover:text-primary-500 hover:bg-primary-50 w-full text-left dark:hover:bg-[#15203c] ${
                          pathname === "/dashboard/add-user/" ? "active" : ""
                        }`}
                      >
                        أضف مستخدم
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="accordion-item rounded-md text-black dark:text-white mb-[5px] whitespace-nowrap">
              <button
                onClick={() => logout()}
                className={`accordion-button flex items-center transition-all py-[9px] ltr:pl-[14px] ltr:pr-[30px] rtl:pr-[14px] rtl:pl-[30px] rounded-md font-medium w-full relative hover:bg-gray-50 text-left dark:hover:bg-[#15203c] ${
                  pathname === "/" ? "active" : ""
                }`}
              >
                <i className="material-symbols-outlined transition-all text-gray-500 dark:text-gray-400 ltr:mr-[7px] rtl:ml-[7px] !text-[22px] leading-none relative -top-px">
                  logout
                </i>
                <span className="title leading-none">تسجيل الخروج</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SidebarMenu;
