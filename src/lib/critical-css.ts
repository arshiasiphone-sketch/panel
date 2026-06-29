/**
 * Critical CSS for above-the-fold content
 * This CSS is inlined directly in the HTML head for faster FCP
 */

export const criticalCSS = `
  * { border-color: var(--color-border); }
  
  body {
    background-color: var(--color-background);
    color: var(--color-foreground);
    font-family: "Estedad", system-ui, sans-serif;
    font-weight: 400;
    margin: 0;
    min-height: 100vh;
  }
  
  /* Hero section - most critical */
  .landing-root {
    min-height: 100vh;
    overflow: hidden;
    background-color: var(--color-background);
    color: var(--color-foreground);
  }
  
  /* Basic typography */
  h1, h2, h3, h4, h5, h6 {
    font-family: "Lalezar", "Estedad", system-ui, sans-serif;
    font-weight: 400;
  }
  
  /* Above-the-fold elements */
  section {
    position: relative;
  }
  
  /* Main container */
  main {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 0 1rem;
  }
  
  /* Text alignment for RTL */
  [dir="rtl"] {
    direction: rtl;
    text-align: right;
  }
`;