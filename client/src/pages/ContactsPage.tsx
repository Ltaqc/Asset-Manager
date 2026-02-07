import { SectionHeading } from "@/components/SectionHeading";
import { Phone, Mail, MapPin, Send, MessageCircle } from "lucide-react";

export default function ContactsPage() {
  return (
    <div className="min-h-screen">
      <section className="py-24 bg-secondary/20">
        <div className="container mx-auto px-4">
          <SectionHeading
            title="Контакты"
            subtitle="Свяжитесь с нами любым удобным способом"
          />
          <div className="max-w-4xl mx-auto grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex flex-col items-center text-center space-y-3 p-6">
              <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                <Phone className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-lg">Телефон</h3>
              <a href="tel:+78001234567" className="text-muted-foreground hover:text-primary transition-colors" data-testid="contact-phone">
                +7 (800) 123-45-67
              </a>
            </div>
            <div className="flex flex-col items-center text-center space-y-3 p-6">
              <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                <Mail className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-lg">Email</h3>
              <a href="mailto:info@almare.ru" className="text-muted-foreground hover:text-primary transition-colors" data-testid="contact-email">
                info@almare.ru
              </a>
            </div>
            <div className="flex flex-col items-center text-center space-y-3 p-6">
              <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                <Send className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-lg">Telegram</h3>
              <a href="https://t.me/almare" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors" data-testid="contact-telegram">
                @almare
              </a>
            </div>
            <div className="flex flex-col items-center text-center space-y-3 p-6">
              <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                <MapPin className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-lg">Адрес</h3>
              <p className="text-muted-foreground" data-testid="contact-address">Приморский бульвар, 1, Побережье</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
