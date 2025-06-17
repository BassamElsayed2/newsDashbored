"use client";

import { useCategories } from "@/components/news/categories/useCategories";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";

import {
  Editor,
  EditorProvider,
  BtnBold,
  BtnBulletList,
  BtnClearFormatting,
  BtnItalic,
  BtnLink,
  BtnNumberedList,
  BtnRedo,
  BtnStrikeThrough,
  BtnStyles,
  BtnUnderline,
  BtnUndo,
  HtmlButton,
  Separator,
  Toolbar,
} from "react-simple-wysiwyg";
import {
  getNewsById,
  updateNews,
  uploadImages,
} from "../../../../../../services/apiNews";
import { useEffect, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import Image from "next/image";
import toast from "react-hot-toast";

interface NewsFormData {
  title_ar: string;
  title_en: string;
  category_id: string;
  status: string;
  publisher_name: string;
  yt_code: string;
  content_ar: string;
  content_en: string;
}

export default function EditNewsPage() {
  const [serverImages, setServerImages] = useState<string[]>([]);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [isUploadingImages, setIsUploadingImages] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const { register, handleSubmit, reset, control } = useForm({
    defaultValues: {
      title_ar: "",
      title_en: "",
      category_id: "",
      status: "",
      publisher_name: "",
      yt_code: "",
      content_ar: "",
      content_en: "",
    },
  });

  //get id
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  //get categories
  const { data: categories } = useCategories();

  const { data: news } = useQuery({
    queryKey: ["news", id],
    queryFn: () => {
      if (!id) throw new Error("No ID provided");
      return getNewsById(id);
    },
    enabled: !!id,
  });

  useEffect(() => {
    if (news) {
      reset({
        title_ar: news.title_ar || "",
        title_en: news.title_en || "",
        category_id: news.category_id?.toString() || "",
        status: news.status || "",
        publisher_name: news.publisher_name || "",
        yt_code: news.yt_code || "",
        content_ar: news.content_ar || "",
        content_en: news.content_en || "",
      });

      if (news.images && Array.isArray(news.images)) {
        setServerImages(news.images);
      } else {
        setServerImages([]);
      }
      setSelectedImages([]);
    }
  }, [news, reset]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const filesArray = Array.from(e.target.files);
    setSelectedImages((prev) => [...prev, ...filesArray]);
  };

  const handleRemoveServerImage = (index: number) => {
    setServerImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRemoveSelectedImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const queryClient = useQueryClient();

  const onSubmit: SubmitHandler<NewsFormData> = async (data) => {
    try {
      if (!id) throw new Error("No ID found");

      setIsSubmitting(true);
      let uploadedUrls: string[] = [];

      if (selectedImages && selectedImages.length > 0) {
        setIsUploadingImages(true);
        uploadedUrls = await uploadImages(selectedImages, "news");
        setIsUploadingImages(false);
      }
      const allImages = [...serverImages, ...uploadedUrls];

      const updatedData = {
        ...data,
        images: allImages,
      };

      // تنفيذ التحديث في Supabase
      const updated = await updateNews(id, updatedData);

      console.log("تم تحديث الخبر بنجاح:", updated);

      // يمكنك هنا إعادة التوجيه أو عرض رسالة نجاح
      toast.success("تم تحديث الخبر بنجاح");
      queryClient.invalidateQueries({ queryKey: ["news"] });
      router.push("/dashboard/news");
    } catch (error: Error | unknown) {
      toast.error("حدث خطأ ما");
      console.log("حدث خطأ أثناء تحديث الخبر:", error);
    } finally {
      setIsSubmitting(false);
      setIsUploadingImages(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className=" gap-[25px]">
        <div className="lg:col-span-2">
          <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
            <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between">
              <div className="trezo-card-title">
                <h5 className="!mb-0">تعديل خبر</h5>
              </div>
            </div>

            <div className="trezo-card-content">
              <div className="sm:grid sm:grid-cols-2 sm:gap-[25px]">
                {/* العنوانين */}
                <div>
                  <label className="block font-medium mb-2">العنوان (ع)</label>
                  <input
                    {...register("title_ar")}
                    className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                  />
                </div>

                <div>
                  <label className="block font-medium mb-2">العنوان (EN)</label>
                  <input
                    {...register("title_en")}
                    className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                  />
                </div>

                {/* التصنيف */}
                {news && (
                  <div className="mb-[20px] sm:mb-0">
                    <label className="mb-[10px] text-black dark:text-white font-medium block">
                      التصنيف
                    </label>
                    <select
                      {...register("category_id")}
                      className="h-[55px] rounded-md border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[13px] block w-full outline-0 cursor-pointer transition-all focus:border-primary-500"
                    >
                      {categories?.map((category) => (
                        <option
                          key={category.id}
                          value={category.id.toString()}
                        >
                          {category.name_ar}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* الحالة */}
                <div>
                  <label className="block font-medium mb-2">الحالة</label>
                  <select
                    {...register("status")}
                    className="h-[55px] rounded-md border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[13px] block w-full outline-0 cursor-pointer transition-all focus:border-primary-500"
                  >
                    <option value="">اختر الحالة</option>
                    <option value="important">مهم</option>
                    <option value="urgent">عاجل</option>
                  </select>
                </div>

                {/* اسم الناشر */}
                <div>
                  <label
                    {...register("publisher_name")}
                    className="block font-medium mb-2"
                  >
                    اسم الناشر
                  </label>
                  <input className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500" />
                </div>

                {/* كود اليوتيوب */}
                <div>
                  <label className="block font-medium mb-2">كود يوتيوب</label>
                  <input
                    {...register("yt_code")}
                    className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                  />
                </div>

                {/* الخبر بالعربية */}
                <div className="sm:col-span-2">
                  <EditorProvider>
                    <Controller
                      control={control}
                      name="content_ar"
                      render={({ field }) => (
                        <div className="sm:col-span-2">
                          <label className="block font-medium mb-2">
                            محتوى الخبر (ع)
                          </label>
                          <EditorProvider>
                            <Editor
                              style={{ minHeight: "200px" }}
                              value={field.value} // القيمة الحالية من useForm
                              onChange={field.onChange} // تحديث القيمة في useForm
                            >
                              <Toolbar>
                                <BtnUndo />
                                <BtnRedo />
                                <Separator />
                                <BtnBold />
                                <BtnItalic />
                                <BtnUnderline />
                                <BtnStrikeThrough />
                                <Separator />
                                <BtnNumberedList />
                                <BtnBulletList />
                                <Separator />
                                <BtnLink />
                                <BtnClearFormatting />
                                <HtmlButton />
                                <Separator />
                                <BtnStyles />
                              </Toolbar>
                            </Editor>
                          </EditorProvider>
                        </div>
                      )}
                    />
                  </EditorProvider>
                </div>

                {/* الخبر بالانجليزية */}
                <div className="sm:col-span-2">
                  <EditorProvider>
                    <Controller
                      control={control}
                      name="content_en"
                      render={({ field }) => (
                        <div className="sm:col-span-2">
                          <label className="block font-medium mb-2">
                            محتوى الخبر (EN)
                          </label>
                          <EditorProvider>
                            <Editor
                              style={{ minHeight: "200px" }}
                              value={field.value}
                              onChange={field.onChange}
                            >
                              <Toolbar>
                                <BtnUndo />
                                <BtnRedo />
                                <Separator />
                                <BtnBold />
                                <BtnItalic />
                                <BtnUnderline />
                                <BtnStrikeThrough />
                                <Separator />
                                <BtnNumberedList />
                                <BtnBulletList />
                                <Separator />
                                <BtnLink />
                                <BtnClearFormatting />
                                <HtmlButton />
                                <Separator />
                                <BtnStyles />
                              </Toolbar>
                            </Editor>
                          </EditorProvider>
                        </div>
                      )}
                    />
                  </EditorProvider>
                </div>

                {/* الصور */}
                <div className="sm:col-span-2 mb-[20px] sm:mb-0">
                  <label className="mb-[10px] text-black dark:text-white font-medium block">
                    صور الخبر
                  </label>

                  <div id="fileUploader">
                    <div className="relative flex items-center justify-center overflow-hidden rounded-md py-[88px] px-[20px] border border-gray-200 dark:border-[#172036]">
                      <div className="flex items-center justify-center">
                        <div className="w-[35px] h-[35px] border border-gray-100 dark:border-[#15203c] flex items-center justify-center rounded-md text-primary-500 text-lg ltr:mr-[12px] rtl:ml-[12px]">
                          <i className="ri-upload-2-line"></i>
                        </div>
                        <p className="leading-[1.5]">
                          <strong className="text-black dark:text-white">
                            اضغط لرفع
                          </strong>
                          <br /> الصور من هنا
                        </p>
                      </div>

                      <input
                        type="file"
                        id="images"
                        multiple
                        accept="image/*"
                        onChange={handleImageChange}
                        className="absolute top-0 left-0 right-0 bottom-0 rounded-md z-[1] opacity-0 cursor-pointer"
                      />
                    </div>

                    {/* Image Previews */}
                    <div className="mt-[10px] flex flex-wrap gap-2">
                      {/* صور السيرفر */}
                      {serverImages.map((url, index) => (
                        <div
                          key={`server-${index}`}
                          className="relative w-[50px] h-[50px]"
                        >
                          <Image
                            src={url}
                            alt={`server-img-${index}`}
                            width={50}
                            height={50}
                            className="rounded-md"
                          />
                          <button
                            type="button"
                            className="absolute top-[-5px] right-[-5px] bg-red-600 text-white w-[20px] h-[20px] flex items-center justify-center rounded-full text-xs"
                            onClick={() => handleRemoveServerImage(index)}
                          >
                            ✕
                          </button>
                        </div>
                      ))}

                      {/* صور الرفع الجديدة */}
                      {selectedImages.map((file, index) => (
                        <div
                          key={`selected-${index}`}
                          className="relative w-[50px] h-[50px]"
                        >
                          <Image
                            src={URL.createObjectURL(file)}
                            alt={`selected-img-${index}`}
                            width={50}
                            height={50}
                            className="rounded-md"
                          />
                          <button
                            type="button"
                            className="absolute top-[-5px] right-[-5px] bg-orange-500 text-white w-[20px] h-[20px] flex items-center justify-center rounded-full text-xs"
                            onClick={() => handleRemoveSelectedImage(index)}
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* الأزرار */}
      <div className="trezo-card mb-[25px]">
        <div className="trezo-card-content">
          <button
            type="reset"
            className="font-medium inline-block transition-all rounded-md md:text-md ltr:mr-[15px] rtl:ml-[15px] py-[10px] md:py-[12px] px-[20px] md:px-[22px] bg-danger-500 text-white hover:bg-danger-400"
          >
            إلغاء
          </button>

          <button
            type="submit"
            disabled={isSubmitting || isUploadingImages}
            className="font-medium inline-block transition-all rounded-md md:text-md py-[10px] md:py-[12px] px-[20px] md:px-[22px] bg-primary-500 text-white hover:bg-primary-400 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="inline-block relative ltr:pl-[29px] rtl:pr-[29px]">
              {isUploadingImages ? (
                <>
                  <i className="material-symbols-outlined ltr:left-0 rtl:right-0 absolute top-1/2 -translate-y-1/2 animate-spin">
                    sync
                  </i>
                  جاري رفع الصور...
                </>
              ) : isSubmitting ? (
                <>
                  <i className="material-symbols-outlined ltr:left-0 rtl:right-0 absolute top-1/2 -translate-y-1/2 animate-spin">
                    sync
                  </i>
                  جاري الحفظ...
                </>
              ) : (
                <>
                  <i className="material-symbols-outlined ltr:left-0 rtl:right-0 absolute top-1/2 -translate-y-1/2">
                    save
                  </i>
                  حفظ التعديلات
                </>
              )}
            </span>
          </button>
        </div>
      </div>
    </form>
  );
}
