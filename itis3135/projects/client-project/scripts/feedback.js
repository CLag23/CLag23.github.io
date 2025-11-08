document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("feedbackForm");
  if (!form) return;

  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const messageInput = document.getElementById("message");
  const goBackButton = document.getElementById("goBackButton");

  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  function validate() {
    let ok = true;

    const nameVal = (nameInput.value || "").trim();
    if (nameVal.length < 2) {
      nameInput.setCustomValidity("Please enter your name (at least 2 characters).");
      ok = false;
    } else {
      nameInput.setCustomValidity("");
    }

    const emailVal = (emailInput.value || "").trim();
    if (!isValidEmail(emailVal)) {
      emailInput.setCustomValidity("Please enter a valid email address.");
      ok = false;
    } else {
      emailInput.setCustomValidity("");
    }

    const messageVal = (messageInput.value || "").trim();
    if (messageVal.length < 5) {
      messageInput.setCustomValidity("Please enter a message (at least 5 characters).");
      ok = false;
    } else {
      messageInput.setCustomValidity("");
    }

    return ok;
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function buildOutputHtml() {
    const nameVal = escapeHtml((nameInput.value || "").trim());
    const emailVal = escapeHtml((emailInput.value || "").trim());
    const messageVal = escapeHtml((messageInput.value || "").trim());

    return `
      <section id="feedbackOutput">
        <h2>Thank you, ${nameVal}!</h2>
        <p>Your inquiry has been recorded. We’ll contact you at <strong>${emailVal}</strong>.</p>
        <h3>Your Message</h3>
        <blockquote>${messageVal}</blockquote>
        <p><a href="#" id="sendAnother">Send another message</a></p>
      </section>
    `;
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    if (!validate()) {
      form.reportValidity();
      return;
    }

    const outputHtml = buildOutputHtml();
    let outputSection = document.getElementById("feedbackOutput");

    if (!outputSection) {
      const wrapper = document.createElement("section");
      wrapper.innerHTML = outputHtml;
      outputSection = wrapper.firstElementChild;
      form.parentNode.insertBefore(outputSection, form);
    } else {
      outputSection.outerHTML = outputHtml;
      outputSection = document.getElementById("feedbackOutput");
    }

    form.style.display = "none";
    outputSection.scrollIntoView({ behavior: "smooth", block: "start" });

    const sendAnother = document.getElementById("sendAnother");
    if (sendAnother) {
      sendAnother.addEventListener("click", (ev) => {
        ev.preventDefault();
        outputSection.remove();
        form.reset();
        form.style.display = "";
        form.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  });

  form.addEventListener("reset", () => {
    nameInput.setCustomValidity("");
    emailInput.setCustomValidity("");
    messageInput.setCustomValidity("");
  });

  if (goBackButton) {
    goBackButton.addEventListener("click", () => {
      if (history.length > 1) {
        history.back();
      } else {
        window.location.href = "../index.html";
      }
    });
  }
});

