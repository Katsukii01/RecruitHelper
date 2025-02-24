import * as XLSX from "xlsx";

export const exportApplicantsToExcel = (workbook, applicants) => {
  if (!applicants || !Array.isArray(applicants) || applicants.length === 0) {
    console.warn("⚠ No applicants data to export.");
    return;
  }

  // 🔹 Formatowanie danych aplikantów
  const formattedApplicants = applicants.map(app => ({
    Name: app.name || "N/A",
    Surname: app.surname || "N/A",
    Email: app.email || "N/A",
    Phone: app.phone || "N/A",
    "Education Level": app.educationLevel || "N/A",
    "Institution Name": app.institutionName || "N/A",
    "Education Field": app.educationField || "N/A",
    Experience: app.experience || "N/A",
    "Additional Info": app.additionalInformation || "N/A",
    "Skills": Array.isArray(app.skills) ? app.skills.join(", ") : "N/A",
    "Courses": Array.isArray(app.courses) ? app.courses.join(", ") : "N/A",
    "Languages": Array.isArray(app.languages)
      ? app.languages.map(lang => `${lang.language} (${lang.level})`).join(", ")
      : "N/A",
  }));

  // 🔹 Tworzymy arkusz aplikantów
  const applicantsSheet = XLSX.utils.json_to_sheet(formattedApplicants);

  // 🔹 Automatyczna szerokość kolumn na podstawie największego wpisu
  const columnWidths = Object.keys(formattedApplicants[0]).map((key, i) => ({
    wch: ["Skills", "Courses", "Languages"].includes(key) ? 40 : Math.max(
      key.length,
      ...formattedApplicants.map(row => (row[key] ? row[key].toString().length : 0))
    ) + 2
  }));
  applicantsSheet["!cols"] = columnWidths;

  // 🔹 Stylowanie nagłówków (pogrubienie, kolor, środek)
  const headerRange = XLSX.utils.decode_range(applicantsSheet["!ref"]);
  for (let C = headerRange.s.c; C <= headerRange.e.c; ++C) {
    const cellAddress = XLSX.utils.encode_cell({ r: 0, c: C });
    if (!applicantsSheet[cellAddress]) continue;
    applicantsSheet[cellAddress].s = {
      font: { bold: true, color: { rgb: "FFFFFF" } },
      fill: { fgColor: { rgb: "0070C0" } }, // 🔹 Niebieskie nagłówki
      alignment: { horizontal: "center" },
    };
  }

  // 🔹 Dodanie arkusza do workbooka
  XLSX.utils.book_append_sheet(workbook, applicantsSheet, "Applicants");

  console.log("✅ Applicants sheet added to workbook");

  // ===== 📊 WYKRESY W TYM SAMYM ARKUSZU =====

  // 🔹 Definicja wykresów na podstawie wyników
  const scoreFields = ["totalScore", "CVscore", "CLscore", "Meetingsscore", "Tasksscore", "adnationalPoints"];

  let rowOffset = formattedApplicants.length + 3; // 🔹 Gdzie zaczynamy wykresy (pod tabelą aplikantów)

  scoreFields.forEach((field) => {
    const chartData = applicants.map((app) => [app.name + " " + app.surname, app[field] || 0]);
    const headers =["Total Score (%)", "CV Score (%)", "Cover Letter Score (%)", "Meetings Score (%)", "Tasks Score (%)", "Adnational Points (%)"];
    chartData.unshift(["Applicant", headers[scoreFields.indexOf(field)]]);

    XLSX.utils.sheet_add_aoa(applicantsSheet, chartData, { origin: `A${rowOffset}` });

    rowOffset += applicants.length + 3; // 🔹 Odstęp między wykresami
  });


  console.log("✅ Charts added below applicants table");
};

