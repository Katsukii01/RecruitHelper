//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
export const exportApplicantsToExcel = (workbook, applicants) => {
  if (!applicants || !Array.isArray(applicants) || applicants.length === 0) {
    console.warn("⚠ No applicants data to export.");
    return;
  }

  // 🔹 Tworzymy nowy arkusz
  const sheet = workbook.addWorksheet("Applicants");

  // 🔹 Definiujemy kolumny
  sheet.columns = [
    { header: "Name", key: "name", width: 15 },
    { header: "Surname", key: "surname", width: 15 },
    { header: "Email", key: "email", width: 25 },
    { header: "Phone", key: "phone", width: 15 },
    { header: "Education Level", key: "educationLevel", width: 20 },
    { header: "Institution Name", key: "institutionName", width: 25 },
    { header: "Education Field", key: "educationField", width: 20 },
    { header: "Experience", key: "experience", width: 15 },
    { header: "Skills", key: "skills", width: 40 },
    { header: "Courses", key: "courses", width: 40 },
    { header: "Languages", key: "languages", width: 40 },
    { header: "Additional Info", key: "additionalInformation", width: 30 },
  ];

  // 🔹 Stylizacja nagłówków (ciemnogranatowy dla lepszego kontrastu)
  const headerRow = sheet.getRow(1);
  headerRow.eachCell(cell => {
    cell.font = { bold: true, color: { argb: "FFFFFF" } };
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "1F4E78" } };
    cell.alignment = { horizontal: "center", vertical: "middle" };
    cell.border = { top: { style: "thick" }, bottom: { style: "thick" }, left: { style: "thin" }, right: { style: "thin" } };
    
  });


