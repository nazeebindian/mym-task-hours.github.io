let filter = {
  EMPLOYEE: "all",
  DATE: "",
};

const datePicker = document.getElementById("datePicker");
const prevButton = document.getElementById("prevDate");
const nextButton = document.getElementById("nextDate");

// Initialize date picker with today's date
const today = new Date();
datePicker.valueAsDate = today;
filter.DATE = today;

// Function to adjust the date
function adjustDate(days) {
  const currentDate = new Date(datePicker.value);
  currentDate.setDate(currentDate.getDate() + days);
  datePicker.valueAsDate = currentDate;
  filter.DATE = currentDate;
  loadData();
}

// Event listeners for buttons
prevButton.addEventListener("click", () => adjustDate(-1)); // Go to previous day
nextButton.addEventListener("click", () => adjustDate(1)); // Go to next day

// Function to format date as YYYY-MM-DD
function formatDateToYYYYMMDD(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Ensure two digits
  const day = String(date.getDate()).padStart(2, "0"); // Ensure two digits
  return `${year}-${month}-${day}`;
}

function formatDate(rawDate) {
  const dateMatch = /Date\((\d+),(\d+),(\d+)\)/.exec(rawDate);
  if (dateMatch) {
    const year = parseInt(dateMatch[1], 10);
    const month = parseInt(dateMatch[2], 10); // JavaScript months are 0-indexed
    const day = parseInt(dateMatch[3], 10);
    const formattedDate = new Date(year, month, day).toLocaleDateString(
      "en-US",
      {
        month: "short",
        day: "numeric",
        year: "numeric",
      }
    );
    return formattedDate;
  }
  return rawDate; // Return raw date if the format doesn't match
}
async function loadData() {
  const {EMPLOYEE = "all", DATE} = filter;
  try {
    // Make the backend call to fetch data
    const dataArray = [];
    let tasksArray = [];
    let timeInArray = [];
    let timeOutArray = [];

    const SHEET_ID = "1X9MNBQpWpv8wlLJrmZ133TQ8REO9s1OHHiYS1_bzlvQ";
    const GID = "1606761809";
    let QUERY = `SELECT *`;
    if (EMPLOYEE !== "all") {
      QUERY = `${QUERY} WHERE B="${EMPLOYEE}"`;
    }
    if (DATE && EMPLOYEE !== "all") {
      QUERY = `${QUERY} AND C = date '${formatDateToYYYYMMDD(DATE)}'`;
    } else {
      QUERY = `${QUERY} WHERE C = date '${formatDateToYYYYMMDD(DATE)}'`;
    }
    QUERY = `${QUERY} ORDER BY A DESC`;
    const res = await readGsheetData(SHEET_ID, GID, QUERY);
    const columns = [...res?.table?.cols];
    res?.table?.rows?.map((item) => {
      const productObj = {};
      columns?.map((header, i) => {
        productObj[header?.label] = item?.c?.[i]?.v;
        return "";
      });
      dataArray?.push(productObj);
      return "";
    });

    // Populate table with data
    const tableBody = document.querySelector("#data-table tbody");
    tableBody.innerHTML = "";
    tasksArray = dataArray?.filter(
      (item) =>
        item?.TASK !== "IN-TIME" &&
        item?.TASK !== "OUT-TIME" &&
        item?.TASK !== "BREAK-TIME"
    );
    if (EMPLOYEE !== "all") {
      timeInArray = dataArray?.filter((item) => item?.TASK === "IN-TIME");
      timeOutArray = dataArray?.filter((item) => item?.TASK === "OUT-TIME");
      breakTimeArray = dataArray?.filter((item) => item?.TASK === "BREAK-TIME");
      // Updating HTML elements dynamically
      document.getElementById("dateInput").value =
        formatDateToYYYYMMDD(DATE) || "";
      document.getElementById("nameInput").value = EMPLOYEE || "";

      document.getElementById("inDateInput").value =
        formatDateToYYYYMMDD(DATE) || "";
      document.getElementById("inNameInput").value = EMPLOYEE || "";
      document.getElementById("outDateInput").value =
        formatDateToYYYYMMDD(DATE) || "";
      document.getElementById("outNameInput").value = EMPLOYEE || "";
      document.getElementById("breakDateInput").value =
        formatDateToYYYYMMDD(DATE) || "";
      document.getElementById("breakNameInput").value = EMPLOYEE || "";

      document.getElementById("breakTime").value =
        breakTimeArray?.[0]?.VALUE || "";
      document.getElementById("inTime").value = timeInArray?.[0]?.VALUE || "";
      document.getElementById("outTime").value = timeOutArray?.[0]?.VALUE || "";
    }
    tasksArray.forEach((row) => {
      const tr = document.createElement("tr");
      // Add each column value to the row
      tr.innerHTML = `
          <td>${formatDate(row.DATE) || ""}</td>
          <td>${row?.EMPLOYEE || ""}</td>
          <td>${row?.TASK || ""}</td>
          <td>${row?.VALUE || ""}</td>
          `;
      tableBody.appendChild(tr);
    });
  } catch (error) {
    console.error("Failed to load data:", error);
  }
}

