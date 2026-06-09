/**
 * Переключатель вида товаров.
 * FRAMELESS = true  → вещи без рамок: прозрачные PNG (вырезанный фон) прямо на фоне страницы.
 * FRAMELESS = false → прежний вид: фото в карточке с подложкой (откат).
 *
 * Чтобы откатить к рамкам — поставь false и пересобери.
 */
export const FRAMELESS = true;

/** Путь к фото товара: вырезанная версия (/products/cut/...) либо оригинал. */
export function productImageSrc(image: string): string {
  return FRAMELESS ? image.replace("/products/", "/products/cut/") : image;
}
