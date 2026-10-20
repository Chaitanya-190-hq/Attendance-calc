const percentageSelect = document.getElementById("percentage");
const presentInput = document.getElementById("present");
const totalInput = document.getElementById("total");
const calculateBtn = document.getElementById("calculate");
const resultEl = document.getElementById("result");

calculateBtn.addEventListener("click", () => {
  const present = parseInt(presentInput.value, 10);
  const total = parseInt(totalInput.value, 10);
  const percentage = parseInt(percentageSelect.value, 10);

  if (isNaN(present) || isNaN(total) || isNaN(percentage)) {
    return (resultEl.innerHTML = invalidResult());
  }

  if (present < 0 || total <= 0 || present > total) {
    return (resultEl.innerHTML = invalidResult());
  }

  if (present / total >= percentage / 100) {
    const daysAvailableToBunk = daysToBunk(present, total, percentage);
    return (resultEl.innerHTML = bunkResult(daysAvailableToBunk, present, total, percentage));
  }

  const attendanceNeeded = reqAttendance(present, total, percentage);
  return (resultEl.innerHTML = attendResult(attendanceNeeded, present, total, percentage));
});

function invalidResult() {
  return `<p>Proper values please <span aria-label="shrug">¯\_(ツ)_/¯</span></p>`;
}

function bunkResult(daysAvailableToBunk, present, total, percentage) {
  const currentPct = ((present / total) * 100).toFixed(2);
  const afterTotal = total + daysAvailableToBunk;
  const afterPct = ((present / afterTotal) * 100).toFixed(2);

  return `
    <p>You can bunk for <strong>${daysAvailableToBunk}</strong> more day${daysAvailableToBunk === 1 ? "" : "s"}.</p>
    <p><span class="stat">Current Attendance: <strong>${present}/${total}</strong> → <strong>${currentPct}%</strong></span></p>
    <p><span class="stat">Attendance Then: <strong>${present}/${afterTotal}</strong> → <strong>${afterPct}%</strong></span></p>
  `;
}

function attendResult(attendanceNeeded, present, total, percentage) {
  const currentPct = ((present / total) * 100).toFixed(2);
  const afterPresent = present + attendanceNeeded;
  const afterTotal = total + attendanceNeeded;
  const afterPct = ((afterPresent / afterTotal) * 100).toFixed(2);

  return `
    <p>You need to attend <strong>${attendanceNeeded}</strong> more class${attendanceNeeded === 1 ? "" : "es"} to attain ${percentage}% attendance.</p>
    <p><span class="stat">Current Attendance: <strong>${present}/${total}</strong> → <strong>${currentPct}%</strong></span></p>
    <p><span class="stat">Attendance Required: <strong>${afterPresent}/${afterTotal}</strong> → <strong>${afterPct}%</strong></span></p>
  `;
}

function reqAttendance(present, total, percentage) {
  return Math.ceil((percentage * total - 100 * present) / (100 - percentage));
}

function daysToBunk(present, total, percentage) {
  return Math.floor((100 * present - percentage * total) / percentage);
}

// Keep the calculator responsive to Enter in either number field.
[presentInput, totalInput].forEach((input) => {
  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      calculateBtn.click();
    }
  });
});

// Reset the result if someone clears a field, so stale output never lingers.
[presentInput, totalInput].forEach((input) => {
  input.addEventListener("input", () => {
    if (input.value === "" || percentageSelect.value === "") {
      resultEl.innerHTML = "";
    }
  });
});
