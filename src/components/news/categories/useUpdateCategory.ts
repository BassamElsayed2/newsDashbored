import { useMutation, useQueryClient } from "@tanstack/react-query";

import toast from "react-hot-toast";
import supabase from "../../../../services/supabase";

interface UpdateCategoryPayload {
  id: string;
  name_ar: string;
  name_en: string;
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();

  const { mutate: updateCategory, isPending } = useMutation({
    mutationFn: async ({ id, name_ar, name_en }: UpdateCategoryPayload) => {
      const { error } = await supabase
        .from("categories")
        .update({ name_ar, name_en })
        .eq("id", id);

      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      toast.success("تم تحديث التصنيف بنجاح");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: (error) => {
      toast.error("فشل في تحديث التصنيف: " + error.message);
    },
  });

  return { updateCategory, isPending };
}
