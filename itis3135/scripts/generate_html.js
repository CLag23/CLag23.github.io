(() => {
  const DEFAULT_HEADING_TEXT = "Introduction Form";
  const OUTPUT_HEADING_TEXT = "Introduction HTML";
  const DEFAULT_IMAGE_SRC = "./images/mypic.jpg";

  const linkFieldMap = [
    { id: "linkedin", name: "LinkedIn" },
    { id: "github", name: "GitHub" },
    { id: "githubPages", name: "GitHub Pages" },
    { id: "cltWeb", name: "CLT Web" },
    { id: "personalSite", name: "Personal Website" }
  ];

  function escapeHtmlText(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function escapeHtmlAttribute(value) {
    return escapeHtmlText(value).replace(/"/g, "&quot;").replace(/'/g, "&#39;");
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

    const attributeValue = previewElement.getAttribute("src");
    if (attributeValue && attributeValue.trim() !== "") {
      return attributeValue.trim();
    }

    const computedSrc = previewElement.src || "";
    if (computedSrc) {
      try {
        const parsedUrl = new URL(computedSrc, window.location.href);
        if (parsedUrl.origin === window.location.origin) {
          return parsedUrl.pathname + parsedUrl.search + parsedUrl.hash;
        }
        return parsedUrl.href;
      } catch (_error) {
        return computedSrc;
      }
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

  function buildDecoratedName(firstName, middleName, lastName, divider, mascotAdj, mascotAnimal) {
    const fullNameParts = [firstName, middleName, lastName].filter(Boolean);
    const fullName = fullNameParts.join(" ").trim();
    const decoratedParts = [];

    if (fullName) {
      decoratedParts.push(fullName);
    }

    if (divider && (decoratedParts.length || mascotAdj || mascotAnimal)) {
      decoratedParts.push(divider);
    }

    const mascotDisplay = [mascotAdj, mascotAnimal].filter(Boolean).join(" ").trim();
    if (mascotDisplay) {
      decoratedParts.push(mascotDisplay);
    }

    return {
      fullName,
      decoratedName: decoratedParts.join(" ").trim()
    };
  }

  function buildCoursesMarkup(courses) {
    if (!courses.length) {
      return "";
    }

    const courseItems = courses
      .map((course) => {
        const strongParts = [course.department, course.number].filter(Boolean).join(" ").trim();
        const namePart = course.name ? escapeHtmlText(course.name) : "";
        const strongContentParts = [];
        if (strongParts) {
          strongContentParts.push(escapeHtmlText(strongParts));
        }
        if (namePart) {
          strongContentParts.push(namePart);
        }
        const strongContent = strongContentParts.join(" - ");
        const reasonText = course.reason ? `: ${escapeHtmlText(course.reason)}` : "";

        return [
          "            <li>",
          `                <strong>${strongContent}</strong>${reasonText}`,
          "            </li>"
        ].join("\n");
      })
      .join("\n");

    return [
      "    <li>",
      "        <strong>Courses:</strong>",
      "        <ul>",
      courseItems,
      "        </ul>",
      "    </li>"
    ].join("\n");
  }

  function buildLinksMarkup(links) {
    if (!links.length) {
      return "";
    }

    const linkItems = links
      .map((link) => {
        const linkName = escapeHtmlText(link.name);
        const hrefValue = escapeHtmlAttribute(link.href);
        return [
          "            <li>",
          `                <a href="${hrefValue}">${linkName}</a>`,
          "            </li>"
        ].join("\n");
      })
      .join("\n");

    return [
      "    <li>",
      "        <strong>Links:</strong>",
      "        <ul>",
      linkItems,
      "        </ul>",
      "    </li>"
    ].join("\n");
  }

  function buildHtmlMarkup(form) {
    const firstName = getInputValue(form, "#firstName");
    const middleName = getInputValue(form, "#middleName");
    const lastName = getInputValue(form, "#lastName");
    const divider = getInputValue(form, "#divider");
    const mascotAdj = getInputValue(form, "#mascotAdj");
    const mascotAnimal = getInputValue(form, "#mascotAnimal");
    const acknowledgmentStatement = getInputValue(form, "#ackSatement");
    const personalStatement = getInputValue(form, "#personalStatement");
    const personalBackground = getInputValue(form, "#personalBackground");
    const professionalBackground = getInputValue(form, "#professionalBackground");
    const academicBackground = getInputValue(form, "#academicBackground");
    const primaryComputer = getInputValue(form, "#primaryComputer");
    const imageCaption = getInputValue(form, "#caption");
    const quoteText = getInputValue(form, "#quote");
    const quoteAuthor = getInputValue(form, "#quoteAuthor");

    const previewImage = document.getElementById("picture-preview");
    const imageSrc = resolveImageSource(previewImage);

    const courses = buildCourses(form);
    const links = buildLinks(form);

    const { fullName, decoratedName } = buildDecoratedName(
      firstName,
      middleName,
      lastName,
      divider,
      mascotAdj,
      mascotAnimal
    );

    const figureLines = [
      "<figure>",
      "    <img",
      `        src="${escapeHtmlAttribute(imageSrc)}"`,
      `        alt="${escapeHtmlAttribute(`Headshot of ${fullName || "me"}`)}"`,
      "    />"
    ];

    if (imageCaption) {
      figureLines.push(`    <figcaption>${escapeHtmlText(imageCaption)}</figcaption>`);
    }

    figureLines.push("</figure>");

    const listItems = [];

    if (personalBackground) {
      listItems.push(
        [
          "    <li>",
          `        <strong>Personal Background:</strong> ${escapeHtmlText(personalBackground)}`,
          "    </li>"
        ].join("\n")
      );
    }

    if (professionalBackground) {
      listItems.push(
        [
          "    <li>",
          `        <strong>Professional Background:</strong> ${escapeHtmlText(professionalBackground)}`,
          "    </li>"
        ].join("\n")
      );
    }

    if (academicBackground) {
      listItems.push(
        [
          "    <li>",
          `        <strong>Academic Background:</strong> ${escapeHtmlText(academicBackground)}`,
          "    </li>"
        ].join("\n")
      );
    }

    if (primaryComputer) {
      listItems.push(
        [
          "    <li>",
          `        <strong>Primary Computer:</strong> ${escapeHtmlText(primaryComputer)}`,
          "    </li>"
        ].join("\n")
      );
    }

    const coursesMarkup = buildCoursesMarkup(courses);
    if (coursesMarkup) {
      listItems.push(coursesMarkup);
    }

    const linksMarkup = buildLinksMarkup(links);
    if (linksMarkup) {
      listItems.push(linksMarkup);
    }

    const listLines =
      listItems.length > 0
        ? ["<ul>", listItems.join("\n"), "</ul>"].join("\n")
        : "";

    const lines = [
      `<h2>${OUTPUT_HEADING_TEXT}</h2>`
    ];

    if (decoratedName) {
      lines.push(`<h3>${escapeHtmlText(decoratedName)}</h3>`);
    } else if (fullName) {
      lines.push(`<h3>${escapeHtmlText(fullName)}</h3>`);
    }

    lines.push(...figureLines);

    if (acknowledgmentStatement) {
      lines.push(`<p>${escapeHtmlText(acknowledgmentStatement)}</p>`);
    }

    if (personalStatement) {
      lines.push(`<p>${escapeHtmlText(personalStatement)}</p>`);
    }

    if (listLines) {
      lines.push(listLines);
    }

    if (quoteText || quoteAuthor) {
      const quoteLines = ["<blockquote>"];
      if (quoteText) {
        quoteLines.push(`    <p>${escapeHtmlText(quoteText)}</p>`);
      }
      if (quoteAuthor) {
        quoteLines.push(`    <cite>${escapeHtmlText(quoteAuthor)}</cite>`);
      }
      quoteLines.push("</blockquote>");
      lines.push(quoteLines.join("\n"));
    }

    return lines.join("\n");
  }

  function highlightHtml(codeElement) {
    if (codeElement && window.hljs && typeof window.hljs.highlightElement === "function") {
      window.hljs.highlightElement(codeElement);
    }
  }

  function initHtmlGenerator() {
    const form = document.querySelector("form");
    const htmlButton = document.getElementById("htmlButton");
    if (!form || !htmlButton) {
      return;
    }

    const mainHeading = form.closest("main")?.querySelector("h2") || null;
    const instructionsHeading =
      form.previousElementSibling instanceof HTMLElement ? form.previousElementSibling : null;
    const originalHeadingText = mainHeading?.textContent?.trim() || DEFAULT_HEADING_TEXT;

    htmlButton.addEventListener("click", (event) => {
      event.preventDefault();

      if (typeof form.reportValidity === "function" && !form.reportValidity()) {
        return;
      }

      const htmlMarkup = buildHtmlMarkup(form);
      let outputSection = document.getElementById("htmlOutput");

      if (!outputSection) {
        outputSection = document.createElement("section");
        outputSection.id = "htmlOutput";
      }

      outputSection.innerHTML = `
        <h3>Generated HTML</h3>
        <section class="html-output">
          <pre><code class="language-html"></code></pre>
        </section>
        <p><a href="#" id="htmlRestartLink">Reset and edit again</a></p>
      `;

      if (!outputSection.isConnected && form.parentNode) {
        form.parentNode.insertBefore(outputSection, form);
      }

      const codeElement = outputSection.querySelector("code");
      if (codeElement) {
        codeElement.textContent = htmlMarkup;
        highlightHtml(codeElement);
      }

      form.style.display = "none";
      if (instructionsHeading) {
        instructionsHeading.style.display = "none";
      }
      if (mainHeading) {
        mainHeading.textContent = OUTPUT_HEADING_TEXT;
      }

      const restartLink = outputSection.querySelector("#htmlRestartLink");
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

      outputSection.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  document.addEventListener("DOMContentLoaded", initHtmlGenerator);
})();
