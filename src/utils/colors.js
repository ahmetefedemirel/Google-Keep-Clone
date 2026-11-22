export const DEFAULT_COLOR_ID = 'default';

export const NOTE_COLORS = [
  {
    id: 'default',
    label: 'Varsayılan',
    bgClass: 'bg-white',
    borderClass: 'border-slate-200',
    swatchClass: 'bg-white border-slate-300',
  },
  {
    id: 'coral',
    label: 'Mercan',
    bgClass: 'bg-rose-100',
    borderClass: 'border-rose-200',
    swatchClass: 'bg-rose-200 border-rose-300',
  },
  {
    id: 'peach',
    label: 'Şeftali',
    bgClass: 'bg-orange-100',
    borderClass: 'border-orange-200',
    swatchClass: 'bg-orange-200 border-orange-300',
  },
  {
    id: 'sand',
    label: 'Kum',
    bgClass: 'bg-amber-100',
    borderClass: 'border-amber-200',
    swatchClass: 'bg-amber-200 border-amber-300',
  },
  {
    id: 'mint',
    label: 'Nane',
    bgClass: 'bg-emerald-100',
    borderClass: 'border-emerald-200',
    swatchClass: 'bg-emerald-200 border-emerald-300',
  },
  {
    id: 'sky',
    label: 'Gökyüzü',
    bgClass: 'bg-sky-100',
    borderClass: 'border-sky-200',
    swatchClass: 'bg-sky-200 border-sky-300',
  },
];

const COLOR_MAP = Object.fromEntries(NOTE_COLORS.map((color) => [color.id, color]));

export function getNoteColor(colorId) {
  return COLOR_MAP[colorId] ?? COLOR_MAP[DEFAULT_COLOR_ID];
}
