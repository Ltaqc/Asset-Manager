import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { roomCategories, months } from "@shared/schema";
import { useCreateBooking } from "@/hooks/use-bookings";
import { Loader2, Calculator as CalcIcon } from "lucide-react";

// Types derived from implementation notes
type Month = typeof months[number];
type RoomCategory = typeof roomCategories[number];

interface PricingData {
  cap: number;
  prices: Record<Lowercase<Month>, number>;
}

const ROOM_DATA: Record<RoomCategory, PricingData> = {
  "Standard (Double, Balcony)": { cap: 2, prices: { june: 4600, july: 5700, august: 5700, september: 4600 } },
  "Standard (Sliding Double, Balcony)": { cap: 2, prices: { june: 4600, july: 5700, august: 5700, september: 4600 } },
  "Standard Family (Balcony)": { cap: 3, prices: { june: 7000, july: 8700, august: 8700, september: 7000 } },
  "Junior Suite (Balcony)": { cap: 4, prices: { june: 9200, july: 11500, august: 11500, september: 9200 } },
  "Suite 2-room (No Balcony)": { cap: 4, prices: { june: 9200, july: 11500, august: 11500, september: 9200 } },
  "Suite Family 2-room": { cap: 5, prices: { june: 11500, july: 14500, august: 14500, september: 11500 } },
  "Apartments 1st floor (Pool access)": { cap: 6, prices: { june: 14000, july: 17500, august: 17500, september: 14000 } },
  "Apartments 2nd floor (Pool view)": { cap: 6, prices: { june: 14000, july: 17500, august: 17500, september: 14000 } },
};

const FOOD_RATES = {
  adult: 4500,
  teen: 4500,
  child: 3000,
  toddler: 0,
};

// Form Schema
const calcSchema = z.object({
  roomCategory: z.enum(roomCategories),
  month: z.enum(months),
  nights: z.coerce.number().min(1).max(30),
  adults: z.coerce.number().min(1),
  teens: z.coerce.number().min(0),
  children: z.coerce.number().min(0),
  toddlers: z.coerce.number().min(0),
  contactName: z.string().optional(),
  contactPhone: z.string().optional(),
});

type FormValues = z.infer<typeof calcSchema>;

