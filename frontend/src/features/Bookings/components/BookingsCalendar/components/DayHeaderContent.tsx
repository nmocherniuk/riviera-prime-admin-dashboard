type DayHeaderContentProps = {
  date: Date;
  isToday: boolean;
};

export function DayHeaderContent({ date, isToday }: DayHeaderContentProps) {
  const weekday = date
    .toLocaleDateString("fr-FR", { weekday: "short" })
    .toUpperCase();
  const dayNum = date.getDate();
  return (
    <>
      <span className="fc-day-header-weekday" data-today={isToday}>
        {weekday}
      </span>
      <span className="fc-day-header-day">{dayNum}</span>
    </>
  );
}
