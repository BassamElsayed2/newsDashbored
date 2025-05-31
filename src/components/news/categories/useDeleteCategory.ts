import { useMutation, useQueryClient } from "@tanstack/react-query";

import toast from "react-hot-toast";
import supabase from "../../../../services/supabase";

export function useDeleteCategory() {
  const queryClient = useQueryClient();

  const { mutate: deleteCategory, isPending } = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("categories").delete().eq("id", id);

      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      toast.success("تم حذف التصنيف بنجاح");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: (error) => {
      toast.error("فشل في حذف التصنيف: " + error.message);
    },
  });

  return { deleteCategory, isPending };
}
