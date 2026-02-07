import { SectionHeading } from "@/components/SectionHeading";
import { Button } from "@/components/ui/button";
import { Phone, Mail, MapPin, Navigation } from "lucide-react";

export default function ContactsPage() {
  return (
    <div className="min-h-screen">
      <section className="py-24 bg-blue-50/50">
        <div className="container mx-auto px-4">
          <SectionHeading
            title="Контакты"
            subtitle="Свяжитесь с нами любым удобным способом"
          />

          <div className="max-w-4xl mx-auto space-y-12">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary shrink-0">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-bold text-lg text-foreground">Адрес</h3>
                    <p className="text-muted-foreground leading-relaxed" data-testid="contact-address">
                      ст. Голубицкая, ул. Набережная, д. 7
                    </p>
                    <p className="text-muted-foreground leading-relaxed" data-testid="contact-address-2">
                      ст. Голубицкая, пер. Радужный, д. 2/1
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary shrink-0">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-bold text-lg text-foreground">Телефон</h3>
                    <a href="tel:+78001234567" className="text-muted-foreground hover:text-primary transition-colors text-base" data-testid="contact-phone">
                      +7 (800) 123-45-67
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary shrink-0">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-bold text-lg text-foreground">Email</h3>
                    <a href="mailto:info@almare.ru" className="text-muted-foreground hover:text-primary transition-colors text-base" data-testid="contact-email">
                      info@almare.ru
                    </a>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="rounded-2xl overflow-hidden shadow-lg border border-border/30">
                  <iframe
                    src="https://yandex.ru/map-widget/v1/?ll=37.2725,45.3365&z=16&pt=37.2725,45.3365,pm2rdm"
                    width="100%"
                    height="400"
                    style={{ border: 0, display: "block" }}
                    allowFullScreen
                    title="AL MARE на карте"
                    data-testid="contacts-map"
                  />
                </div>
                <a
                  href="https://yandex.ru/maps/?rtext=~ст.+Голубицкая,+ул.+Набережная,+д.+7"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <Button variant="outline" className="w-full" data-testid="button-route">
                    <Navigation className="w-4 h-4 mr-2" />
                    Построить маршрут
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
