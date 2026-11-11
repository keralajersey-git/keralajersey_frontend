// Single source of truth for product categories.
// Values here MUST match the strings stored in the database `products.category`
// column (matched case-sensitively by the backend).

export const CATEGORIES = [
  {
    id: "top-quality",
    label: "Top Quality",
    description: "Premium player & fan versions",
    hasSubCategories: true,
  },
  {
    id: "standard-quality",
    label: "Standard Quality",
    description: "Regular quality jerseys",
    hasSubCategories: false,
  },
  {
    id: "jackets",
    label: "Jackets",
    description: "Windbreakers & track jackets",
    hasSubCategories: false,
  },
];

// Sub-categories only apply to "top-quality".
export const SUB_CATEGORIES = [
  { id: null, label: "All Top Quality" },
  { id: "first quality", label: "First Quality" },
  { id: "master quality", label: "Master Quality" },
  { id: "player version", label: "Player Version" },
  { id: "authentic retro", label: "Authentic Retro" },
];

export const DEFAULT_CATEGORY = "top-quality";

// Categories that carry sub-categories, so forms can reset sub_category.
export const supportsSubCategories = (categoryId) =>
  CATEGORIES.some((c) => c.id === categoryId && c.hasSubCategories);

export const categoryLabel = (categoryId) =>
  CATEGORIES.find((c) => c.id === categoryId)?.label ?? null;
