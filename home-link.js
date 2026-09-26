document.querySelectorAll("[data-home-link]").forEach((link) => {
  link.addEventListener("click", (event) => {
    if (window.location.protocol === "file:") {
      return;
    }

    event.preventDefault();
    window.location.href = link.dataset.cleanHref || "./";
  });
});

const applyEnglishTypography = (root) => {
  const shortWords = /(^|[\s(])((?:a|an|the|and|or|but|as|at|by|for|from|in|of|on|per|to|via|with))[ \t\r\n]+(?=[A-Za-z0-9])/gi;
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const parent = node.parentElement;

      if (!parent || parent.closest("script, style, code, pre, [data-no-typography]")) {
        return NodeFilter.FILTER_REJECT;
      }

      return /\s/.test(node.nodeValue) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
    },
  });
  const textNodes = [];

  while (walker.nextNode()) {
    textNodes.push(walker.currentNode);
  }

  textNodes.forEach((node) => {
    let formattedText = node.nodeValue;

    for (let pass = 0; pass < 4; pass += 1) {
      const nextText = formattedText.replace(shortWords, "$1$2\u00a0");

      if (nextText === formattedText) {
        break;
      }

      formattedText = nextText;
    }

    node.nodeValue = formattedText;
  });
};

if (document.documentElement.lang === "en") {
  document.querySelectorAll(".case-page").forEach(applyEnglishTypography);
}

const typewriter = document.querySelector("[data-typewriter]");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (typewriter && !prefersReducedMotion) {
  const text = typewriter.dataset.typewriter || typewriter.textContent;
  let index = 0;
  typewriter.textContent = "";
  typewriter.classList.add("is-typing");

  const type = () => {
    typewriter.textContent = text.slice(0, index);
    index += 1;

    if (index <= text.length) {
      window.setTimeout(type, 34);
    } else {
      window.setTimeout(() => {
        typewriter.classList.remove("is-typing");
      }, 600);
    }
  };

  type();
}
