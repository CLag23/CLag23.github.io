(() => {
  const DEFAULT_HEADING_TEXT = "Introduction Form";
  const JSON_HEADING_TEXT = "Introduction HTML";
  const DEFAULT_IMAGE_SRC = "./images/mypic.jpg";

  const linkFieldMap = [
    { id: "linkedin", name: "LinkedIn" },
    { id: "github", name: "GitHub" },
    { id: "githubPages", name: "GitHub Pages" },
    { id: "cltWeb", name: "CLT Web" },
    { id: "personalSite", name: "Personal Website" }
  ];

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function getInputValue(form, selector) {
    const element = form.querySelector(selector);
    if (!element) {
      return "";
    }

    if ("value" in element) {
      return element.value.trim();
    }

    return (element.textContent || "").trim();
  }

  function resolveImageSource(previewElement) {
    if (!previewElement) {
      return DEFAULT_IMAGE_SRC;
    }
    return DEFAULT_IMAGE_SRC;
  }

  function buildCourses(form) {
    const courseGroups = form.querySelectorAll(".course-group");
    return Array.from(courseGroups)
      .map((group) => {
        const dept = (group.querySelector("input[id$='Dept']")?.value || "").trim();
        const number = (group.querySelector("input[id$='Num']")?.value || "").trim();
        const name = (group.querySelector("input[id$='Name']")?.value || "").trim();
        const reason = (group.querySelector("textarea[id$='Reason']")?.value || "").trim();

        if (!dept && !number && !name && !reason) {
          return null;
        }

        return {
          department: dept,
          number,
          name,
          reason
        };
      })
      .filter((course) => course !== null);
  }

  function buildLinks(form) {
    return linkFieldMap
      .map(({ id, name }) => {
        const href = getInputValue(form, `#${id}`);
        if (!href) {
          return null;
        }
        return { name, href };
      })
      .filter((link) => link !== null);
  }

  function buildJsonData(form) {
    const firstName = getInputValue(form, "#firstName");
    const middleName = getInputValue(form, "#middleName");
    const lastName = getInputValue(form, "#lastName");
    const fullName = [firstName, middleName, lastName].filter(Boolean).join(" ").trim();
    const divider = getInputValue(form, "#divider");
    const mascotAdjective = getInputValue(form, "#mascotAdj");
    const mascotAnimal = getInputValue(form, "#mascotAnimal");
    const imageCaption = getInputValue(form, "#caption");
    const personalStatement = getInputValue(form, "#personalStatement");
    const personalBackground = getInputValue(form, "#personalBackground");
    const professionalBackground = getInputValue(form, "#professionalBackground");
    const academicBackground = getInputValue(form, "#academicBackground");
    const primaryComputer = getInputValue(form, "#primaryComputer");
    const acknowledgmentStatement = getInputValue(form, "#ackSatement");
    const quoteText = getInputValue(form, "#quote");
    const quoteAuthor = getInputValue(form, "#quoteAuthor");
    const previewImage = document.getElementById("picture-preview");
    const image = resolveImageSource(previewImage);

    const courses = buildCourses(form);
    const links = buildLinks(form);

    const data = {
      firstName,
      middleName,
      lastName,
      fullName,
      divider,
      mascotAdjective,
      mascotAnimal,
      image,
      imageCaption,
      acknowledgmentStatement,
      personalStatement,
      personalBackground,
      professionalBackground,
      academicBackground,
      primaryComputer,
      courses,
      links
    };

    if (quoteText || quoteAuthor) {
      data.quote = {
        text: quoteText,
        author: quoteAuthor
      };
    }

    return data;
  }

  function highlightJson(codeElement) {
    if (codeElement && window.hljs && typeof window.hljs.highlightElement === "function") {
      window.hljs.highlightElement(codeElement);
    }
  }

  function initJsonGenerator() {
    const form = document.querySelector("form");
    const jsonButton = document.getElementById("jsonButton");
    if (!form || !jsonButton) {
      return;
    }

    const mainHeading = form.closest("main")?.querySelector("h2") || null;
    const instructionsHeading =
      form.previousElementSibling instanceof HTMLElement ? form.previousElementSibling : null;
    const originalHeadingText = mainHeading?.textContent?.trim() || DEFAULT_HEADING_TEXT;

    jsonButton.addEventListener("click", (event) => {
      event.preventDefault();

      if (typeof form.reportValidity === "function" && !form.reportValidity()) {
        return;
      }

      const jsonData = buildJsonData(form);
      const jsonString = JSON.stringify(jsonData, null, 2);
      let outputSection = document.getElementById("jsonOutput");

      if (!outputSection) {
        outputSection = document.createElement("section");
        outputSection.id = "jsonOutput";
      }

      outputSection.innerHTML = `
        <h3>Generated JSON</h3>
        <section class="json-output">
          <pre><code class="language-json">${escapeHtml(jsonString)}</code></pre>
        </section>
        <p><a href="#" id="jsonRestartLink">Reset and edit again</a></p>
      `;

      if (!outputSection.isConnected && form.parentNode) {
        form.parentNode.insertBefore(outputSection, form);
      }

      form.style.display = "none";
      if (instructionsHeading) {
        instructionsHeading.style.display = "none";
      }
      if (mainHeading) {
        mainHeading.textContent = JSON_HEADING_TEXT;
      }

      const codeElement = outputSection.querySelector("code");
      highlightJson(codeElement);

      const restartLink = outputSection.querySelector("#jsonRestartLink");
      if (restartLink && !restartLink.dataset.listenerAttached) {
        restartLink.addEventListener("click", (e) => {
          e.preventDefault();
          outputSection.remove();
          form.reset();
          form.style.display = "";
          if (instructionsHeading) {
            instructionsHeading.style.display = "";
          }
          if (mainHeading) {
            mainHeading.textContent = originalHeadingText || DEFAULT_HEADING_TEXT;
          }
          const picturePreview = form.querySelector("#picture-preview");
          if (picturePreview) {
            picturePreview.src = DEFAULT_IMAGE_SRC;
            picturePreview.style.display = "block";
          }
          form.scrollIntoView({ behavior: "smooth", block: "start" });
        });
        restartLink.dataset.listenerAttached = "true";
      }
    });
  }

  document.addEventListener("DOMContentLoaded", initJsonGenerator);
})();
