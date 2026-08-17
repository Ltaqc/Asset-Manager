import { useEffect } from "react";
import { Link } from "wouter";
import { ChevronLeft } from "lucide-react";

export default function PrivacyPage() {
  useEffect(() => {
    document.title = "Политика обработки персональных данных — AL MARE";
    window.scrollTo(0, 0);
  }, []);

  const today = new Date().toLocaleDateString("ru-RU", { day: "2-digit", month: "long", year: "numeric" });

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-10 md:py-16 max-w-3xl">
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors mb-8">
          <ChevronLeft className="w-4 h-4" />
          На главную
        </Link>

        <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-2">
          Политика в отношении обработки персональных данных
        </h1>
        <p className="text-muted-foreground text-sm mb-10">Редакция от {today}</p>

        <div className="prose prose-sm max-w-none space-y-8 text-sm text-foreground leading-relaxed">

          <section>
            <h2 className="text-base font-semibold mb-3">1. Оператор персональных данных</h2>
            <p>
              Настоящая Политика определяет порядок обработки персональных данных оператором:
            </p>
            <p className="mt-2">
              <strong>Индивидуальный предприниматель Коноян Эдуард Георгиевич</strong><br />
              ИНН: 235500777991<br />
              ОГРНИП: 319237500088304<br />
              Адрес: Краснодарский край, Темрюкский район, ст-ца Голубицкая, ул. Набережная, д. 7<br />
              E-mail: <a href="mailto:hotelalmare.7@gmail.com" className="text-primary hover:underline">hotelalmare.7@gmail.com</a><br />
              Телефон: <a href="tel:+79186424912" className="text-primary hover:underline">+7 (918) 642-49-12</a>
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold mb-3">2. Категории обрабатываемых персональных данных</h2>
            <p>При использовании форм на сайте <strong>hotel-almare.ru</strong> обрабатываются следующие данные:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Имя (фамилия, имя или псевдоним) — для идентификации при бронировании;</li>
              <li>Номер телефона — для связи с целью подтверждения бронирования;</li>
              <li>Параметры бронирования: даты заезда/выезда, категория номера, состав гостей;</li>
              <li>Технические данные: IP-адрес, тип браузера, идентификаторы сессии, данные о действиях на сайте (в рамках аналитики, см. раздел 7).</li>
            </ul>
            <p className="mt-2 text-muted-foreground">
              Поля «Имя» и «Телефон» в формах бронирования являются необязательными. Электронная почта посетителей не собирается.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold mb-3">3. Цели обработки</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Обработка заявок на бронирование номеров и связь с гостем для подтверждения;</li>
              <li>Организация проживания и оказание гостиничных услуг;</li>
              <li>Анализ использования сайта в целях его улучшения (аналитические сервисы).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-semibold mb-3">4. Правовые основания</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Согласие субъекта персональных данных (ст. 6 Федерального закона № 152-ФЗ);</li>
              <li>Необходимость исполнения договора или намерение заключить договор на оказание гостиничных услуг;</li>
              <li>Законные интересы оператора в части улучшения качества сервиса (аналитика — при наличии согласия пользователя).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-semibold mb-3">5. Способы обработки</h2>
            <p>Обработка осуществляется с использованием средств автоматизации:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Сбор через формы на сайте;</li>
              <li>Хранение в базе данных на сервере (PostgreSQL);</li>
              <li>Передача менеджеру по электронной почте и через технические сервисы обмена сообщениями для обработки заявки.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-semibold mb-3">6. Хранение и удаление данных</h2>
            <p>
              Данные хранятся в течение срока, необходимого для выполнения заявки на бронирование, а также в течение срока, предусмотренного применимым законодательством. По запросу субъекта данные могут быть удалены или скорректированы. Для этого следует обратиться по e-mail: <a href="mailto:hotelalmare.7@gmail.com" className="text-primary hover:underline">hotelalmare.7@gmail.com</a>.
            </p>
            <p className="mt-2">
              Технические файлы cookie браузера удаляются в соответствии с политикой браузера пользователя или по запросу оператору.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold mb-3">7. Аналитические сервисы и файлы cookie</h2>
            <p>Сайт использует следующие сторонние аналитические инструменты:</p>

            <div className="mt-3 space-y-4">
              <div className="bg-secondary/30 rounded-lg p-4">
                <p className="font-medium">Яндекс Метрика</p>
                <p className="text-muted-foreground mt-1">Оператор: ООО «Яндекс», Россия. Счётчик ID: 107159929. Используется функция Вебвизор (запись действий пользователей). Данные передаются на серверы Яндекса. Политика Яндекса: <a href="https://yandex.ru/legal/confidential/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">yandex.ru/legal/confidential</a>.</p>
              </div>

              <div className="bg-secondary/30 rounded-lg p-4">
                <p className="font-medium">Яндекс Карты</p>
                <p className="text-muted-foreground mt-1">Встроенная карта для отображения местоположения отеля. При загрузке карты Яндекс может обрабатывать технические данные браузера.</p>
              </div>
            </div>

            <p className="mt-3 text-muted-foreground">
              Аналитические cookie инициализируются после вашего согласия с настоящей Политикой. Вы можете отозвать согласие в любой момент, обратившись к оператору.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold mb-3">8. Использование технических сервисов при обработке заявок</h2>
            <p>Для обработки заявок на бронирование Оператор использует технические сервисы, необходимые для получения и оперативной обработки обращений пользователей.</p>
            <p className="mt-2">При обработке заявки отдельные персональные данные пользователя, включая имя, номер телефона и параметры бронирования, могут обрабатываться с использованием сторонних сервисов обмена сообщениями и электронной почты исключительно для направления служебного уведомления ответственному сотруднику AL MARE.</p>
            <p className="mt-2">Полученные данные используются исключительно в целях обработки обращения пользователя и организации бронирования.</p>
            <p className="mt-2 text-muted-foreground">Оператор не осуществляет продажу персональных данных и их передачу третьим лицам для самостоятельных рекламных целей.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold mb-3">9. Права субъекта персональных данных</h2>
            <p>Вы имеете право:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>получить информацию об обработке ваших персональных данных;</li>
              <li>потребовать уточнения, блокировки или уничтожения ваших данных;</li>
              <li>отозвать согласие на обработку персональных данных;</li>
              <li>обжаловать действия оператора в Роскомнадзоре.</li>
            </ul>
            <p className="mt-2">Для реализации прав обращайтесь: <a href="mailto:hotelalmare.7@gmail.com" className="text-primary hover:underline">hotelalmare.7@gmail.com</a></p>
          </section>

          <section>
            <h2 className="text-base font-semibold mb-3">10. Контакты оператора</h2>
            <p>
              ИП Коноян Эдуард Георгиевич<br />
              E-mail: <a href="mailto:hotelalmare.7@gmail.com" className="text-primary hover:underline">hotelalmare.7@gmail.com</a><br />
              Телефон: <a href="tel:+79186424912" className="text-primary hover:underline">+7 (918) 642-49-12</a>
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}
