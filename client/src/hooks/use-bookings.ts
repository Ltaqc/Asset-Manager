import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type InsertBooking } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";

export function useCreateBooking() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: InsertBooking) => {
      // For runtime validation on client before sending
      const validated = api.bookings.create.input.parse(data);
      
      const res = await fetch(api.bookings.create.path, {
        method: api.bookings.create.method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validated),
      });

      if (!res.ok) {
        if (res.status === 400) {
          const error = await res.json();
          throw new Error(error.message || "Validation failed");
        }
        throw new Error('Failed to create booking request');
      }

      return api.bookings.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      toast({
        title: "Request Sent",
        description: "We have received your calculation. We will contact you shortly.",
      });
      // In a real app, we might invalidate a list of bookings here
      // queryClient.invalidateQueries({ queryKey: [api.bookings.list.path] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  });
}