// 🔹 Dodanie danych aplikantów
applicants.forEach((app, index) => {
  const rowData = {
    name: app.name || "N/A",
    surname: app.surname || "N/A",
    email: app.email || "N/A",
    phone: app.phone || "N/A",
    educationLevel: app.educationLevel || "N/A",
    institutionName: app.institutionName || "N/A",
    educationField: app.educationField || "N/A",
    experience: app.experience || "N/A",
    skills: Array.isArray(app.skills) ? app.skills.join(", ") : "N/A",
    courses: Array.isArray(app.courses) ? app.courses.join(", ") : "N/A",
    languages: Array.isArray(app.languages)
      ? app.languages.map((lang) => `${lang.language} (${lang.level})`).join(", ")
      : "N/A",
    additionalInformation: app.additionalInformation || "N/A",
  };

  const row = sheet.addRow(rowData);

  // 🔹 Oblicz długość najdłuższego tekstu w wierszu
  const maxLength = Math.max(...Object.values(rowData).map(value => value.length));

  // 🔹 Dynamiczna wysokość wiersza na podstawie długości tekstu (20 px + 5 px na każde 50 znaków)
  row.height = 20 + Math.ceil(maxLength / 50) * 5;

  row.eachCell(cell => {
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: index % 2 === 0 ? "F2F2F2" : "D9E1F2" }, // Naprzemienne kolory
    };
    cell.border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };
    cell.alignment = { vertical: "middle", wrapText: true };
  });
});


  sheet.addRow([]);
  sheet.addRow([]);
  
  // 🔹 Definicja wyników
  const scoreFields = [
    { field: "totalScore", label: "Total Score (%)" },
    { field: "CVscore", label: "CV Score (%)" },
    { field: "CLscore", label: "Cover Letter Score (%)" },
    { field: "Meetingsscore", label: "Meetings Score (%)" },
    { field: "Tasksscore", label: "Tasks Score (%)" },
    { field: "adnationalPoints", label: "Adnational Points (%)" }
  ];

  // 🔹 Dodanie tabeli wyników
  scoreFields.forEach((scoreField) => {
    // Dodajemy nagłówki dla wyników
    const row = sheet.addRow(["Applicant", scoreField.label]);

    // Stylizacja nagłówków
    row.eachCell(cell => {
      cell.font = { bold: true, color: { argb: "FFFFFF" } };
      cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "333F50" } };
      cell.alignment = { horizontal: "center", vertical: "middle" };
      cell.border = { top: { style: "thick" }, bottom: { style: "thick" }, left: { style: "thin" }, right: { style: "thin" } };
    });
  
    // Dodajemy dane dla każdego aplikanta
    applicants.forEach((app, index) => {
      const score = app[scoreField.field] || 0;
      const rowData = [`${app.name} ${app.surname}`, score];
      const dataRow = sheet.addRow(rowData);

      // Zmieniamy kolor wiersza w tabeli wyników
      dataRow.eachCell(cell => {
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: index % 2 === 0 ? "E8F4FF" : "D9E1F2" }, // Naprzemienne kolory
        };
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
        cell.alignment = { vertical: "middle", wrapText: true };
      });


    });

    // 🔹 Dostosowanie szerokości kolumn w tabelach wyników do długości nagłówków
    const headerLength = Math.max(...scoreFields.map(sf => sf.label.length));
    sheet.getColumn(1).width = 15; // Szerokość dla kolumny "Applicant"
    sheet.getColumn(2).width = headerLength + 5; // Dostosowanie szerokości do długości nagłówka

    // Dodajemy odstęp między tabelami wyników
    sheet.addRow([]);
  });

};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const exportOfferDataToExcel = (workbook, offerData) => {
  if (!offerData || typeof offerData !== "object") {
    console.warn("⚠ offerData is not an object or is undefined:", offerData);
    return;
  }

  const formattedOfferData = Array.isArray(offerData) ? offerData[0] : offerData;

  const offerSheetData = Object.entries({
    "Job Title": formattedOfferData.jobTitle || "N/A",
    "Experience Needed": formattedOfferData.experienceNeeded || "N/A",
    "Education Level": formattedOfferData.educationLevel || "N/A",
    "Education Field": formattedOfferData.educationField || "N/A",
    "Courses": Array.isArray(formattedOfferData.courses) ? formattedOfferData.courses.join(", ") : "N/A",
    "Skills": Array.isArray(formattedOfferData.skills) ? formattedOfferData.skills.join(", ") : "N/A",
    "Languages": Array.isArray(formattedOfferData.languages)
      ? formattedOfferData.languages.map(lang => `${lang.language} (${lang.level})`).join(", ")
      : "N/A",
  });

  const sheet = workbook.addWorksheet("Offer Data");

  // 🔹 Definiujemy kolumny
  sheet.columns = [
    { header: "Category", key: "category", width: 35 },
    { header: "Details", key: "details", width: 70 },
  ];

  // 🔹 Stylizacja nagłówków (ciemnogranatowy dla lepszego kontrastu)
  const headerRow = sheet.getRow(1);
  headerRow.eachCell(cell => {
    cell.font = { bold: true, color: { argb: "FFFFFF" } };
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "1F4E78" } };
    cell.alignment = { horizontal: "center", vertical: "middle" };
    cell.border = { top: { style: "thick" }, bottom: { style: "thick" }, left: { style: "thin" }, right: { style: "thin" } };
  });

  // 🔹 Dodanie danych do arkusza z lepszym stylem
  offerSheetData.forEach(([category, details], index) => {
    const row = sheet.addRow({ category, details });

    row.eachCell(cell => {
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: index % 2 === 0 ? "F2F2F2" : "D9E1F2" }, // Naprzemienne kolory
      };
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
      cell.alignment = { vertical: "middle", wrapText: true };
    });

    // 🔹 Automatyczne dostosowanie wysokości wiersza dla Skills
    if (category === "Skills") {
      const estimatedLines = Math.ceil(details.length / 50); // Przyjmujemy ok. 50 znaków na linię
      row.height = Math.max(20, estimatedLines * 15); // Podstawowa wysokość + dodatkowe linie
    }
  });

  // 🔹 Automatyczne dopasowanie wysokości wierszy dla długich treści
  sheet.eachRow(row => {
    if (!row.height) {
      row.height = 20;
    }
  });
};


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const exportRecruitmentStats = (workbook, recruitmentStats) => {
  if (!recruitmentStats || typeof recruitmentStats !== "object") {
    console.warn("⚠ recruitmentStats is not an object or is undefined:", recruitmentStats);
    return;
  }

  const formattedRecruitmentStats = Array.isArray(recruitmentStats) ? recruitmentStats[0] : recruitmentStats;

  const recruitmentStatsSheetData = [
    ["Total Applicants", formattedRecruitmentStats.totalApplicants || 0],
    ["Total Meetings Sessions", formattedRecruitmentStats.totalMeetings || 0],
    ["Total Tasks Sessions", formattedRecruitmentStats.totalTasks || 0],
    ["Highest Total Score", formattedRecruitmentStats.highestTotalScore || 0],
    ["Average Total Score", formattedRecruitmentStats.averageTotalScore || 0],
    ["Current Stage", formattedRecruitmentStats.CurrentStage || "N/A"],
    ["Total Cover Letters Percentage", formattedRecruitmentStats.TotalCoverLettersPercentage || "0%"],
    ["", ""], // Pusta linia dla czytelności
    ["Applicants in Each Stage", ""], // 🔹 Ten wiersz dostaje styl nagłówka
  ];

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

  stages.forEach(stage => {
    const count = formattedRecruitmentStats.ApplicantsInEachStage?.[stage] || 0;
    recruitmentStatsSheetData.push([`Applicants in ${stage}`, count]);
  });

  const sheet = workbook.addWorksheet("Recruitment Stats");

  sheet.columns = [
    { header: "Category", key: "category", width: 35 },
    { header: "Details", key: "details", width: 25 },
  ];

  // 🔹 Stylizacja nagłówka (ciemnogranatowy)
  const headerRow = sheet.getRow(1);
  headerRow.eachCell(cell => {
    cell.font = { bold: true, color: { argb: "FFFFFF" } };
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "1F4E78" } };
    cell.alignment = { horizontal: "center", vertical: "middle" };
    cell.border = { top: { style: "thick" }, bottom: { style: "thick" }, left: { style: "thin" }, right: { style: "thin" } };
  });

  // 🔹 Dodanie danych do arkusza
  recruitmentStatsSheetData.forEach(([category, details], index) => {
    const row = sheet.addRow({ category, details });

    row.eachCell(cell => {
      if (category === "Applicants in Each Stage") {
        // 🔹 Stylizacja nagłówka dla "Applicants in Each Stage"
        cell.font = { bold: true, color: { argb: "FFFFFF" } };
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "333F50" } };
        cell.border = { top: { style: "thick" }, bottom: { style: "thick" }, left: { style: "thin" }, right: { style: "thin" } };
        cell.alignment = { horizontal: "center", vertical: "middle" };
      } else {
        // 🔹 Normalne komórki
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: index % 2 === 0 ? "E8F4FF" : "D9E1F2" },
        };
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
        cell.alignment = { horizontal: "center", vertical: "middle", wrapText: true };
      }
    });
  });

  // 🔹 Dopasowanie wysokości wierszy
  sheet.eachRow(row => {
    row.height = 20;
  });
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


