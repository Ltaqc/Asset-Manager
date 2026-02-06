import { Calculator } from "@/components/Calculator";
import { SectionHeading } from "@/components/SectionHeading";
import { RoomCard } from "@/components/RoomCard";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { MapPin, Phone, Waves, Utensils, Sun, Umbrella, Users } from "lucide-react";

export default function Home() {
  const scrollToCalculator = () => {
    document.getElementById("calculator")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-lg border-b border-white/20 shadow-sm">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <span className="text-2xl font-display font-bold text-primary tracking-tight">
            AL MARE
          </span>
          <Button variant="ghost" onClick={scrollToCalculator} className="text-primary hover:text-primary/80 font-semibold">
            Book Now
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background - using a solid color gradient since we don't have stock photos yet, but styled to look marine */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50 to-white -z-20" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1437719417032-8595fd9e9dc6?q=80&w=2574&auto=format&fit=crop')] bg-cover bg-center -z-10 opacity-30" />
        
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-white to-transparent opacity-80 z-0" />

        <div className="container px-4 text-center z-10 space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-display font-bold text-primary mb-4 text-shadow-lg">
              AL MARE
            </h1>
            <p className="text-xl md:text-2xl lg:text-3xl text-foreground/80 font-light tracking-widest uppercase">
              Ultra All Inclusive Resort
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Button 
              onClick={scrollToCalculator}
              size="lg"
              className="text-lg px-10 py-8 rounded-full bg-primary hover:bg-primary/90 text-white shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
            >
              Calculate Your Stay
            </Button>
          </motion.div>
        </div>
        
        {/* Wave decoration bottom */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none rotate-180">
          <svg className="relative block w-[calc(100%+1.3px)] h-[100px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z" className="fill-white"></path>
          </svg>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow bg-white">
        
        {/* Calculator Section */}
        <section className="py-24 container mx-auto px-4 relative z-10 -mt-20">
          <Calculator />
        </section>

        {/* Rooms Section */}
        <section className="py-24 bg-secondary/30">
          <div className="container mx-auto px-4">
            <SectionHeading 
              title="Accommodations" 
              subtitle="Elegance and comfort in every detail. Choose from our wide range of rooms and suites designed for your relaxation."
            />
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { 
                  title: "Standard (Double)", 
                  cap: 2, 
                  desc: "Cozy room with balcony, perfect for couples. Modern amenities and garden views.",
                  img: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800&auto=format&fit=crop"
                },
                { 
                  title: "Standard Family", 
                  cap: 3, 
                  desc: "Spacious room with balcony tailored for small families. Comfortable bedding and play area.",
                  img: "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800&auto=format&fit=crop"
                },
                { 
                  title: "Junior Suite", 
                  cap: 4, 
                  desc: "Luxury suite with extended living area and private balcony. Premium finishes throughout.",
                  img: "https://images.unsplash.com/photo-1590490360182-f33efe80a713?w=800&auto=format&fit=crop"
                },
                { 
                  title: "Apartments Pool View", 
                  cap: 6, 
                  desc: "Expansive apartments on the 2nd floor with stunning views of the pool complex.",
                  img: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&auto=format&fit=crop"
                }
              ].map((room, i) => (
                <RoomCard 
                  key={i}
                  title={room.title}
                  capacity={room.cap}
                  description={room.desc}
                  image={room.img}
                />
              ))}
            </div>
            
            <div className="text-center mt-12">
              <p className="text-muted-foreground italic">
                * All room categories include Ultra All Inclusive service
              </p>
            </div>
          </div>
        </section>

        {/* Food Section */}
        <section className="py-24 relative overflow-hidden text-white">
          <div className="absolute inset-0 bg-primary -z-20" />
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1559339352-11d035aa65de?w=1600&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-overlay -z-10" />
          
          <div className="container mx-auto px-4">
            <SectionHeading 
              title="Ultra All Inclusive" 
              subtitle="A culinary journey without limits. Experience exquisite flavors from around the world."
              light
            />

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/20 hover:bg-white/15 transition-colors">
                <Utensils className="w-12 h-12 mb-6 text-secondary" />
                <h3 className="text-2xl font-display font-bold mb-4">Gourmet Dining</h3>
                <p className="text-white/80 leading-relaxed">
                  Unlimited access to our main buffet and 3 a la carte restaurants. Fresh seafood, local specialties, and international classics.
                </p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/20 hover:bg-white/15 transition-colors">
                <div className="w-12 h-12 mb-6 text-secondary flex items-center justify-center font-bold text-2xl border-2 border-secondary rounded-full">24</div>
                <h3 className="text-2xl font-display font-bold mb-4">24/7 Service</h3>
                <p className="text-white/80 leading-relaxed">
                  Round-the-clock room service and lobby bar. Snacks, premium beverages, and cocktails available whenever you desire.
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/20 hover:bg-white/15 transition-colors">
                <Waves className="w-12 h-12 mb-6 text-secondary" />
                <h3 className="text-2xl font-display font-bold mb-4">Beach & Pool Bars</h3>
                <p className="text-white/80 leading-relaxed">
                  Refresh yourself without leaving the water. Our swim-up bars and beach service ensure you're always hydrated in style.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Infrastructure */}
        <section className="py-24 container mx-auto px-4">
          <SectionHeading title="Amenities & Infrastructure" />
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {[
              { icon: Waves, label: "5 Swimming Pools" },
              { icon: Umbrella, label: "Private Beach" },
              { icon: Sun, label: "Spa & Wellness" },
              { icon: Users, label: "Kids Club" },
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center text-center space-y-4 p-6 rounded-2xl hover:bg-secondary/50 transition-colors">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                  <item.icon className="w-8 h-8" />
                </div>
                <span className="font-bold text-lg">{item.label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Gallery */}
        <section className="py-2 bg-black">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-1">
            {[
              "https://images.unsplash.com/photo-1571896349842-68c2531b26f5?w=600&h=600&fit=crop",
              "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&h=600&fit=crop",
              "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=600&h=600&fit=crop",
              "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=600&h=600&fit=crop"
            ].map((src, i) => (
              <div key={i} className="aspect-square relative group overflow-hidden">
                <img 
                  src={src} 
                  alt="Gallery" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100"
                />
              </div>
            ))}
          </div>
        </section>

        {/* Footer / Contacts */}
        <footer className="bg-slate-900 text-white py-16">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h2 className="text-4xl font-display font-bold text-primary">AL MARE</h2>
                <p className="text-slate-400 max-w-md">
                  Experience the ultimate luxury at our Ultra All Inclusive resort. 
                  Where the sky meets the sea, your perfect vacation begins.
                </p>
                
                <div className="space-y-4 pt-4">
                  <div className="flex items-center gap-4 text-slate-300">
                    <MapPin className="text-primary w-5 h-5" />
                    <span>123 Coastal Highway, Seaside Paradise</span>
                  </div>
                  <div className="flex items-center gap-4 text-slate-300">
                    <Phone className="text-primary w-5 h-5" />
                    <span>+1 (555) 123-4567</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/5 p-8 rounded-2xl border border-white/10">
                <h3 className="text-xl font-bold mb-4">Quick Links</h3>
                <div className="grid grid-cols-2 gap-4 text-slate-400">
                  <a href="#" className="hover:text-primary transition-colors">Home</a>
                  <a href="#" className="hover:text-primary transition-colors">Rooms</a>
                  <a href="#" className="hover:text-primary transition-colors">Dining</a>
                  <a href="#" className="hover:text-primary transition-colors">Wellness</a>
                  <a href="#" className="hover:text-primary transition-colors">Events</a>
                  <a href="#" className="hover:text-primary transition-colors">Contact</a>
                </div>
              </div>
            </div>
            
            <div className="border-t border-white/10 mt-12 pt-8 text-center text-slate-500 text-sm">
              © {new Date().getFullYear()} Al Mare Resort. All rights reserved.
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
