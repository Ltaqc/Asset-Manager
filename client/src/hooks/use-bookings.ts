import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type InsertBooking } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";

export interface RoomBreakdownItem {
  category: string;
  shortTitle: string;
  capacity: number;
  maxToddlers: number;
  roomCost: number;
}

export interface BookingPayload extends InsertBooking {
  roomBreakdown?: RoomBreakdownItem[];
  discountAmount?: number;
  prepayment?: number;
}

export function useCreateBooking() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: BookingPayload) => {
      const { roomBreakdown, discountAmount, prepayment, ...bookingData } = data;
      const validated = api.bookings.create.input.parse(bookingData);

      const res = await fetch(api.bookings.create.path, {
        method: api.bookings.create.method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...validated, roomBreakdown, discountAmount, prepayment }),
      });

      if (!res.ok) {
        if (res.status === 400) {
          const error = await res.json();
          throw new Error(error.message || "Ошибка валидации");
        }
        throw new Error('Не удалось отправить заявку');
      }

      return api.bookings.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      toast({
        title: "Заявка отправлена",
        description: "Мы получили ваш расчёт и свяжемся с вами в ближайшее время.",
      });
    },
    onError: (error) => {
      toast({
        title: "Ошибка",
        description: error.message,
        variant: "destructive",
      });
    }
  });
}
