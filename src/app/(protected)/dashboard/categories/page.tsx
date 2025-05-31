"use client";

import React, { useState } from "react";
import { useCategories } from "@/components/news/categories/useCategories";
import { useUpdateCategory } from "@/components/news/categories/useUpdateCategory";
import { useDeleteCategory } from "@/components/news/categories/useDeleteCategory";
import { useAddCategory } from "@/components/news/categories/useCreateCategory";
import Link from "next/link";

interface Category {
  id: string;
  name_ar: string;
  name_en: string;
}

export default function CategoriesPage() {
  const { data: categories, isLoading, isError, refetch } = useCategories();

  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(
    null
  );
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [editAr, setEditAr] = useState("");
  const [editEn, setEditEn] = useState("");

  const [newAr, setNewAr] = useState("");
  const [newEn, setNewEn] = useState("");

  const { updateCategory, isPending: isUpdating } = useUpdateCategory();
  const { deleteCategory, isPending: isDeleting } = useDeleteCategory();
  const { addCategory, isPending: isAdding } = useAddCategory();

  const openEditModal = (cat: Category) => {
    setEditingCategory(cat);
    setEditAr(cat.name_ar);
    setEditEn(cat.name_en);
  };

  const closeEditModal = () => {
    setEditingCategory(null);
    setEditAr("");
    setEditEn("");
  };

  const handleEditSave = () => {
    if (!editingCategory) return;
    updateCategory(
      {
        id: editingCategory.id,
        name_ar: editAr.trim(),
        name_en: editEn.trim(),
      },
      {
        onSuccess: () => {
          closeEditModal();
          refetch();
        },
      }
    );
  };

  const openDeleteModal = (cat: Category) => setDeletingCategory(cat);
  const closeDeleteModal = () => setDeletingCategory(null);

  const handleDeleteConfirm = () => {
    if (!deletingCategory) return;
    deleteCategory(deletingCategory.id, {
      onSuccess: () => {
        closeDeleteModal();
        refetch();
      },
    });
  };

  const handleAddCategory = () => {
    if (!newAr.trim() || !newEn.trim()) return;
    addCategory(
      {
        name_ar: newAr.trim(),
        name_en: newEn.trim(),
      },
      {
        onSuccess: () => {
          setNewAr("");
          setNewEn("");
          setIsAddModalOpen(false);
          refetch();
        },
      }
    );
  };

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-48 text-gray-500">
        جاري التحميل...
      </div>
    );
  if (isError)
    return (
      <div className="flex justify-center items-center h-48 text-red-500">
        حدث خطأ أثناء جلب التصنيفات
      </div>
    );

  return (
    <>
      <div className="mb-[25px] md:flex items-center justify-between">
        <h5 className="!mb-0"> التصنيفات</h5>

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
            التصنيفات
          </li>
        </ol>
      </div>
      <div className="p-6 bg-white rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-semibold text-gray-800">التصنيفات</h1>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-5 py-2 rounded-md bg-primary-600 hover:bg-primary-700 text-white font-medium transition"
          >
            إضافة تصنيف جديد
          </button>
        </div>

        <table className="w-full border border-gray-300 rounded-md overflow-hidden">
          <thead className="bg-gray-100 text-black text-right">
            <tr>
              <th className="p-3 border-b border-gray-300">الاسم </th>
              <th className="p-3 border-b border-gray-300 text-center">
                الإجراءات
              </th>
            </tr>
          </thead>
          <tbody>
            {categories?.map((cat) => (
              <tr
                key={cat.id}
                className="hover:bg-gray-50 cursor-pointer transition-colors"
                onDoubleClick={() => openEditModal(cat)}
                title={`انقر مزدوجاً لتعديل "${cat.name_ar}"`}
              >
                <td className="p-3 border-b border-gray-300">
                  <div className="text-gray-800 text-lg">{cat.name_ar}</div>
                  <div className="text-sm text-gray-500">{cat.name_en}</div>
                </td>
                <td className="p-3 border-b border-gray-300 text-center">
                  <div className="inline-flex items-center justify-center gap-6">
                    <button
                      onClick={() => openEditModal(cat)}
                      title="تعديل"
                      className="text-primary-600 hover:text-primary-800 transition-colors"
                      aria-label={`تعديل تصنيف ${cat.name_ar}`}
                    >
                      <i className="material-symbols-outlined text-lg">edit</i>
                    </button>
                    <button
                      onClick={() => openDeleteModal(cat)}
                      title="حذف"
                      className="text-red-600 hover:text-red-800 transition-colors"
                      aria-label={`حذف تصنيف ${cat.name_ar}`}
                    >
                      <i className="material-symbols-outlined text-lg">
                        delete
                      </i>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* مودال التعديل */}
        {editingCategory && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">
                تعديل التصنيف
              </h2>
              <input
                type="text"
                placeholder="الاسم بالعربية"
                className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={editAr}
                onChange={(e) => setEditAr(e.target.value)}
                disabled={isUpdating}
              />
              <input
                type="text"
                placeholder="الاسم بالإنجليزية"
                className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={editEn}
                onChange={(e) => setEditEn(e.target.value)}
                disabled={isUpdating}
              />
              <div className="mt-6 flex justify-end gap-4">
                <button
                  onClick={closeEditModal}
                  disabled={isUpdating}
                  className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 transition"
                >
                  إلغاء
                </button>
                <button
                  onClick={handleEditSave}
                  disabled={isUpdating || !editAr.trim() || !editEn.trim()}
                  className="px-4 py-2 rounded-md bg-primary-600 hover:bg-primary-700 text-white transition disabled:opacity-50"
                >
                  {isUpdating ? "جاري الحفظ..." : "حفظ"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* مودال الحذف */}
        {deletingCategory && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm text-center">
              <h2 className="text-lg font-semibold mb-4 text-gray-800">
                تأكيد الحذف
              </h2>
              <p className="mb-6 text-gray-700">
                هل أنت متأكد أنك تريد حذف التصنيف{" "}
                <span className="font-semibold">
                  {deletingCategory.name_ar}
                </span>
                ؟
              </p>
              <div className="flex justify-center gap-6">
                <button
                  onClick={closeDeleteModal}
                  disabled={isDeleting}
                  className="px-5 py-2 rounded-md bg-gray-200 hover:bg-gray-300 transition"
                >
                  إلغاء
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  disabled={isDeleting}
                  className="px-5 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white transition disabled:opacity-50"
                >
                  {isDeleting ? "جارٍ الحذف..." : "حذف"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* مودال الإضافة */}
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">
                إضافة تصنيف جديد
              </h2>
              <input
                type="text"
                placeholder="الاسم بالعربية"
                className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-md"
                value={newAr}
                onChange={(e) => setNewAr(e.target.value)}
                disabled={isAdding}
              />
              <input
                type="text"
                placeholder="الاسم بالإنجليزية"
                className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-md"
                value={newEn}
                onChange={(e) => setNewEn(e.target.value)}
                disabled={isAdding}
              />
              <div className="mt-6 flex justify-end gap-4">
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  disabled={isAdding}
                  className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 transition"
                >
                  إلغاء
                </button>
                <button
                  onClick={handleAddCategory}
                  disabled={isAdding || !newAr.trim() || !newEn.trim()}
                  className="px-4 py-2 rounded-md bg-primary-600 hover:bg-primary-700 text-white transition disabled:opacity-50"
                >
                  {isAdding ? "جاري الإضافة..." : "إضافة"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