// Load data when the page loads
loadData();

// Add event listener to dropdown
document.querySelector("#data-filter").addEventListener("change", (event) => {
  filter.EMPLOYEE = event.target.value;
  loadData();
});

document
  .getElementById("data-form1")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const formData = new FormData(this);
    const url =
      "https://docs.google.com/forms/u/0/d/e/1FAIpQLSdrkEzUm1Xz3EwpF647bzH3fHfcEkc-wldGKNuOuO80Y6-0zg/formResponse"; // Replace with your form action URL

    fetch(url, {
      method: "POST",
      mode: "no-cors",
      body: formData,
    })
      .then((response) => {
        // document.getElementById('status').textContent = 'Form submitted successfully!';
        setTimeout(loadData, 2000);
      })
      .catch((error) => {
        console.error("Error submitting form:", error);
        document.getElementById("status").textContent =
          "Error submitting form.";
      });
  });

document
  .getElementById("data-form2")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const formData = new FormData(this);
    const url =
      "https://docs.google.com/forms/u/0/d/e/1FAIpQLSdrkEzUm1Xz3EwpF647bzH3fHfcEkc-wldGKNuOuO80Y6-0zg/formResponse"; // Replace with your form action URL

    fetch(url, {
      method: "POST",
      mode: "no-cors",
      body: formData,
    })
      .then((response) => {
        // document.getElementById('status').textContent = 'Form submitted successfully!';
        setTimeout(loadData, 2000);
      })
      .catch((error) => {
        console.error("Error submitting form:", error);
        document.getElementById("status").textContent =
          "Error submitting form.";
      });
  });

document
  .getElementById("data-form3")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const formData = new FormData(this);
    const url =
      "https://docs.google.com/forms/u/0/d/e/1FAIpQLSdrkEzUm1Xz3EwpF647bzH3fHfcEkc-wldGKNuOuO80Y6-0zg/formResponse"; // Replace with your form action URL

    fetch(url, {
      method: "POST",
      mode: "no-cors",
      body: formData,
    })
      .then((response) => {
        // document.getElementById('status').textContent = 'Form submitted successfully!';
        document.getElementById("data-form3").reset();
        setTimeout(loadData, 2000);
      })
      .catch((error) => {
        console.error("Error submitting form:", error);
        document.getElementById("status").textContent =
          "Error submitting form.";
      });
  });

document
  .getElementById("data-form4")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const formData = new FormData(this);
    const url =
      "https://docs.google.com/forms/u/0/d/e/1FAIpQLSdrkEzUm1Xz3EwpF647bzH3fHfcEkc-wldGKNuOuO80Y6-0zg/formResponse"; // Replace with your form action URL

    fetch(url, {
      method: "POST",
      mode: "no-cors",
      body: formData,
    })
      .then((response) => {
        // document.getElementById('status').textContent = 'Form submitted successfully!';
        setTimeout(loadData, 2000);
      })
      .catch((error) => {
        console.error("Error submitting form:", error);
        document.getElementById("status").textContent =
          "Error submitting form.";
      });
  });
