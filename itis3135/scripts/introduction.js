let coursesFieldset = null;
let addCourseButton = null;
let courseCount = 0;

function wireClearButton(formElement) {
  const clearButton = formElement.querySelector("#clearButton");
  if (!clearButton) {
    return;
  }

  clearButton.addEventListener("click", () => {
    formElement.querySelectorAll("input, textarea").forEach((field) => {
      field.value = "";
    });
    const previewImage = document.getElementById("picture-preview");
  if (previewImage) {
    previewImage.src = "";
    previewImage.style.display = "none";
  }
  });
}

function getExistingCourseCount(fieldset) {
  return fieldset.querySelectorAll("input[id^='course'][id$='Dept']").length;
}

function ensureAddCourseButton(fieldset) {
  const existingButton = fieldset.querySelector("#addCourseButton");
  if (existingButton) {
    return existingButton;
  }

  const button = document.createElement("button");
  button.type = "button";
  button.id = "addCourseButton";
  button.textContent = "Add Another Course";
  fieldset.appendChild(button);
  return button;
}

function createCourseContainer(index) {
  const courseContainer = document.createElement("div");
  courseContainer.className = "course-group";
  courseContainer.dataset.courseIndex = String(index);
  courseContainer.innerHTML = `
    <label for="course${index}Dept">Department</label>
    <input
      type="text"
      id="course${index}Dept"
      name="course${index}Dept"
      placeholder="Enter Department (e.g., ITIS)"
    />
    <label for="course${index}Num">Number</label>
    <input
      type="text"
      id="course${index}Num"
      name="course${index}Num"
      placeholder="Enter Course Number"
    />
    <label for="course${index}Name">Name</label>
    <input
      type="text"
      id="course${index}Name"
      name="course${index}Name"
      placeholder="Enter Course Name"
    />
    <label for="course${index}Reason">Reason</label>
    <textarea
      id="course${index}Reason"
      name="course${index}Reason"
      placeholder="Why are you taking this course?"
    ></textarea>
  `;
  return courseContainer;
}

function addDeleteButton(courseContainer) {
  const deleteButton = document.createElement("button");
  deleteButton.type = "button";
  deleteButton.className = "delete-course-button";
  deleteButton.textContent = "Remove Course";
  courseContainer.appendChild(deleteButton);
}

function handleCourseFieldsetClick(event) {
  const target = event.target;
  if (
    !(target instanceof HTMLButtonElement) ||
    !target.classList.contains("delete-course-button")
  ) {
    return;
  }

  const courseContainer = target.closest(".course-group");
  if (!courseContainer) {
    return;
  }

  courseContainer.remove();
}

function addCourseTextBoxes() {
  if (!coursesFieldset || !addCourseButton) {
    return;
  }

  courseCount += 1;

  const courseContainer = createCourseContainer(courseCount);
  addDeleteButton(courseContainer);

  coursesFieldset.insertBefore(courseContainer, addCourseButton);
}


