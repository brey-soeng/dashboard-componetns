const sanitizeHTML = (htmlString, allowedTags = []) => {
  const expression =
    allowedTags.length > 0
      ? `<(?!((?:/s*)?(?:${allowedTags.join("|")})))([^>])+>`
      : "<[^>]*>";
  const regExp = new RegExp(expression, "g");
  return htmlString.replace(regExp, "");
};
const defaultTags = [
  "a",
  "b",
  "br",
  "strong",
  "i",
  "p",
  "em",
  "mark",
  "small",
  "del",
  "ins",
  "sub",
  "sup",
  "ul",
  "ol",
  "li",
  "table",
  "tbody",
  "thead",
  "tr",
  "th",
  "td",
];
const areTagsValid = (tags) =>
  Array.isArray(tags) && tags.every((tag) => typeof tag === "string");

export { defaultTags as allowedTags };

export const safeHtml = (tags) => {
  const initialTags = areTagsValid(tags) ? tags : defaultTags;
  return (el, binding) => {
    const directiveTags = Object.keys(binding.modifiers);
    const finalTags =
      areTagsValid(directiveTags) && directiveTags.length > 0
        ? directiveTags
        : initialTags;
    const sanitized = sanitizeHTML(binding.value, finalTags);
    el.innerHTML = sanitized;
  };
};