export const exportOfferDataToExcel = (workbook, offerData) => {
  if (!offerData || typeof offerData !== "object") {
    console.warn("⚠ offerData is not an object or is undefined:", offerData);
    return;
  }

  // 🔹 Jeśli `offerData` jest pojedynczym obiektem, wrzucamy go do tablicy
  const formattedOfferData = Array.isArray(offerData) ? offerData[0] : offerData;

  // 🔹 Konwersja danych do formatu pionowego (klucz → wartość)
  const offerSheetData = Object.entries({
    "Job Title": formattedOfferData.jobTittle || "N/A",
    "Experience Needed": formattedOfferData.experienceNeeded || "N/A",
    "Education Level": formattedOfferData.educationLevel || "N/A",
    "Education Field": formattedOfferData.educationField || "N/A",
    "Courses": formattedOfferData.courses?.join(", ") || "N/A",
    "Skills": formattedOfferData.skills?.join(", ") || "N/A",
    "Languages": formattedOfferData.languages?.map(lang => `${lang.language} (${lang.level})`).join(", ") || "N/A",
  });

  // 🔹 Tworzymy tablicę dla XLSX (każdy wiersz: [klucz, wartość])
  const sheetData = [["Category", "Details"], ...offerSheetData];

  // 🔹 Tworzenie arkusza
  const offerDataSheet = XLSX.utils.aoa_to_sheet(sheetData);

  // 🔹 Automatyczna szerokość kolumn
  offerDataSheet["!cols"] = [
    { wch: Math.max(...sheetData.map(row => row[0].length)) + 2 }, // Szerokość kolumny "Category"
    { wch: Math.max(...sheetData.map(row => (row[1] ? row[1].toString().length : 0))) + 5 } // Szerokość kolumny "Details"
  ];

  // 🔹 Dodanie arkusza do workbooka
  XLSX.utils.book_append_sheet(workbook, offerDataSheet, "Offer Data");

  console.log("✅ Offer data added to workbook");
};

export const exportRecruitmentStats = (workbook, recruitmentStats) => {
  if (!recruitmentStats || typeof recruitmentStats !== "object") {
    console.warn("⚠ recruitmentStats is not an object or is undefined:", recruitmentStats);
    return;
  }

  // 🔹 Jeśli `recruitmentStats` jest pojedynczym obiektem, wrzucamy go do tablicy
  const formattedRecruitmentStats = Array.isArray(recruitmentStats) ? recruitmentStats[0] : recruitmentStats;

  // 🔹 Konwersja danych do formatu pionowego (klucz → wartość)
  const recruitmentStatsSheetData = [
    ["Category", "Details"],
    ["Total Applicants", formattedRecruitmentStats.totalApplicants || 0],
    ["Total Meetings Sessions", formattedRecruitmentStats.totalMeetings || 0],
    ["Total Tasks Sessions", formattedRecruitmentStats.totalTasks || 0],
    ["Hihest Total Score", formattedRecruitmentStats.highestTotalScore || 0],
    ["Average Total Score", formattedRecruitmentStats.averageTotalScore || 0],
    ["Current Stage", formattedRecruitmentStats.CurrentStage || "N/A"],
    ["Total Cover Letters Percentage", formattedRecruitmentStats.TotalCoverLettersPercentage || 0],
    ["", ""], // 🔹 Pusta linia dla czytelności
    ["Applicants in each stage", ""], // 🔹 Nagłówek dla etapów rekrutacji
  ];

  // 🔹 Etapy rekrutacji i liczba aplikantów
  const stages = [
    "Checked",
    "To be checked",
    "Rejected",
    "Tasks",
    "Invited for interview",
    "Interviewed",
    "Offered",
    "Hired",
  ];

  // 🔹 Pobieramy liczbę aplikantów dla każdego etapu, jeśli istnieją w danych
  stages.forEach(stage => {
    const count = formattedRecruitmentStats.ApplicantsInEachStage?.[stage] || 0;
    recruitmentStatsSheetData.push([`Applicants in ${stage}`, count]);
  });

  // 🔹 Tworzenie arkusza
  const recruitmentStatsSheet = XLSX.utils.aoa_to_sheet(recruitmentStatsSheetData);

  // 🔹 Automatyczna szerokość kolumn
  recruitmentStatsSheet["!cols"] = [
    { wch: Math.max(...recruitmentStatsSheetData.map(row => row[0].length)) + 2 }, // Szerokość kolumny "Category"
    { wch: Math.max(...recruitmentStatsSheetData.map(row => (row[1] ? row[1].toString().length : 0))) + 5 } // Szerokość kolumny "Details"
  ];

  // 🔹 Dodanie arkusza do workbooka
  XLSX.utils.book_append_sheet(workbook, recruitmentStatsSheet, "Recruitment Stats");

  console.log("✅ Recruitment stats added to workbook");
};


