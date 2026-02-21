export function HelpPage() {
  return (
    <div className="p-6 max-w-2xl">
      <h1 className="text-xl font-semibold text-slate-900 mb-4">Помощь / FAQ</h1>

      <section className="mb-6">
        <h2 className="text-lg font-medium text-slate-800 mb-2">Правила обезличивания</h2>
        <p className="text-sm text-slate-600 mb-2">
          Вводите только медицинские параметры. Не указывайте:
        </p>
        <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
          <li>ФИО пациента или врача</li>
          <li>Телефон, email, адрес</li>
          <li>Дату рождения, номер полиса/паспорта/СНИЛС</li>
          <li>Любые данные, по которым можно идентифицировать человека</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-lg font-medium text-slate-800 mb-2">Примеры корректного ввода</h2>
        <ul className="text-sm text-slate-600 space-y-2">
          <li><strong>Локализация:</strong> «Верхняя доля правого лёгкого», «Толстая кишка»</li>
          <li><strong>Морфология:</strong> «Аденокарцинома», «Плоскоклеточный рак»</li>
          <li><strong>Комментарий к отклонению:</strong> «Клиническое решение в связи с коморбидностью ХСН» (без имён и дат)</li>
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-medium text-slate-800 mb-2">Что не вводить</h2>
        <p className="text-sm text-slate-600">
          «Пациент Иванов И.И.», «звонок от 20.02.2024», «проживает по адресу…», «полис 1234567890123456» — такие фразы блокируются проверкой на ПД.
        </p>
      </section>
    </div>
  );
}
