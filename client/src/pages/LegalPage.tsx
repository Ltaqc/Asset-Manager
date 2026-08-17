import { useEffect } from "react";
import { Link } from "wouter";
import { ExternalLink, ChevronLeft } from "lucide-react";

export default function LegalPage() {
  useEffect(() => {
    document.title = "Правовая информация — AL MARE";
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-10 md:py-16 max-w-3xl">
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors mb-8">
          <ChevronLeft className="w-4 h-4" />
          На главную
        </Link>

        <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-2">
          Правовая информация
        </h1>
        <p className="text-muted-foreground text-sm mb-10">Сведения об организации, оказывающей услуги размещения</p>

        <div className="space-y-8">

          {/* Operator */}
          <section>
            <h2 className="text-base font-semibold text-foreground mb-4 pb-2 border-b border-border">
              Исполнитель услуг
            </h2>
            <dl className="space-y-3 text-sm">
              <div className="flex flex-col sm:flex-row sm:gap-6">
                <dt className="text-muted-foreground sm:w-56 shrink-0">Полное наименование</dt>
                <dd className="text-foreground font-medium">Индивидуальный предприниматель Коноян Эдуард Георгиевич</dd>
              </div>
              <div className="flex flex-col sm:flex-row sm:gap-6">
                <dt className="text-muted-foreground sm:w-56 shrink-0">Сокращённое наименование</dt>
                <dd className="text-foreground">ИП Коноян Э.Г.</dd>
              </div>
              <div className="flex flex-col sm:flex-row sm:gap-6">
                <dt className="text-muted-foreground sm:w-56 shrink-0">ИНН</dt>
                <dd className="text-foreground">235500777991</dd>
              </div>
              <div className="flex flex-col sm:flex-row sm:gap-6">
                <dt className="text-muted-foreground sm:w-56 shrink-0">ОГРНИП</dt>
                <dd className="text-foreground">319237500088304</dd>
              </div>
              <div className="flex flex-col sm:flex-row sm:gap-6">
                <dt className="text-muted-foreground sm:w-56 shrink-0">Дата регистрации</dt>
                <dd className="text-foreground">14.03.2019</dd>
              </div>
              <div className="flex flex-col sm:flex-row sm:gap-6">
                <dt className="text-muted-foreground sm:w-56 shrink-0">Адрес регистрации</dt>
                <dd className="text-foreground">Краснодарский край, г. Новороссийск, ул. Данини, д. 4</dd>
              </div>
              <div className="flex flex-col sm:flex-row sm:gap-6">
                <dt className="text-muted-foreground sm:w-56 shrink-0">Адрес осуществления деятельности</dt>
                <dd className="text-foreground">Краснодарский край, Темрюкский район, ст-ца Голубицкая, ул. Набережная, д. 7</dd>
              </div>
              <div className="flex flex-col sm:flex-row sm:gap-6">
                <dt className="text-muted-foreground sm:w-56 shrink-0">E-mail</dt>
                <dd className="text-foreground">
                  <a href="mailto:hotelalmare.7@gmail.com" className="text-primary hover:underline">hotelalmare.7@gmail.com</a>
                </dd>
              </div>
              <div className="flex flex-col sm:flex-row sm:gap-6">
                <dt className="text-muted-foreground sm:w-56 shrink-0">Телефон</dt>
                <dd className="text-foreground">
                  <a href="tel:+79186424912" className="text-primary hover:underline">+7 (918) 642-49-12</a>
                </dd>
              </div>
            </dl>
          </section>

          {/* Registry */}
          <section>
            <h2 className="text-base font-semibold text-foreground mb-4 pb-2 border-b border-border">
              Реестр классифицированных средств размещения
            </h2>
            <dl className="space-y-3 text-sm">
              <div className="flex flex-col sm:flex-row sm:gap-6">
                <dt className="text-muted-foreground sm:w-56 shrink-0">Реестровый номер</dt>
                <dd className="text-foreground font-medium">С232024013948</dd>
              </div>
              <div className="flex flex-col sm:flex-row sm:gap-6">
                <dt className="text-muted-foreground sm:w-56 shrink-0">Запись в реестре</dt>
                <dd>
                  <a
                    href="https://tourism.fsa.gov.ru/ru/resorts/hotels/9cc7ea7f-c608-11ef-92da-cd8fd626ea73/about-resort"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-primary hover:underline"
                  >
                    Единый реестр классифицированных средств размещения
                    <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                  </a>
                </dd>
              </div>
            </dl>
          </section>

          {/* Payment */}
          <section>
            <h2 className="text-base font-semibold text-foreground mb-4 pb-2 border-b border-border">
              Порядок оплаты
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Оплата непосредственно на сайте не осуществляется. Бронирование, окончательная стоимость и порядок оплаты подтверждаются менеджером после обращения гостя.
            </p>
          </section>

          {/* Legal docs */}
          <section>
            <h2 className="text-base font-semibold text-foreground mb-4 pb-2 border-b border-border">
              Документы
            </h2>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/privacy" className="text-primary hover:underline">Политика в отношении обработки персональных данных</Link>
              </li>
              <li>
                <Link href="/booking-rules" className="text-primary hover:underline">Правила бронирования, оплаты, отмены и возврата</Link>
              </li>
            </ul>
          </section>

        </div>
      </div>
    </div>
  );
}