export const exportMeetings = (workbook, meetings) => {
  if (!meetings || !Array.isArray(meetings) || meetings.length === 0) {
    console.warn("⚠ Meetings data is missing or not an array:", meetings);
    return;
  }

  const sheetData = [];

  meetings.forEach(meeting => {
    sheetData.push(["Meeting Session Name", "Description", "Points Weight"]);
    sheetData.push([
      meeting.meetingSessionName || "N/A",
      meeting.meetingSessionDescription || "N/A",
      meeting.meetingSessionPointsWeight || "N/A",
    ]);

    // 🔹 Pusta linia dla czytelności między sesjami
    sheetData.push([]);

    // 🔹 Nagłówek dla spotkań pod sesją (tylko jeśli są jakieś spotkania)
    if (meeting.meetings && meeting.meetings.length > 0) {
      sheetData.push(["Meeting ID", "Applicant ID", "Date", "Time From", "Time To", "Meeting Link", "Points"]);

      meeting.meetings.forEach(meetingDetail => {
        sheetData.push([
          meetingDetail.id || "N/A",
          meetingDetail.applicantId || "N/A",
          meetingDetail.meetingDate || "N/A",
          meetingDetail.meetingTimeFrom || "N/A",
          meetingDetail.meetingTimeTo || "N/A",
          meetingDetail.meetingLink || "N/A",
          meetingDetail.points || "N/A",
        ]);
      });
    }

    // 🔹 Dodajemy trzy puste wiersze między sesjami dla lepszej czytelności
    sheetData.push([], [], []);
  });

  // 🔹 Tworzenie arkusza
  const meetingsSheet = XLSX.utils.aoa_to_sheet(sheetData);

  // 🔹 Dostosowanie szerokości kolumn do najdłuższej zawartości
  const columnWidths = sheetData[0].map((_, colIndex) => ({
    wch: Math.max(
      10, // Minimalna szerokość
      ...sheetData.map(row => (row[colIndex] ? row[colIndex].toString().length : 0))
    ) + 2
  }));
  meetingsSheet["!cols"] = columnWidths;

  // 🔹 Wyrównanie zawartości do lewej
  Object.keys(meetingsSheet).forEach(cell => {
    if (!cell.startsWith("!")) {
      meetingsSheet[cell].s = { alignment: { horizontal: "left" } };
    }
  });

  // 🔹 Dodanie arkusza do workbooka
  XLSX.utils.book_append_sheet(workbook, meetingsSheet, "Meetings");

  console.log("✅ Meetings data added to workbook with adjusted column widths and left alignment");
};

export const exportTasks = (workbook, tasks) => {
  if (!tasks || !Array.isArray(tasks) || tasks.length === 0) {
    console.warn("⚠ Tasks data is missing or not an array:", tasks);
    return;
  }

  
  const sheetData = [];
  tasks.forEach(task => {
    sheetData.push(["Task Session Name", "Description", "Points Weight"]);
    // 🔹 Add task session details row
    sheetData.push([
      task.taskSessionName || "N/A",
      task.taskSessionDescription || "N/A",
      task.taskSessionPointsWeight || "N/A",
    ]);

    // 🔹 Empty row for readability between sessions
    sheetData.push([]);

    // 🔹 Add header for tasks under the session (only if tasks exist)
    if (task.tasks && task.tasks.length > 0) {
      sheetData.push(["Task ID", "Applicant ID", "Task Name", "Task Link", "Points"]);

      task.tasks.forEach(taskDetail => {
        sheetData.push([
          taskDetail.id || "N/A",
          taskDetail.applicantId || "N/A",
          taskDetail.points || "N/A",
        ]);
      });
    }

    // 🔹 Add three empty rows between task sessions for better readability
    sheetData.push([], [], []);
  });

  // 🔹 Create worksheet
  const tasksSheet = XLSX.utils.aoa_to_sheet(sheetData);

  // 🔹 Adjust column widths dynamically based on the longest content
  const columnWidths = sheetData[0].map((_, colIndex) => ({
    wch: Math.max(
      10, // Minimum width
      ...sheetData.map(row => (row[colIndex] ? row[colIndex].toString().length : 0))
    ) + 2
  }));
  tasksSheet["!cols"] = columnWidths;

  // 🔹 Align all content to the left
  Object.keys(tasksSheet).forEach(cell => {
    if (!cell.startsWith("!")) {
      tasksSheet[cell].s = { alignment: { horizontal: "left" } };
    }
  });

  // 🔹 Add sheet to workbook
  XLSX.utils.book_append_sheet(workbook, tasksSheet, "Tasks");

  console.log("✅ Tasks data added to workbook with adjusted column widths and left alignment");
};

