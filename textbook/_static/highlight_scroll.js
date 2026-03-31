// highlight.js
export async function highlightFromQuery(containerSelector = 'main#main-content') {
  const url = new URL(window.location.href);
  const highlightText = url.searchParams.get('semantic-highlight');
  const anchorId = url.hash ? url.hash.substring(1) : null;

  if (!highlightText) return; // nothing to do

  // Dynamically import mark.js only if needed
  const { default: Mark } = await import('mark.js');

  const mainContent = document.querySelector(containerSelector);
  if (!mainContent) {
    console.error("Main content section not found.");
    return;
  }

  // Determine starting elements (after anchor if present)
  let scopeElements = Array.from(
    mainContent.querySelectorAll('p, tr, h1, h2, h3, h4, h5, h6')
  );

  if (anchorId) {
    const anchorElement = document.getElementById(anchorId);
    if (anchorElement) {
      const parentHeading = anchorElement.closest('h1,h2,h3,h4,h5,h6');
      if (parentHeading) {
        const index = scopeElements.indexOf(parentHeading);
        if (index >= 0) scopeElements = scopeElements.slice(index + 1);
      }
    } else {
      console.warn(`Anchor with id "${anchorId}" not found. Searching from start.`);
    }
  }

  // Temporary container for mark.js highlighting
  const tempContainer = document.createElement('div');
  scopeElements.forEach(el => tempContainer.appendChild(el.cloneNode(true)));

  const markInstance = new Mark(tempContainer);
  markInstance.mark(highlightText, {
    separateWordSearch: false,
    accuracy: "partially",
    done: () => {
      const firstMatch = findFirstMatch(scopeElements, highlightText);
      if (firstMatch) {
        firstMatch.classList.add('highlight');
        firstMatch.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        console.error("Text not found in document.");
      }
    }
  });
}

function findFirstMatch(elements, searchText) {
  const normalizedSearch = normalizeText(searchText);
  return elements.find(el => normalizeText(el.textContent).includes(normalizedSearch)) || null;
}

function normalizeText(text) {
  return text.replace(/\s+/g, ' ').trim().toLowerCase();
}
