export const schedules = ["6:00am a 7:00am", "7:00am a 8:00am", "6:00pm a 7:00pm", "7:00pm a 8:00pm"];
export const paymentMethods = ["Cash", "Card", "Transfer"];

const optionLabels = new Map([
  ["male", "Masculino"],
  ["female", "Femenino"],
  ["trainer", "Entrenador"],
  ["personal", "Personal"],
  ["cash", "Efectivo"],
  ["card", "Tarjeta"],
  ["transfer", "Transferencia"],
]);

export function memberOptionLabel(value: string) {
  return optionLabels.get(value.toLowerCase()) ?? value;
}

export function memberOptions(values: string[], current?: string) {
  const options = new Map(values.map((value) => [memberOptionLabel(value).toLowerCase(), value]));
  if (current) options.set(memberOptionLabel(current).toLowerCase(), current);
  return [...options.values()];
}
