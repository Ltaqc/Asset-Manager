import { useEffect } from "react";
import { Link } from "wouter";
import { ChevronLeft } from "lucide-react";

export default function BookingRulesPage() {
  useEffect(() => {
    document.title = "Правила бронирования — AL MARE";
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
          Правила бронирования, оплаты, отмены и возврата
        </h1>
        <p className="text-muted-foreground text-sm mb-10">
          Услуги размещения оказывает: ИП Коноян Эдуард Георгиевич, ОГРНИП 319237500088304
        </p>

        <div className="space-y-8 text-sm text-foreground leading-relaxed">

          <section>
            <h2 className="text-base font-semibold mb-3 pb-2 border-b border-border">1. Порядок бронирования</h2>
            <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
              <li>Бронирование осуществляется через форму на сайте или по телефону.</li>
              <li>Заявка считается принятой после подтверждения менеджером отеля в телефонном разговоре или сообщении.</li>
              <li>Калькулятор на сайте рассчитывает предварительную стоимость. Окончательная стоимость и наличие номеров подтверждаются менеджером.</li>
              <li>Бронирование действительно на сезон: с 1 июля по 21 августа включительно.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-semibold mb-3 pb-2 border-b border-border">2. Оплата</h2>
            <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
              <li>Оплата непосредственно на сайте не осуществляется.</li>
              <li>Порядок, форма и сроки оплаты подтверждаются менеджером при оформлении бронирования.</li>
              <li>В качестве предоплаты рассчитывается стоимость одной ночи проживания — сумма указывается в подтверждении от менеджера.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-semibold mb-3 pb-2 border-b border-border">3. Отмена и возврат</h2>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-amber-800 mb-3">
              <p className="font-medium mb-1">⚠ Условия уточняются у менеджера</p>
              <p>Конкретные условия отмены бронирования, сроки уведомления и порядок возврата предоплаты согласовываются индивидуально при подтверждении бронирования. Данный раздел будет дополнен после официального утверждения условий.</p>
            </div>
            <p className="text-muted-foreground">
              Для уточнения условий обращайтесь к менеджеру отеля по телефону <a href="tel:+79184710374" className="text-primary hover:underline">+7 (918) 471-03-74</a> или по e-mail <a href="mailto:almare@hotelalmare.ru" className="text-primary hover:underline">almare@hotelalmare.ru</a>.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold mb-3 pb-2 border-b border-border">4. Заезд и выезд</h2>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-amber-800">
              <p className="font-medium mb-1">⚠ Уточняется у менеджера</p>
              <p>Время заезда и выезда согласовывается при подтверждении бронирования. Конкретные условия на сайте не зафиксированы.</p>
            </div>
          </section>

          <section>
            <h2 className="text-base font-semibold mb-3 pb-2 border-b border-border">5. Состав гостей</h2>
            <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
              <li>Вместимость каждого типа номера указана на странице «Номера».</li>
              <li>Дети до 2 лет (малыши) размещаются в отдельной категории; ограничения по их количеству зависят от типа номера.</li>
              <li>Состав гостей, указанный при бронировании, фиксируется в заявке и уточняется менеджером.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-semibold mb-3 pb-2 border-b border-border">6. Пакет Ultra All Inclusive</h2>
            <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
              <li>Стоимость проживания включает питание, пляж, напитки и развлекательные программы в соответствии с описанием на сайте.</li>
              <li>Перечень включённых услуг может быть уточнён у менеджера.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-semibold mb-3 pb-2 border-b border-border">7. Контакты</h2>
            <p className="text-muted-foreground">
              ИП Коноян Эдуард Георгиевич<br />
              Телефон: <a href="tel:+79184710374" className="text-primary hover:underline">+7 (918) 471-03-74</a><br />
              E-mail: <a href="mailto:almare@hotelalmare.ru" className="text-primary hover:underline">almare@hotelalmare.ru</a>
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}