export const exportMeetings = (workbook, meetings) => {
  if (!meetings || !Array.isArray(meetings) || meetings.length === 0) {
    console.warn("⚠ Meetings data is missing or not an array:", meetings);
    return;
  }

  const worksheet = workbook.addWorksheet("Meetings");

  meetings.forEach(meeting => {
    // 🔹 Nagłówek dla sesji spotkań (grubsza linia)
    const sessionHeader = worksheet.addRow(["Meeting Session Name", "Description", "Points Weight"]);
    sessionHeader.eachCell(cell => {
      cell.font = { bold: true, color: { argb: "FFFFFF" } };
      cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "333F50" } }; // Ciemny niebiesko-szary
      cell.alignment = { horizontal: "center", vertical: "middle" };
      cell.border = { bottom: { style: "thick", color: { argb: "000000" } } }; // Pogrubiona dolna linia
    });

    // 🔹 Dane sesji spotkań
    const sessionData = worksheet.addRow([
      meeting.meetingSessionName || "N/A",
      meeting.meetingSessionDescription || "N/A",
      meeting.meetingSessionPointsWeight || "N/A",
    ]);

    sessionData.eachCell(cell => {
      cell.font = { bold: true };
      cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "E8F4FF" } }; // Jasnoniebieskie tło
      cell.alignment = { horizontal: "left", vertical: "middle" };
      cell.border = { bottom: { style: "thin", color: { argb: "CCCCCC" } } };
    });

    worksheet.addRow([]); // Pusta linia dla czytelności

    if (meeting.meetings && meeting.meetings.length > 0) {
      // 🔹 Nagłówek dla pojedynczych spotkań (grubsza linia)
      const meetingsHeader = worksheet.addRow([
        "Meeting ID", "Applicant ID", "Date", "Time From", "Time To", "Points"
      ]);
      meetingsHeader.eachCell(cell => {
        cell.font = { bold: true, color: { argb: "FFFFFF" } };
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "1F4E78" } }; // Ciemnoniebieskie tło
        cell.alignment = { horizontal: "center", vertical: "middle" };
        cell.border = { bottom: { style: "thick", color: { argb: "000000" } } };
      });

      meeting.meetings.forEach((meetingDetail, index) => {
        const row = worksheet.addRow([
          meetingDetail.id || "N/A",
          meetingDetail.applicantId || "N/A",
          meetingDetail.meetingDate || "N/A",
          meetingDetail.meetingTimeFrom || "N/A",
          meetingDetail.meetingTimeTo || "N/A",
          meetingDetail.points || "N/A",
        ]);

        row.alignment = { horizontal: "left" };

        // 🔹 Alternatywne kolory dla lepszej czytelności (bardziej profesjonalne)
        row.eachCell(cell => {
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: index % 2 === 0 ? "F2F2F2" : "D9E1F2" }, // Szaro-niebieskie pasy
          };
          cell.border = { bottom: { style: "thin", color: { argb: "CCCCCC" } } };
        });
      });
    }

    // 🔹 Puste wiersze dla lepszej separacji sekcji
    worksheet.addRow([]);
    worksheet.addRow([]);
  });

  // 🔹 Automatyczne dopasowanie szerokości kolumn
  worksheet.columns.forEach(column => {
    let maxLength = 10;
    column.eachCell({ includeEmpty: true }, cell => {
      const cellLength = cell.value ? cell.value.toString().length : 0;
      if (cellLength > maxLength) {
        maxLength = cellLength;
      }
    });
    column.width = maxLength + 2;
  });
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const exportTasks = (workbook, tasks) => {
  if (!tasks || !Array.isArray(tasks) || tasks.length === 0) {
    console.warn("⚠ Tasks data is missing or not an array:", tasks);
    return;
  }

  const worksheet = workbook.addWorksheet("Tasks");

  tasks.forEach(task => {
    // 🔹 Nagłówek dla sesji zadań (gruba linia)
    const sessionHeader = worksheet.addRow(["Task Session Name", "Description", "Points Weight"]);
    sessionHeader.eachCell(cell => {
      cell.font = { bold: true, color: { argb: "FFFFFF" } };
      cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "333F50" } }; // Ciemnoniebiesko-szary
      cell.alignment = { horizontal: "center", vertical: "middle" };
      cell.border = { bottom: { style: "thick", color: { argb: "000000" } } }; // Gruba linia pod nagłówkiem
    });

    // 🔹 Dane sesji
    const sessionData = worksheet.addRow([
      task.taskSessionName || "N/A",
      task.taskSessionDescription || "N/A",
      task.taskSessionPointsWeight || "N/A",
    ]);

    sessionData.eachCell(cell => {
      cell.font = { bold: true };
      cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "E8F4FF" } }; // Jasnoniebieskie tło
      cell.alignment = { horizontal: "left", vertical: "middle" };
      cell.border = { bottom: { style: "thin", color: { argb: "CCCCCC" } } };
    });

    worksheet.addRow([]); // Pusta linia dla czytelności

    if (task.tasks && task.tasks.length > 0) {
      // 🔹 Nagłówek dla listy zadań (gruba linia)
      const tasksHeader = worksheet.addRow(["Task ID", "Applicant ID", "Points"]);
      tasksHeader.eachCell(cell => {
        cell.font = { bold: true, color: { argb: "FFFFFF" } };
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "1F4E78" } }; // Ciemnoniebieskie tło
        cell.alignment = { horizontal: "center", vertical: "middle" };
        cell.border = { bottom: { style: "thick", color: { argb: "000000" } } };
      });

      task.tasks.forEach((taskDetail, index) => {
        const row = worksheet.addRow([
          taskDetail.id || "N/A",
          taskDetail.applicantId || "N/A",
          taskDetail.points || "N/A",
        ]);

        row.alignment = { horizontal: "left" };

        // 🔹 Naprzemienne kolory dla lepszej czytelności (bardziej eleganckie)
        row.eachCell(cell => {
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: index % 2 === 0 ? "F2F2F2" : "D9E1F2" }, // Szaro-niebieskie pasy
          };
          cell.border = { bottom: { style: "thin", color: { argb: "CCCCCC" } } };
        });
      });
    }

    // 🔹 Puste wiersze dla lepszej separacji sekcji
    worksheet.addRow([]);
    worksheet.addRow([]);
  });

  // 🔹 Automatyczne dopasowanie szerokości kolumn
  worksheet.columns.forEach(column => {
    let maxLength = 10;
    column.eachCell({ includeEmpty: true }, cell => {
      const cellLength = cell.value ? cell.value.toString().length : 0;
      if (cellLength > maxLength) {
        maxLength = cellLength;
      }
    });
    column.width = maxLength + 2;
  });
};