function buildIntroductionPreviewHtml(form) {
  const get = (id) => {
    const el = form.querySelector(`#${id}`);
    return el ? ("value" in el ? el.value : el.textContent || "") : "";
  };

  const firstName = get("firstName").trim();
  const lastName = get("lastName").trim();
  const fullName = [firstName, lastName].filter(Boolean).join(" ");
  const personalBackground = get("personalBackground").trim();
  const professionalBackground = get("professionalBackground").trim();
  const academicBackground = get("academicBackground").trim();
  const primaryComputer = get("primaryComputer").trim();
  const previewImgEl = document.getElementById("picture-preview");
  const imageSrc = previewImgEl && previewImgEl.src ? previewImgEl.src : "./images/mypic.jpg";
  const caption = get("caption").trim() || fullName || "";

  
  const courses = [];
  const deptInputs = form.querySelectorAll("input[id^='course'][id$='Dept']");
  deptInputs.forEach((deptEl) => {
    const id = deptEl.id; 
    const index = id.replace(/^course/, "").replace(/Dept$/, "");
    const dept = deptEl.value.trim();
    const numEl = form.querySelector(`#course${index}Num`);
    const nameEl = form.querySelector(`#course${index}Name`);
    const reasonEl = form.querySelector(`#course${index}Reason`);
    const num = numEl ? numEl.value.trim() : "";
    const name = nameEl ? nameEl.value.trim() : "";
    const reason = reasonEl ? reasonEl.value.trim() : "";
    if (dept || num || name || reason) {
      courses.push({ dept, num, name, reason });
    }
  });

  const coursesList = courses
    .map((c) => {
      const title = `${c.dept || ""} ${c.num || ""}`.trim();
      const strong = title || c.name ? `<strong>${[title, c.name].filter(Boolean).join(" - ")}</strong>` : "";
      const text = c.reason ? `: ${c.reason}` : "";
      return `<li>${strong}${text}</li>`;
    })
    .join("\n");

  return `
    <h2>${fullName || ""}</h2>
    <figure>
      <img src="${imageSrc}" alt="A picture of ${fullName || "me"}" width="200" height="300">
      <figcaption>${fullName || caption}</figcaption>
    </figure>

    <h3>Personal Background</h3>
    <p>${personalBackground || ""}</p>

    <h3>Professional Background</h3>
    <p>${professionalBackground || ""}</p>

    <h3>Academic Background</h3>
    <p>${academicBackground || ""}</p>

    <h3>Primary Computer</h3>
    <p>${primaryComputer || ""}</p>

    ${courses.length ? `<h3>Courses</h3>
    <ul>
      ${coursesList}
    </ul>` : ""}

    <p><a href="#" id="restartFormLink">Reset and edit again</a></p>
  `;
}

function initIntroductionForm() {
  const formElement = document.querySelector("form");
  if (!formElement) {
    return;
  }

  wireClearButton(formElement);
  
  formElement.addEventListener("submit", (event) => {
    event.preventDefault();
    const outputHtml = buildIntroductionPreviewHtml(formElement);
    let outputSection = document.getElementById("introductionOutput");
    if (!outputSection) {
      outputSection = document.createElement("section");
      outputSection.id = "introductionOutput";
    }
    outputSection.innerHTML = outputHtml;

    
    if (!outputSection.isConnected && formElement.parentNode) {
      formElement.parentNode.insertBefore(outputSection, formElement);
    }
    formElement.style.display = "none";

    
    const restart = outputSection.querySelector("#restartFormLink");
    if (restart) {
      restart.addEventListener("click", (e) => {
        e.preventDefault();
        outputSection.remove();
        
        formElement.reset();
        formElement.style.display = "";
        const preview = formElement.querySelector('#picture-preview');
        if (preview) {
          preview.src = './images/mypic.jpg';
          preview.style.display = 'block';
        }
        formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }

    outputSection.scrollIntoView({ behavior: "smooth", block: "start" });
  });
  

  coursesFieldset = Array.from(formElement.querySelectorAll("fieldset")).find(
    (fieldset) => {
      const legend = fieldset.querySelector("legend");
      return (
        legend && typeof legend.textContent === "string" && legend.textContent.includes("Courses")
      );
    }
  );

  if (!coursesFieldset) {
    return;
  }

  courseCount = getExistingCourseCount(coursesFieldset);
  addCourseButton = ensureAddCourseButton(coursesFieldset);

  if (!addCourseButton.dataset.listenerAttached) {
    addCourseButton.addEventListener("click", addCourseTextBoxes);
    addCourseButton.dataset.listenerAttached = "true";
  }

  if (!coursesFieldset.dataset.removeListenerAttached) {
    coursesFieldset.addEventListener("click", handleCourseFieldsetClick);
    coursesFieldset.dataset.removeListenerAttached = "true";
  }
}

document.addEventListener("DOMContentLoaded", initIntroductionForm);

if (typeof window !== "undefined") {
  window.addCourseTextBoxes = addCourseTextBoxes;
}

const pictureInput = document.getElementById("picture");
const previewImage = document.getElementById("picture-preview");
if (pictureInput && previewImage) {
  pictureInput.addEventListener("change", () => {
    const file = pictureInput.files[0];
    if (file) {
      previewImage.src = URL.createObjectURL(file);
      previewImage.style.display = "block";
    }
  });
}