export function Calculator() {
  const [result, setResult] = useState<{
    roomCost: number;
    foodCost: number;
    total: number;
    perNight: number;
  } | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(calcSchema),
    defaultValues: {
      nights: 5,
      adults: 2,
      teens: 0,
      children: 0,
      toddlers: 0,
      month: "July",
      roomCategory: "Standard (Double, Balcony)"
    },
    mode: "onChange"
  });

  const { watch } = form;
  const values = watch();
  const createBooking = useCreateBooking();

  // Real-time calculation
  useEffect(() => {
    const { roomCategory, month, nights, adults, teens, children } = values;
    
    if (!roomCategory || !month || !nights || nights < 1) return;

    const monthKey = month.toLowerCase() as Lowercase<Month>;
    const roomPrice = ROOM_DATA[roomCategory].prices[monthKey];
    const roomCost = roomPrice * nights;
    
    const foodPerNight = (adults * FOOD_RATES.adult) + (teens * FOOD_RATES.teen) + (children * FOOD_RATES.child);
    const foodCost = foodPerNight * nights;
    
    const total = roomCost + foodCost;
    const perNight = total / nights;

    setResult({ roomCost, foodCost, total, perNight });
  }, [values]);

  const onSubmit = (data: FormValues) => {
    if (!result) return;
    
    createBooking.mutate({
      ...data,
      totalPrice: result.total,
    });
  };

  return (
    <div id="calculator" className="bg-white rounded-3xl shadow-xl overflow-hidden border border-border/50">
      <div className="bg-primary/5 p-6 md:p-8 border-b border-primary/10">
        <h3 className="text-2xl md:text-3xl font-display font-semibold text-primary mb-2 flex items-center gap-3">
          <CalcIcon className="w-6 h-6 md:w-8 md:h-8" />
          Vacation Calculator
        </h3>
        <p className="text-muted-foreground">Plan your perfect stay at Al Mare. Get an instant estimate.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-0">
        {/* Form Section */}
        <div className="p-6 md:p-8 space-y-6">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Room Category</Label>
                <Select 
                  onValueChange={(val) => form.setValue("roomCategory", val as RoomCategory)}
                  defaultValue={values.roomCategory}
                >
                  <SelectTrigger className="h-12 bg-secondary/30 border-primary/20 focus:ring-primary/20">
                    <SelectValue placeholder="Select a room" />
                  </SelectTrigger>
                  <SelectContent>
                    {roomCategories.map((room) => (
                      <SelectItem key={room} value={room}>{room}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Month</Label>
                  <Select 
                    onValueChange={(val) => form.setValue("month", val as Month)}
                    defaultValue={values.month}
                  >
                    <SelectTrigger className="h-12 bg-secondary/30 border-primary/20 focus:ring-primary/20">
                      <SelectValue placeholder="Month" />
                    </SelectTrigger>
                    <SelectContent>
                      {months.map((m) => (
                        <SelectItem key={m} value={m}>{m}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Nights</Label>
                  <Input 
                    type="number" 
                    min={1} 
                    className="h-12 bg-secondary/30 border-primary/20 focus:ring-primary/20"
                    {...form.register("nights")} 
                  />
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <Label className="text-primary font-semibold">Guests</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">Adults (18+)</Label>
                    <Input type="number" min={1} className="bg-secondary/30" {...form.register("adults")} />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">Teens (13-18)</Label>
                    <Input type="number" min={0} className="bg-secondary/30" {...form.register("teens")} />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">Children (2-13)</Label>
                    <Input type="number" min={0} className="bg-secondary/30" {...form.register("children")} />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">Toddlers (0-2)</Label>
                    <Input type="number" min={0} className="bg-secondary/30" {...form.register("toddlers")} />
                  </div>
                </div>
              </div>

              {/* Optional Contact fields for submission */}
              <div className="pt-4 border-t border-dashed border-border/60">
                <p className="text-sm text-muted-foreground mb-4">Want to book? Enter details below (optional).</p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Your Name</Label>
                    <Input placeholder="John Doe" className="bg-secondary/30" {...form.register("contactName")} />
                  </div>
                  <div className="space-y-2">
                    <Label>Phone Number</Label>
                    <Input placeholder="+1 234 567 890" className="bg-secondary/30" {...form.register("contactPhone")} />
                  </div>
                </div>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full h-14 text-lg font-bold bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 rounded-xl mt-4"
              disabled={createBooking.isPending}
            >
              {createBooking.isPending ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Sending Request...
                </>
              ) : (
                "Request Booking"
              )}
            </Button>
          </form>
        </div>

        {/* Result Section */}
        <div className="bg-primary text-primary-foreground p-6 md:p-8 flex flex-col justify-center">
          <div className="space-y-8">
            <h4 className="text-2xl font-display text-primary-foreground/90 border-b border-primary-foreground/20 pb-4">
              Estimated Breakdown
            </h4>
            
            {result ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-primary-foreground/80 text-lg">
                    <span>Room Cost ({values.nights} nights)</span>
                    <span className="font-mono font-bold">{result.roomCost.toLocaleString()} USD</span>
                  </div>
                  <div className="flex justify-between items-center text-primary-foreground/80 text-lg">
                    <span>Food & Service (Ultra All Inc.)</span>
                    <span className="font-mono font-bold">{result.foodCost.toLocaleString()} USD</span>
                  </div>
                </div>

                <div className="h-px bg-primary-foreground/20 my-6" />

                <div className="flex justify-between items-end">
                  <span className="text-xl font-medium text-primary-foreground/90">Total Estimate</span>
                  <div className="text-right">
                    <div className="text-4xl md:text-5xl font-bold font-display tracking-tight">
                      {result.total.toLocaleString()} <span className="text-2xl">USD</span>
                    </div>
                    <div className="text-sm text-primary-foreground/60 mt-1">
                      approx. {Math.round(result.perNight).toLocaleString()} USD per night
                    </div>
                  </div>
                </div>
                
                <p className="text-xs text-primary-foreground/50 mt-8 leading-relaxed">
                  * This calculation is an estimate based on current rates. Final price may vary depending on availability and special offers. Submit your request to lock in this price.
                </p>
              </motion.div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-primary-foreground/50 py-12">
                <CalcIcon className="w-16 h-16 mb-4 opacity-50" />
                <p className="text-lg">Enter your trip details to see pricing</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
