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

function initIntroductionForm() {
  const formElement = document.querySelector("form");
  if (!formElement) {
    return;
  }

  wireClearButton(formElement);
  formElement.addEventListener("submit", (event) => event.preventDefault());

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
